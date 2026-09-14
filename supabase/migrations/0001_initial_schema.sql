-- Sportpark Pollack Admin — initial schema
-- Tables, helper functions, triggers and Row Level Security policies for the whole admin
-- system: auth/profiles, inquiries, website content (draft/publish), media, commerce data
-- (offers/partners/products), opening hours, team, settings, and audit logging.

create extension if not exists "pgcrypto";

-- =========================================================================================
-- Helpers
-- =========================================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================================
-- profiles — one row per admin/editor user, mirrors auth.users. No public self-signup: rows
-- are only ever created by the invite flow (server-side, service role).
-- =========================================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'redakteur')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- security definer + fixed search_path: safe to call from RLS policies (incl. on profiles
-- itself) without recursive-RLS evaluation, per Supabase's documented pattern for role checks.
create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'redakteur')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_limited_or_admin" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    -- Non-admins may update their own row, but never their own role.
    (id = auth.uid() and role = public.current_profile_role())
    or public.is_admin()
  );

create policy "profiles_insert_admin_only" on public.profiles
  for insert to authenticated
  with check (public.is_admin());

create policy "profiles_delete_admin_only" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- =========================================================================================
-- inquiries — contact / trial-training submissions from the public site.
-- Public (anon) may only INSERT, via the submit_inquiry() function below — never SELECT.
-- =========================================================================================

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  area text not null check (area in (
    'fitness', 'milon', 'five', 'koerperanalyse', 'karate', 'kinderkarate',
    'selbstverteidigung', 'yoga', 'regeneration', 'hansefit', 'allgemein'
  )),
  preferred_date text,
  message text,
  consent boolean not null default false,
  source text not null check (source in ('kontakt', 'probetraining')),
  status text not null default 'neu' check (status in (
    'neu', 'gelesen', 'in_bearbeitung', 'rueckruf_geplant', 'termin_vereinbart',
    'erledigt', 'abgesagt', 'spam'
  )),
  assigned_to uuid references public.profiles (id) on delete set null,
  callback_date timestamptz,
  archived boolean not null default false,
  ip_hash text
);

create index inquiries_status_idx on public.inquiries (status);
create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_ip_hash_created_at_idx on public.inquiries (ip_hash, created_at);

create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

alter table public.inquiries enable row level security;

create policy "inquiries_staff_select" on public.inquiries
  for select to authenticated using (public.is_staff());

create policy "inquiries_staff_update" on public.inquiries
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "inquiries_staff_delete" on public.inquiries
  for delete to authenticated using (public.is_staff());

