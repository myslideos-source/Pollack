-- Sportpark Pollack — Digitale Mitgliedskarte
-- One card per member (1:1 with profiles, same pattern as member_profiles), holding only what
-- the card itself needs to render + a non-PII QR token. No existing table covers this: profiles
-- has no membership-number/tariff/validity concept, and offers is the public pricing catalog,
-- not a per-member assignment. Genuinely new, not a duplicate.

create sequence public.membership_card_number_seq;

-- SECURITY DEFINER so the column default below can call nextval() without granting sequence
-- usage to authenticated directly — mirrors the is_admin()/is_staff() helper pattern.
create or replace function public.generate_membership_card_number()
returns text
language sql
security definer
set search_path = public
as $$
  select 'SP-' || extract(year from now())::text || '-' || lpad(nextval('public.membership_card_number_seq')::text, 6, '0');
$$;

revoke all on function public.generate_membership_card_number from public;
grant execute on function public.generate_membership_card_number to authenticated;

create table public.membership_cards (
  member_id uuid primary key references public.profiles (id) on delete cascade,
  card_number text not null unique default public.generate_membership_card_number(),
  member_since date not null default current_date,
  tariff text,
  valid_from date,
  valid_until date,
  status text not null default 'active' check (status in ('active', 'paused', 'locked', 'expired')),
  qr_token uuid not null default gen_random_uuid() unique,
  qr_token_version integer not null default 1,
  note text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked_at timestamptz
);

create trigger membership_cards_set_updated_at
  before update on public.membership_cards
  for each row execute function public.set_updated_at();

alter table public.membership_cards enable row level security;

-- A member reads only their own card; trainer/admin (the roles that already reach the member
-- detail page via requireTrainerOrAdmin) can see every card for status badges + the admin
-- section. Redakteur (is_staff() but not is_trainer_or_admin()) deliberately has no access —
-- membership cards are not a CMS concern.
create policy "membership_cards_select" on public.membership_cards
  for select to authenticated
  using (member_id = auth.uid() or public.is_trainer_or_admin());

-- Writes are admin-only, not "any staff" — a trainer must not gain the ability to lock/unlock
-- a member's card or mint QR tokens just because they can view the member.
create policy "membership_cards_admin_insert" on public.membership_cards
  for insert to authenticated
  with check (public.is_admin());

create policy "membership_cards_admin_update" on public.membership_cards
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "membership_cards_admin_delete" on public.membership_cards
  for delete to authenticated
  using (public.is_admin());
