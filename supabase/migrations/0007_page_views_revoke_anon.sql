-- This Supabase project has an ALTER DEFAULT PRIVILEGES rule granting EXECUTE on every new
-- function in schema public directly to anon (not routed through PUBLIC), so the earlier
-- "revoke all ... from public" in 0006 didn't actually strip anon access — same issue already
-- found and fixed for publish_all_drafts/restore_last_version in 0003_advisor_fixes.sql. Revoke
-- anon directly here too: get_weekly_visitor_count() returns an aggregate (low sensitivity) but
-- has no reason to be public, and prune_old_page_views() issues a DELETE and must never be
-- anon-callable.
revoke execute on function public.get_weekly_visitor_count() from anon;
revoke execute on function public.prune_old_page_views() from anon;
