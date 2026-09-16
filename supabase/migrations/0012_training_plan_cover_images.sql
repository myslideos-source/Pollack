-- Sportpark Pollack — Trainingsplan-Titelbilder (Redesign-Kit)
-- Adds a cover photo per training_plan_days row (the day the member/admin dashboards show as
-- "Heute: <Titel>" — e.g. "Unterkörper") so the new photo-hero design never needs a hardcoded
-- image. Reuses the existing media-library pattern (a `*_media_id` FK resolved via
-- resolveMedia(), which already carries the focal-point crop from `media.crop`) instead of
-- inventing new position columns — the same mechanism already used for program/partner images.
-- Purely additive.

alter table public.training_plan_days
  add column cover_media_id uuid references public.media (id) on delete set null,
  add column cover_alt text;

comment on column public.training_plan_days.cover_media_id is
  'Optional cover photo for this training day, from the media library. Falls back to a local category default when unset.';
comment on column public.training_plan_days.cover_alt is
  'Day-specific alt text override for cover_media_id; falls back to the media row''s own alt_text, then the day title.';
