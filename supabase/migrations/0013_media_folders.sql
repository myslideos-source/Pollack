-- Sportpark Pollack — Medien-Ordner
-- Ersetzt die feste, hartkodierte "Bereich"-Auswahl in der Medienbibliothek durch echte,
-- vom Admin frei anlegbare Ordner. Rein additiv: media.area bleibt bestehen (von nichts
-- außerhalb der Medienseite gelesen), media.folder_id ist die neue, primäre Ablage.

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media_folders enable row level security;

create policy "media_folders_staff_select" on public.media_folders
  for select to authenticated using (public.is_staff());

create policy "media_folders_staff_write" on public.media_folders
  for insert to authenticated with check (public.is_staff());

create policy "media_folders_staff_update" on public.media_folders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "media_folders_staff_delete" on public.media_folders
  for delete to authenticated using (public.is_staff());

alter table public.media
  add column folder_id uuid references public.media_folders (id) on delete set null;

create index media_folder_id_idx on public.media (folder_id);

-- Seed folders matching the previous fixed "area" list, then move existing media into them, so
-- nothing already categorized appears to lose its place.
insert into public.media_folders (name, sort_order) values
  ('Hero', 1),
  ('Training', 2),
  ('Gesundheit', 3),
  ('Kampfkunst', 4),
  ('Regeneration', 5),
  ('Partner & Produkte', 6),
  ('Team', 7),
  ('Community', 8);

update public.media set folder_id = (select id from public.media_folders where name = 'Hero') where area = 'hero';
update public.media set folder_id = (select id from public.media_folders where name = 'Training') where area = 'training';
update public.media set folder_id = (select id from public.media_folders where name = 'Gesundheit') where area = 'gesundheit';
update public.media set folder_id = (select id from public.media_folders where name = 'Kampfkunst') where area = 'kampfkunst';
update public.media set folder_id = (select id from public.media_folders where name = 'Regeneration') where area = 'regeneration';
update public.media set folder_id = (select id from public.media_folders where name = 'Partner & Produkte') where area = 'partner';
update public.media set folder_id = (select id from public.media_folders where name = 'Team') where area = 'team';
update public.media set folder_id = (select id from public.media_folders where name = 'Community') where area = 'community';
