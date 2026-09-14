-- Minimal, privacy-conscious first-party visit counter for the admin dashboard's "Besucher
-- diese Woche" tile. Stores nothing but an anonymous, randomly generated session id and a
-- timestamp — no IP address, no user agent, no cross-site identifiers. Rows are write-only for
-- anonymous visitors and never readable except through the aggregate count function below.

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  created_at timestamptz not null default now()
);

create index page_views_created_at_idx on public.page_views (created_at);

alter table public.page_views enable row level security;

create policy "page_views_anon_insert" on public.page_views
  for insert to anon, authenticated with check (true);

-- No select policy at all: rows are never directly readable, only through the aggregate
-- function below, which returns nothing but a count.

create or replace function public.get_weekly_visitor_count()
returns integer
language sql
stable security definer
set search_path = public
as $$
  select count(distinct session_id)::integer
  from public.page_views
  where created_at >= now() - interval '7 days';
$$;

revoke all on function public.get_weekly_visitor_count from public;
grant execute on function public.get_weekly_visitor_count to authenticated;

-- Housekeeping: drop rows older than 90 days so this table can't grow unbounded. Called
-- opportunistically; not scheduled (no pg_cron in this project) — safe to run manually or
-- skip entirely, it only ever removes data older than the dashboard ever reads.
create or replace function public.prune_old_page_views()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.page_views where created_at < now() - interval '90 days';
$$;

revoke all on function public.prune_old_page_views from public;
grant execute on function public.prune_old_page_views to authenticated;
