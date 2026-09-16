-- Sportpark Pollack — "Sportpark Milestones" Erfolge-System
-- Ersetzt die bisherige, transient berechnete Achievement-Liste (nur ein Toast nach dem
-- Training, ein einziges Icon für alle Typen) durch einen echten, dauerhaften Katalog mit
-- Kategorien, Stufen (Bronze/Silber/Gold/Platin), manuellen Trainer-Auszeichnungen und
-- nachvollziehbarer Rücknahme. Rein additiv — keine bestehende Tabelle wird verändert.

-- =========================================================================================
-- achievements — der Erfolgs-Katalog. Nur Administratoren verwalten ihn (globale Definition);
-- lesbar für jeden eingeloggten Portal-Nutzer (Katalog-Metadaten sind nicht sensibel, analog zu
-- exercises_select_portal). "Geheime" Erfolge werden hier voll gespeichert — die Beschreibung
-- vor dem Freischalten auszublenden ist Aufgabe der Anwendungsschicht, nicht von RLS.
-- =========================================================================================

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null check (category in (
    'einstieg', 'regelmaessigkeit', 'training', 'fortschritt',
    'beweglichkeit_gesundheit', 'kurse', 'kampfkunst', 'mitgliedschaft', 'trainer', 'geheim'
  )),
  icon_key text not null,
  custom_icon_media_id uuid references public.media (id) on delete set null,
  metric_type text not null,
  threshold numeric,
  tier text check (tier in ('bronze', 'silber', 'gold', 'platin')),
  parent_achievement_id uuid references public.achievements (id) on delete set null,
  rule_config jsonb not null default '{}'::jsonb,
  is_manual boolean not null default false,
  is_secret boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  share_text text,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index achievements_category_idx on public.achievements (category, sort_order);
create index achievements_parent_idx on public.achievements (parent_achievement_id);

create trigger achievements_set_updated_at
  before update on public.achievements
  for each row execute function public.set_updated_at();

alter table public.achievements enable row level security;

create policy "achievements_select_portal" on public.achievements
  for select to authenticated
  using (public.is_member() or public.is_trainer_or_admin());

create policy "achievements_write_admin" on public.achievements
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================================
-- member_achievements — ein Mitglied × ein Erfolg (jede Stufe ist ein eigener Katalogeintrag,
-- verkettet über parent_achievement_id, sodass die Historie je Stufe automatisch erhalten
-- bleibt). unlocked_at = null bedeutet "in Bearbeitung" (progress sichtbar, noch gesperrt).
-- revoked_at markiert eine Rücknahme, ohne die Zeile zu löschen (Nachvollziehbarkeit).
-- =========================================================================================

create table public.member_achievements (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete restrict,
  progress numeric not null default 0,
  unlocked_at timestamptz,
  awarded_by uuid references public.profiles (id) on delete set null,
  trainer_message text,
  internal_note text,
  revoked_at timestamptz,
  revoked_by uuid references public.profiles (id) on delete set null,
  revoke_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, achievement_id)
);

create index member_achievements_member_idx on public.member_achievements (member_id);
create index member_achievements_unlocked_idx on public.member_achievements (member_id, unlocked_at desc);

create trigger member_achievements_set_updated_at
  before update on public.member_achievements
  for each row execute function public.set_updated_at();

alter table public.member_achievements enable row level security;

create policy "member_achievements_select" on public.member_achievements
  for select to authenticated
  using (
    member_id = auth.uid()
    or public.assigned_trainer_of(member_id) = auth.uid()
    or public.is_admin()
  );

