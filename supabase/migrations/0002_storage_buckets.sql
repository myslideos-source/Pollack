-- Storage buckets for the media library. `media-public` holds everything shown on the public
-- site (images/videos) and is world-readable, matching a marketing site with no private media.
-- `avatars` is a small separate bucket for team-member/staff profile photos, kept apart mainly
-- for tidy organisation and independent size limits.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media-public', 'media-public', true, 104857600,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/quicktime']
  ),
  (
    'avatars', 'avatars', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;

-- Public read on both buckets (public marketing assets — no private media in this system).
create policy "media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media-public', 'avatars'));

-- Only staff (admin/redakteur) may write. Uses the same is_staff() helper as the app tables.
create policy "media_public_staff_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media-public', 'avatars') and public.is_staff());

create policy "media_public_staff_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('media-public', 'avatars') and public.is_staff())
  with check (bucket_id in ('media-public', 'avatars') and public.is_staff());

create policy "media_public_staff_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media-public', 'avatars') and public.is_staff());