-- No INSERT policy for anon/authenticated: all inserts go through submit_inquiry() below,
-- which runs as SECURITY DEFINER and enforces safe defaults + a basic rate limit.
create or replace function public.submit_inquiry(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_area text,
  p_preferred_date text,
  p_message text,
  p_consent boolean,
  p_source text,
  p_ip_hash text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_recent_count integer;
begin
  if p_consent is distinct from true then
    raise exception 'consent_required' using errcode = '22023';
  end if;

  if p_first_name is null or length(trim(p_first_name)) = 0
    or p_last_name is null or length(trim(p_last_name)) = 0
    or p_email is null or length(trim(p_email)) = 0
    or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  if p_ip_hash is not null then
    select count(*) into v_recent_count
    from public.inquiries
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';

    if v_recent_count >= 5 then
      raise exception 'rate_limited' using errcode = '22023';
    end if;
  end if;

  insert into public.inquiries (
    first_name, last_name, email, phone, area, preferred_date, message,
    consent, source, ip_hash, status
  ) values (
    trim(p_first_name), trim(p_last_name), trim(p_email), nullif(trim(p_phone), ''),
    p_area, nullif(trim(p_preferred_date), ''), nullif(trim(p_message), ''),
    true, p_source, p_ip_hash, 'neu'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_inquiry from public;
grant execute on function public.submit_inquiry to anon, authenticated;

-- =========================================================================================
-- inquiry_notes — internal staff notes on an inquiry. Staff-only, no public access at all.
-- =========================================================================================

create table public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create index inquiry_notes_inquiry_id_idx on public.inquiry_notes (inquiry_id);

alter table public.inquiry_notes enable row level security;

create policy "inquiry_notes_staff_all" on public.inquiry_notes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- appointments — trial trainings / callbacks scheduled from an inquiry (or standalone).
-- =========================================================================================

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries (id) on delete set null,
  title text not null,
  appointment_type text not null check (
    appointment_type in ('probetraining', 'beratung', 'rueckruf', 'sonstiges')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'geplant' check (
    status in ('geplant', 'bestaetigt', 'abgeschlossen', 'abgesagt')
  ),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_starts_at_idx on public.appointments (starts_at);
create index appointments_inquiry_id_idx on public.appointments (inquiry_id);

create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

alter table public.appointments enable row level security;

create policy "appointments_staff_all" on public.appointments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- website_sections — published, live content for editable areas of the public site.
-- website_drafts — pending, unpublished edits (one row per section with a pending change).
-- content_versions — snapshot of the previously-published state, taken every time a section
-- is published, so the admin can restore it.
-- =========================================================================================

create table public.website_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section_key text not null,
  page text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create index website_sections_page_idx on public.website_sections (page);

create trigger website_sections_set_updated_at
  before update on public.website_sections
  for each row execute function public.set_updated_at();

alter table public.website_sections enable row level security;

create policy "website_sections_public_select_visible" on public.website_sections
  for select to anon, authenticated using (visible = true or public.is_staff());

create policy "website_sections_staff_write" on public.website_sections
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create table public.website_drafts (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null unique references public.website_sections (id) on delete cascade,
  content jsonb not null,
  sort_order integer not null,
  visible boolean not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

alter table public.website_drafts enable row level security;

create policy "website_drafts_staff_all" on public.website_drafts
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.website_sections (id) on delete cascade,
  content jsonb not null,
  sort_order integer not null,
  visible boolean not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles (id) on delete set null
);

create index content_versions_section_id_idx on public.content_versions (section_id, published_at desc);

alter table public.content_versions enable row level security;

create policy "content_versions_staff_select" on public.content_versions
  for select to authenticated using (public.is_staff());

-- Publishes every section that currently has a pending draft, in one transaction: snapshots
-- the current published state into content_versions, copies the draft into website_sections,
-- then removes the consumed draft rows. Returns the number of sections published.
create or replace function public.publish_all_drafts(p_actor uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_draft record;
begin
  if not public.is_staff() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  for v_draft in select * from public.website_drafts loop
    insert into public.content_versions (section_id, content, sort_order, visible, published_by)
    select id, content, sort_order, visible, p_actor
    from public.website_sections
    where id = v_draft.section_id;

    update public.website_sections
    set content = v_draft.content,
        sort_order = v_draft.sort_order,
        visible = v_draft.visible,
        updated_by = p_actor
    where id = v_draft.section_id;

    delete from public.website_drafts where id = v_draft.id;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke all on function public.publish_all_drafts from public;
grant execute on function public.publish_all_drafts to authenticated;

-- Restores the most recent content_versions snapshot for a section (i.e. undoes the last
-- publish). The current live state is itself snapshotted first, so restoring is reversible.
create or replace function public.restore_last_version(p_section_id uuid, p_actor uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version record;
begin
  if not public.is_staff() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select * into v_version
  from public.content_versions
  where section_id = p_section_id
  order by published_at desc
  limit 1;

  if not found then
    return false;
  end if;

  insert into public.content_versions (section_id, content, sort_order, visible, published_by)
  select id, content, sort_order, visible, p_actor
  from public.website_sections
  where id = p_section_id;

  update public.website_sections
  set content = v_version.content,
      sort_order = v_version.sort_order,
      visible = v_version.visible,
      updated_by = p_actor
  where id = p_section_id;

  delete from public.content_versions where id = v_version.id;
  delete from public.website_drafts where section_id = p_section_id;

  return true;
end;
$$;

revoke all on function public.restore_last_version from public;
grant execute on function public.restore_last_version to authenticated;

-- =========================================================================================
-- media — central media library (Supabase Storage holds the bytes, this table holds metadata).
-- =========================================================================================

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null,
  storage_path text not null unique,
  file_type text not null check (file_type in ('image', 'video')),
  mime_type text not null,
  file_size bigint not null default 0,
  title text not null,
  alt_text text,
  area text,
  width integer,
  height integer,
  crop jsonb,
  poster_media_id uuid references public.media (id) on delete set null,
  sort_order integer not null default 0,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index media_area_idx on public.media (area);

alter table public.media enable row level security;

create policy "media_public_select" on public.media
  for select to anon, authenticated using (true);

create policy "media_staff_write" on public.media
  for insert to authenticated with check (public.is_staff());

create policy "media_staff_update" on public.media
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "media_staff_delete" on public.media
  for delete to authenticated using (public.is_staff());

-- =========================================================================================
-- offers — pricing/tariffs/promotions.
-- =========================================================================================

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (
    category in ('mitgliedschaft', 'probetraining', 'aktion', 'einmalig')
  ),
  price_cents integer,
  price_note text,
  billing_period text,
  contract_duration text,
  description text,
  features jsonb not null default '[]'::jsonb,
  highlighted boolean not null default false,
  valid_from date,
  valid_to date,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger offers_set_updated_at
  before update on public.offers
  for each row execute function public.set_updated_at();

alter table public.offers enable row level security;

create policy "offers_public_select_published" on public.offers
  for select to anon, authenticated using (published = true or public.is_staff());

create policy "offers_staff_write" on public.offers
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- opening_hours — weekly recurring hours, multiple ranges per weekday supported (e.g.
-- morning + afternoon), matching the site's existing split-hours model.
-- special_opening_hours — holidays, temporary notices, one-off overrides.
-- =========================================================================================

create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  weekday text not null check (weekday in ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
  open_time time,
  close_time time,
  closed boolean not null default false,
  sort_order integer not null default 0
);

create index opening_hours_weekday_idx on public.opening_hours (weekday, sort_order);

alter table public.opening_hours enable row level security;

create policy "opening_hours_public_select" on public.opening_hours
  for select to anon, authenticated using (true);

create policy "opening_hours_staff_write" on public.opening_hours
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create table public.special_opening_hours (
  id uuid primary key default gen_random_uuid(),
  date_from date not null,
  date_to date,
  label text not null,
  open_time time,
  close_time time,
  closed boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create index special_opening_hours_date_idx on public.special_opening_hours (date_from, date_to);

alter table public.special_opening_hours enable row level security;

create policy "special_opening_hours_public_select" on public.special_opening_hours
  for select to anon, authenticated using (true);

create policy "special_opening_hours_staff_write" on public.special_opening_hours
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- partners / products — Hansefit, MORE Nutrition, ESN etc. No payment functionality.
-- =========================================================================================

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_media_id uuid references public.media (id) on delete set null,
  description text,
  link_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;

create policy "partners_public_select_visible" on public.partners
  for select to anon, authenticated using (visible = true or public.is_staff());

create policy "partners_staff_write" on public.partners
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create table public.products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners (id) on delete set null,
  name text not null,
  category text,
  description text,
  image_media_id uuid references public.media (id) on delete set null,
  available_in_store boolean not null default true,
  recommended boolean not null default false,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "products_public_select_visible" on public.products
  for select to anon, authenticated using (visible = true or public.is_staff());

create policy "products_staff_write" on public.products
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- team_members — including Jürgen Pollack's owner profile (is_owner = true).
-- =========================================================================================

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text,
  photo_media_id uuid references public.media (id) on delete set null,
  bio text,
  qualifications jsonb not null default '[]'::jsonb,
  focus_areas jsonb not null default '[]'::jsonb,
  contact_email text,
  contact_phone text,
  is_owner boolean not null default false,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.team_members enable row level security;

create policy "team_members_public_select_visible" on public.team_members
  for select to anon, authenticated using (visible = true or public.is_staff());

create policy "team_members_staff_write" on public.team_members
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- =========================================================================================
-- site_settings — small key/value store for operational settings (e.g. notification email).
-- =========================================================================================

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "site_settings_admin_select" on public.site_settings
  for select to authenticated using (public.is_admin());

create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- =========================================================================================
-- audit_logs — who changed what, when. Never stores passwords/tokens or raw inquiry PII —
-- only small, structured summaries/diffs.
-- =========================================================================================

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  summary text not null,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

alter table public.audit_logs enable row level security;

create policy "audit_logs_staff_select" on public.audit_logs
  for select to authenticated using (public.is_staff());

create policy "audit_logs_staff_insert" on public.audit_logs
  for insert to authenticated with check (public.is_staff());
