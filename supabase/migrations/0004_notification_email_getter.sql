-- Lets the public submit_inquiry() flow (and any other anon/staff caller) read the configured
-- notification email without granting direct SELECT on site_settings to anon. Also seeds the
-- initial address so new-inquiry notifications work out of the box before an admin visits
-- Einstellungen.

create or replace function public.get_notification_email()
returns text
language sql
stable security definer
set search_path = public
as $$
  select value #>> '{}' from public.site_settings where key = 'notification_email';
$$;

revoke all on function public.get_notification_email from public;
grant execute on function public.get_notification_email to anon, authenticated;

insert into public.site_settings (key, value)
values ('notification_email', '"info@sportpark-pollack.de"'::jsonb)
on conflict (key) do nothing;