-- Direct writes are intentionally restricted to trainer/admin (manual awards + revocations);
-- automatic unlocks always go through unlock_achievement() below, which enforces idempotency
-- and lets the member's own session record their own progress safely.
create policy "member_achievements_write_trainer_or_admin" on public.member_achievements
  for all to authenticated
  using (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  with check (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

-- =========================================================================================
-- achievement_events — append-only Verarbeitungsprotokoll für die automatische Berechnung.
-- idempotency_key verhindert doppelte Vergaben bei wiederholter Verarbeitung desselben
-- Ereignisses (z. B. erneuter Aufruf nach einem Netzwerkfehler).
-- =========================================================================================

create table public.achievement_events (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  reference_id uuid,
  value numeric,
  occurred_at timestamptz not null default now(),
  processed_at timestamptz,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index achievement_events_member_idx on public.achievement_events (member_id, occurred_at desc);
create index achievement_events_unprocessed_idx on public.achievement_events (processed_at) where processed_at is null;

alter table public.achievement_events enable row level security;

create policy "achievement_events_select" on public.achievement_events
  for select to authenticated
  using (
    member_id = auth.uid()
    or public.assigned_trainer_of(member_id) = auth.uid()
    or public.is_admin()
  );

create policy "achievement_events_insert_own" on public.achievement_events
  for insert to authenticated
  with check (member_id = auth.uid() or public.is_trainer_or_admin());

-- =========================================================================================
-- unlock_achievement — the only way progress/unlocks are written for *automatic* achievements.
-- Callable by the member themselves (their own session, right after a real action like
-- finishing a workout) or by trainer/admin. SECURITY DEFINER so it can upsert regardless of the
-- more restrictive member_achievements RLS above; the authorization check replaces that gate.
-- Idempotent: calling it again with the same or lower progress, or after already unlocked,
-- is always a safe no-op — never re-fires a second "unlocked" transition.
-- =========================================================================================

create or replace function public.unlock_achievement(
  p_member_id uuid,
  p_achievement_slug text,
  p_progress numeric,
  p_unlock boolean default false
)
returns table (unlocked_now boolean, member_achievement_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_achievement record;
  v_existing record;
  v_was_locked boolean;
begin
  if not (v_actor = p_member_id or public.is_trainer_or_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select * into v_achievement from public.achievements
    where slug = p_achievement_slug and is_active = true;
  if v_achievement is null then
    raise exception 'achievement_not_found';
  end if;
  if v_achievement.is_manual then
    raise exception 'achievement_is_manual';
  end if;

  select * into v_existing from public.member_achievements
    where member_id = p_member_id and achievement_id = v_achievement.id;

  if v_existing is not null and v_existing.revoked_at is not null then
    -- A revoked achievement never silently re-unlocks from automatic recalculation; only a
    -- trainer/admin explicitly clearing the revocation (via the admin tool) can restore it.
    return query select false, v_existing.id;
    return;
  end if;

  v_was_locked := v_existing is null or v_existing.unlocked_at is null;

  if v_existing is null then
    insert into public.member_achievements (member_id, achievement_id, progress, unlocked_at)
    values (
      p_member_id, v_achievement.id, greatest(p_progress, 0),
      case when p_unlock then now() else null end
    )
    returning id into v_existing;
  else
    update public.member_achievements
    set
      progress = greatest(v_existing.progress, p_progress),
      unlocked_at = case
        when v_existing.unlocked_at is not null then v_existing.unlocked_at
        when p_unlock then now()
        else null
      end
    where id = v_existing.id
    returning id into v_existing;
  end if;

  return query
    select (v_was_locked and p_unlock), v_existing.id;
end;
$$;

revoke all on function public.unlock_achievement(uuid, text, numeric, boolean) from public;
grant execute on function public.unlock_achievement(uuid, text, numeric, boolean) to authenticated;
revoke execute on function public.unlock_achievement(uuid, text, numeric, boolean) from anon;

-- =========================================================================================
-- award_manual_achievement / revoke_member_achievement — trainer/admin actions for the
-- hand-awarded achievements (Trainer-Auszeichnungen, Gürtelgrade, …). Both are logged to
-- audit_logs like every other privileged mutation in this schema.
-- =========================================================================================

create or replace function public.award_manual_achievement(
  p_member_id uuid,
  p_achievement_slug text,
  p_trainer_message text default null,
  p_internal_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_achievement record;
  v_id uuid;
begin
  if not (public.assigned_trainer_of(p_member_id) = v_actor or public.is_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select * into v_achievement from public.achievements
    where slug = p_achievement_slug and is_active = true;
  if v_achievement is null then
    raise exception 'achievement_not_found';
  end if;

  insert into public.member_achievements
    (member_id, achievement_id, progress, unlocked_at, awarded_by, trainer_message, internal_note)
  values (p_member_id, v_achievement.id, 1, now(), v_actor, p_trainer_message, p_internal_note)
  on conflict (member_id, achievement_id) do update
    set unlocked_at = coalesce(public.member_achievements.unlocked_at, now()),
        awarded_by = v_actor,
        trainer_message = excluded.trainer_message,
        internal_note = excluded.internal_note,
        revoked_at = null,
        revoked_by = null,
        revoke_reason = null
  returning id into v_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, summary)
  values (v_actor, 'achievement.awarded', 'member_achievement', v_id,
    'Erfolg "' || v_achievement.title || '" manuell vergeben');

  return v_id;
end;
$$;

revoke all on function public.award_manual_achievement(uuid, text, text, text) from public;
grant execute on function public.award_manual_achievement(uuid, text, text, text) to authenticated;
revoke execute on function public.award_manual_achievement(uuid, text, text, text) from anon;

create or replace function public.revoke_member_achievement(p_member_achievement_id uuid, p_reason text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_row record;
begin
  select * into v_row from public.member_achievements where id = p_member_achievement_id;
  if v_row is null then
    raise exception 'not_found';
  end if;
  if not (public.assigned_trainer_of(v_row.member_id) = v_actor or public.is_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  update public.member_achievements
  set revoked_at = now(), revoked_by = v_actor, revoke_reason = p_reason
  where id = p_member_achievement_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, summary)
  values (v_actor, 'achievement.revoked', 'member_achievement', p_member_achievement_id,
    'Erfolgsvergabe zurückgenommen: ' || coalesce(p_reason, 'kein Grund angegeben'));

  return true;
end;
$$;

revoke all on function public.revoke_member_achievement(uuid, text) from public;
grant execute on function public.revoke_member_achievement(uuid, text) to authenticated;
revoke execute on function public.revoke_member_achievement(uuid, text) from anon;

-- =========================================================================================
-- Erfolgs-Katalog (Startdaten) — nur Definitionen, keine member_achievements. Kurs-Erfolge und
-- alle Erfolge ohne belastbares automatisches Datensignal (Kurse, Rückenprogramm, FIVE-Ziel,
-- Regeneration, Plan-Upgrade, Gürtelgrade, individuelle Trainer-Erfolge) sind is_manual = true,
-- weil es dafür noch keine entsprechende Datenerfassung im System gibt — sie werden ausdrücklich
-- nicht durch erfundene Automatik ersetzt.
-- =========================================================================================

insert into public.achievements
  (slug, title, description, category, icon_key, metric_type, threshold, tier, is_manual, is_secret, sort_order, share_text)
values
  -- Einstieg
  ('erster-schritt', 'Erster Schritt', 'Erstes Training abgeschlossen.', 'einstieg', 'shoe_print', 'workout_count', 1, null, false, false, 10, 'Der erste Schritt im Sportpark Pollack ist gemacht.'),
  ('angekommen', 'Angekommen', 'Erstes Zielgespräch (Erstanalyse) abgeschlossen.', 'einstieg', 'goal_check', 'onboarding_completed', 1, null, false, false, 20, 'Angekommen im Sportpark Pollack.'),
  ('planstarter', 'Planstarter', 'Ersten Trainingsplan begonnen.', 'einstieg', 'plan_start', 'plan_started', 1, null, false, false, 30, 'Der erste Trainingsplan ist gestartet.'),
  ('voll-durchgezogen', 'Voll durchgezogen', 'Ein Training ohne ausgelassene Übung abgeschlossen.', 'einstieg', 'check_circle', 'full_completion', 1, null, false, false, 40, 'Voll durchgezogen — keine Übung ausgelassen.'),

  -- Regelmäßigkeit
  ('wochenstark', 'Wochenstark', 'Drei Trainingseinheiten innerhalb einer Kalenderwoche.', 'regelmaessigkeit', 'calendar_bolt', 'week_sessions', 3, null, false, false, 50, 'Wochenstark — drei Einheiten in einer Woche.'),
  ('im-rhythmus', 'Im Rhythmus', 'Vier Wochen in Folge regelmäßig trainiert.', 'regelmaessigkeit', 'pulse_wave', 'week_streak', 4, null, false, false, 60, 'Im Rhythmus — vier Wochen am Stück.'),
  ('fester-bestandteil', 'Fester Bestandteil', 'Zwölf Wochen in Folge regelmäßig trainiert.', 'regelmaessigkeit', 'chain_link', 'week_streak', 12, null, false, false, 70, 'Fester Bestandteil — zwölf Wochen am Stück.'),
  ('fruehstarter', 'Frühstarter', 'Zehn frühe Trainingseinheiten absolviert.', 'regelmaessigkeit', 'sunrise', 'early_sessions', 10, null, false, false, 80, 'Frühstarter — zehn frühe Trainingseinheiten.'),
  ('wochenend-kaempfer', 'Wochenend-Kämpfer', 'Zehn Trainingseinheiten am Wochenende absolviert.', 'regelmaessigkeit', 'calendar_shield', 'weekend_sessions', 10, null, false, false, 90, 'Wochenend-Kämpfer — zehn Einheiten am Wochenende.'),
  ('comeback', 'Comeback', 'Nach einer längeren Pause wieder trainiert.', 'regelmaessigkeit', 'flame_refresh', 'comeback', 21, null, false, false, 100, 'Comeback — wieder zurück im Training.'),

  -- Trainingsmeilensteine (ein Medaillen-Icon, vier Stufen)
  ('trainingsroutine-bronze', 'Trainingsroutine', '10 Trainingseinheiten abgeschlossen.', 'training', 'medal', 'workout_count', 10, 'bronze', false, false, 110, 'Trainingsroutine — Bronze erreicht.'),
  ('trainingsroutine-silber', 'Trainingsroutine', '25 Trainingseinheiten abgeschlossen.', 'training', 'medal', 'workout_count', 25, 'silber', false, false, 111, 'Trainingsroutine — Silber erreicht.'),
  ('trainingsroutine-gold', 'Trainingsroutine', '50 Trainingseinheiten abgeschlossen.', 'training', 'medal', 'workout_count', 50, 'gold', false, false, 112, 'Trainingsroutine — Gold erreicht.'),
  ('trainingsroutine-platin', 'Trainingsroutine', '100 Trainingseinheiten abgeschlossen.', 'training', 'medal', 'workout_count', 100, 'platin', false, false, 113, 'Trainingsroutine — Platin erreicht.'),

  -- Leistung und Fortschritt
  ('persoenlicher-rekord', 'Persönlicher Rekord', 'Erste neue persönliche Bestleistung dokumentiert.', 'fortschritt', 'arrow_up', 'personal_record', 1, null, false, false, 120, 'Neue persönliche Bestleistung erreicht.'),
  ('kraftpaket', 'Kraftpaket', 'Definiertes Trainingsvolumen erreicht.', 'fortschritt', 'dumbbell', 'training_volume', 50000, null, false, false, 130, 'Kraftpaket — hohes Trainingsvolumen bewegt.'),
  ('fortschritt-sichtbar', 'Fortschritt sichtbar', 'Zweite Körperanalyse abgeschlossen.', 'fortschritt', 'chart', 'body_analysis_count', 2, null, false, false, 140, 'Fortschritt sichtbar gemacht.'),
  ('neues-level', 'Neues Level', 'Trainingsplan durch den Trainer erhöht oder erweitert.', 'fortschritt', 'level_arrow', 'manual', null, null, true, false, 150, 'Ein neues Level erreicht.'),
  ('bestaendig-staerker', 'Beständig stärker', 'Mehrere kontrollierte Leistungssteigerungen erreicht.', 'fortschritt', 'bars_growth', 'personal_record_count', 5, null, false, false, 160, 'Beständig stärker geworden.'),

  -- Beweglichkeit und Gesundheit
  ('beweglicher', 'Beweglicher', 'Festgelegtes FIVE-Ziel erreicht.', 'beweglichkeit_gesundheit', 'body_line', 'manual', null, null, true, false, 170, 'Beweglicher geworden.'),
  ('rueckenstark', 'Rückenstark', 'Rückenprogramm abgeschlossen.', 'beweglichkeit_gesundheit', 'spine', 'manual', null, null, true, false, 180, 'Rückenstark.'),
  ('regenerationsprofi', 'Regenerationsprofi', 'Regelmäßige Regeneration dokumentiert.', 'beweglichkeit_gesundheit', 'wave_moon', 'manual', null, null, true, false, 190, 'Regenerationsprofi.'),
  ('koerper-im-blick', 'Körper im Blick', 'Mehrere Körperanalysen durchgeführt.', 'beweglichkeit_gesundheit', 'body_measure', 'body_analysis_count', 5, null, false, false, 200, 'Körper im Blick.'),

  -- Kurse und Kampfkunst (alle manuell — keine Kursdatenerfassung im System)
  ('kursentdecker', 'Kursentdecker', 'Drei unterschiedliche Kursarten besucht.', 'kurse', 'four_areas', 'manual', null, null, true, false, 210, 'Kursentdecker.'),
  ('dabei-geblieben', 'Dabei geblieben', 'Zehn Kursteilnahmen.', 'kurse', 'calendar_check', 'manual', null, null, true, false, 220, 'Dabei geblieben.'),
  ('kaempferherz', 'Kämpferherz', 'Manuelle Trainer-Auszeichnung.', 'kampfkunst', 'fist_shield', 'manual', null, null, true, false, 230, 'Kämpferherz.'),
  ('karate-meilenstein', 'Karate-Meilenstein', 'Durch den Trainer vergeben.', 'kampfkunst', 'belt', 'manual', null, null, true, false, 240, 'Karate-Meilenstein erreicht.'),
  ('neuer-guertelgrad', 'Neuer Gürtelgrad', 'Ausschließlich manuell durch berechtigte Trainer vergeben.', 'kampfkunst', 'belt_star', 'manual', null, null, true, false, 250, 'Neuer Gürtelgrad erreicht.'),

  -- Mitgliedschaft (Datum der Portal-Zugangserstellung als bestmöglicher realer Näherungswert)
  ('ein-jahr-sportpark', 'Ein Jahr Sportpark', 'Ein Jahr aktive Mitgliedschaft.', 'mitgliedschaft', 'laurel_one', 'membership_duration_days', 365, null, false, false, 260, 'Ein Jahr im Sportpark Pollack.'),
  ('teil-der-familie', 'Teil der Familie', 'Drei Jahre aktive Mitgliedschaft.', 'mitgliedschaft', 'link_symbol', 'membership_duration_days', 1095, null, false, false, 270, 'Teil der Sportpark-Familie.'),

  -- Trainer-Auszeichnungen (ausschließlich manuell)
  ('saubere-technik', 'Saubere Technik', 'Manuelle Trainer-Auszeichnung für herausragende Ausführung.', 'trainer', 'fist_shield', 'manual', null, null, true, false, 280, null),
  ('starke-entwicklung', 'Starke Entwicklung', 'Manuelle Trainer-Auszeichnung für spürbare Fortschritte.', 'trainer', 'bars_growth', 'manual', null, null, true, false, 290, null),
  ('drangeblieben', 'Drangeblieben', 'Manuelle Trainer-Auszeichnung für Durchhaltevermögen.', 'trainer', 'chain_link', 'manual', null, null, true, false, 300, null),
  ('vorbild-im-studio', 'Vorbild im Studio', 'Manuelle Trainer-Auszeichnung als Vorbild für andere Mitglieder.', 'trainer', 'laurel_one', 'manual', null, null, true, false, 310, null),
  ('comeback-des-monats', 'Comeback des Monats', 'Manuelle Trainer-Auszeichnung für ein bemerkenswertes Comeback.', 'trainer', 'flame_refresh', 'manual', null, null, true, false, 320, null),

  -- Geheime Erfolge
  ('nachteule', 'Nachteule', 'Ein Training spät am Abend abgeschlossen.', 'geheim', 'pulse_wave', 'manual', null, null, true, true, 330, null),
  ('jahresauftakt', 'Jahresauftakt', 'Das erste Training des Jahres absolviert.', 'geheim', 'sunrise', 'manual', null, null, true, true, 340, null);

-- Stufenkette Trainingsroutine: jede höhere Stufe verweist auf die vorherige.
update public.achievements set parent_achievement_id = (select id from public.achievements where slug = 'trainingsroutine-bronze')
  where slug = 'trainingsroutine-silber';
update public.achievements set parent_achievement_id = (select id from public.achievements where slug = 'trainingsroutine-silber')
  where slug = 'trainingsroutine-gold';
update public.achievements set parent_achievement_id = (select id from public.achievements where slug = 'trainingsroutine-gold')
  where slug = 'trainingsroutine-platin';
update public.achievements set parent_achievement_id = (select id from public.achievements where slug = 'ein-jahr-sportpark')
  where slug = 'teil-der-familie';
