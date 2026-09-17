-- Sportpark Pollack — Studio-Check-ins ("Live im Studio")
-- New, additive table for physical studio visits (arrival/departure at the gym) — a distinct
-- concept from workout_sessions (a logged training session inside the member portal). No
-- existing table covers this, so this is genuinely new, not a duplicate. Enabled for Supabase
-- Realtime so the admin dashboard's live occupancy count updates without polling.

create table public.studio_visits (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_out_at timestamptz,
  source text not null default 'manual' check (source in ('manual', 'kiosk', 'app', 'import')),
  auto_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger studio_visits_set_updated_at
  before update on public.studio_visits
  for each row execute function public.set_updated_at();

create index studio_visits_member_idx on public.studio_visits (member_id, checked_in_at desc);
-- Fast "who's currently in the studio" lookup: open visits (no checkout yet).
create index studio_visits_open_idx on public.studio_visits (checked_in_at) where checked_out_at is null;
create index studio_visits_checked_in_at_idx on public.studio_visits (checked_in_at);

alter table public.studio_visits enable row level security;

create policy "studio_visits_select" on public.studio_visits
  for select to authenticated
  using (public.is_staff() or member_id = auth.uid());

create policy "studio_visits_staff_write" on public.studio_visits
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

alter publication supabase_realtime add table public.studio_visits;
