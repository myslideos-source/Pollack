-- Addresses findings from Supabase's security/performance advisors after the initial schema:
-- 1) set_updated_at() had a mutable search_path.
-- 2) publish_all_drafts()/restore_last_version() don't need to be anon-callable (they already
--    self-check is_staff(), but revoking anon EXECUTE removes the attempt surface entirely).
--    is_staff()/is_admin()/current_profile_role() intentionally stay anon+authenticated
--    executable — they're called *inside* RLS USING/WITH CHECK expressions evaluated for those
--    roles, so revoking EXECUTE there would break RLS itself, not just the direct RPC call.
-- 3) auth.uid() re-evaluated per row in profiles policies — wrap as (select auth.uid()).
-- 4) Missing covering indexes on foreign key columns.
-- 5) Redundant duplicate-permissive-SELECT policies where a staff "for all" policy overlaps
--    with a public "select visible" policy — split the staff policies into insert/update/delete.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.publish_all_drafts(uuid) from anon;
revoke execute on function public.restore_last_version(uuid, uuid) from anon;

drop policy "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy "profiles_update_own_limited_or_admin" on public.profiles;
create policy "profiles_update_own_limited_or_admin" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (
    (id = (select auth.uid()) and role = public.current_profile_role())
    or public.is_admin()
  );

create index appointments_created_by_idx on public.appointments (created_by);
create index audit_logs_actor_id_idx on public.audit_logs (actor_id);
create index content_versions_published_by_idx on public.content_versions (published_by);
create index inquiries_assigned_to_idx on public.inquiries (assigned_to);
create index inquiry_notes_author_id_idx on public.inquiry_notes (author_id);
create index media_poster_media_id_idx on public.media (poster_media_id);
create index media_uploaded_by_idx on public.media (uploaded_by);
create index partners_logo_media_id_idx on public.partners (logo_media_id);
create index products_image_media_id_idx on public.products (image_media_id);
create index products_partner_id_idx on public.products (partner_id);
create index site_settings_updated_by_idx on public.site_settings (updated_by);
create index team_members_photo_media_id_idx on public.team_members (photo_media_id);
create index website_drafts_updated_by_idx on public.website_drafts (updated_by);
create index website_sections_updated_by_idx on public.website_sections (updated_by);

drop policy "offers_staff_write" on public.offers;
create policy "offers_staff_insert" on public.offers for insert to authenticated with check (public.is_staff());
create policy "offers_staff_update" on public.offers for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "offers_staff_delete" on public.offers for delete to authenticated using (public.is_staff());

drop policy "opening_hours_staff_write" on public.opening_hours;
create policy "opening_hours_staff_insert" on public.opening_hours for insert to authenticated with check (public.is_staff());
create policy "opening_hours_staff_update" on public.opening_hours for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "opening_hours_staff_delete" on public.opening_hours for delete to authenticated using (public.is_staff());

drop policy "special_opening_hours_staff_write" on public.special_opening_hours;
create policy "special_opening_hours_staff_insert" on public.special_opening_hours for insert to authenticated with check (public.is_staff());
create policy "special_opening_hours_staff_update" on public.special_opening_hours for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "special_opening_hours_staff_delete" on public.special_opening_hours for delete to authenticated using (public.is_staff());

drop policy "partners_staff_write" on public.partners;
create policy "partners_staff_insert" on public.partners for insert to authenticated with check (public.is_staff());
create policy "partners_staff_update" on public.partners for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "partners_staff_delete" on public.partners for delete to authenticated using (public.is_staff());

drop policy "products_staff_write" on public.products;
create policy "products_staff_insert" on public.products for insert to authenticated with check (public.is_staff());
create policy "products_staff_update" on public.products for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "products_staff_delete" on public.products for delete to authenticated using (public.is_staff());

drop policy "team_members_staff_write" on public.team_members;
create policy "team_members_staff_insert" on public.team_members for insert to authenticated with check (public.is_staff());
create policy "team_members_staff_update" on public.team_members for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "team_members_staff_delete" on public.team_members for delete to authenticated using (public.is_staff());

drop policy "website_sections_staff_write" on public.website_sections;
create policy "website_sections_staff_insert" on public.website_sections for insert to authenticated with check (public.is_staff());
create policy "website_sections_staff_update" on public.website_sections for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "website_sections_staff_delete" on public.website_sections for delete to authenticated using (public.is_staff());

drop policy "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_insert" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "site_settings_admin_update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "site_settings_admin_delete" on public.site_settings for delete to authenticated using (public.is_admin());
