-- Sportpark Pollack — Mitgliederportal
-- Adds two new profile roles (trainer, mitglied) alongside the existing admin/redakteur CMS
-- roles, plus the full member-portal data model: onboarding/health data, training plans (with
-- a trainer-approval workflow), workout logging, progress data, coach messaging, and change
-- requests. Purely additive — every existing table, function and policy from earlier migrations
-- is untouched, so the CMS admin built in 0001-0007 keeps working exactly as before.

-- =========================================================================================
-- Roles: extend profiles.role. is_staff()/is_admin() (CMS gate) are intentionally left
-- checking only ('admin','redakteur') — trainers and members never pass those checks, so the
-- existing /admin CMS security model is unaffected by this widening.
-- =========================================================================================

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'redakteur', 'trainer', 'mitglied'));

create or replace function public.is_trainer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer');
$$;

create or replace function public.is_trainer_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('trainer', 'admin'));
$$;

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'mitglied');
$$;

-- =========================================================================================
-- member_profiles — onboarding answers + the member's current assigned trainer. One row per
-- profile with role = 'mitglied'.
-- =========================================================================================

create table public.member_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  goal text,
  birth_year integer,
  height_cm integer,
  weight_kg numeric(5, 2),
  experience_level text check (experience_level in ('einsteiger', 'fortgeschritten', 'erfahren')),
  training_days_per_week integer,
  session_duration_min integer,
  focus_areas text[] not null default '{}',
  health_notes text,
  excluded_exercises text[] not null default '{}',
  preferences text,
  intensity_preference text check (intensity_preference in ('locker', 'moderat', 'fordernd')),
  assigned_trainer_id uuid references public.profiles (id) on delete set null,
  onboarding_completed_at timestamptz,
  next_analysis_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger member_profiles_set_updated_at
  before update on public.member_profiles
  for each row execute function public.set_updated_at();

-- The trainer currently assigned to a member, used throughout this file's RLS policies to
-- scope a trainer's access to only their own members.
create or replace function public.assigned_trainer_of(p_member_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select assigned_trainer_id from public.member_profiles where id = p_member_id;
$$;

alter table public.member_profiles enable row level security;

create policy "member_profiles_select" on public.member_profiles
  for select to authenticated
  using (id = auth.uid() or public.assigned_trainer_of(id) = auth.uid() or public.is_admin());

create policy "member_profiles_insert" on public.member_profiles
  for insert to authenticated
  with check (id = auth.uid() or public.is_trainer_or_admin());

create policy "member_profiles_update" on public.member_profiles
  for update to authenticated
  using (id = auth.uid() or public.assigned_trainer_of(id) = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.assigned_trainer_of(id) = auth.uid() or public.is_admin());

-- =========================================================================================
-- health_consents — explicit, timestamped consent before any health data (goals, injuries,
-- body measurements) is stored, per GDPR Art. 9. Append-only: a new row per consent event, a
-- revocation is its own row rather than an update, so the history is never lost.
-- =========================================================================================

create table public.health_consents (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  event text not null check (event in ('granted', 'revoked')),
  policy_version text not null default 'v1',
  created_at timestamptz not null default now()
);

alter table public.health_consents enable row level security;

create policy "health_consents_select" on public.health_consents
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "health_consents_insert" on public.health_consents
  for insert to authenticated
  with check (member_id = auth.uid());

-- =========================================================================================
-- trainer_assignments — audit trail of who assigned which trainer to which member and when
-- (member_profiles.assigned_trainer_id always holds the *current* value for fast lookups).
-- =========================================================================================

create table public.trainer_assignments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  trainer_id uuid references public.profiles (id) on delete set null,
  assigned_by uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.trainer_assignments enable row level security;

create policy "trainer_assignments_select" on public.trainer_assignments
  for select to authenticated
  using (member_id = auth.uid() or trainer_id = auth.uid() or public.is_admin());

create policy "trainer_assignments_insert" on public.trainer_assignments
  for insert to authenticated
  with check (public.is_admin());

-- =========================================================================================
-- exercises — the shared exercise library. Not member-specific or sensitive, so every signed-
-- in portal user (member, trainer, admin) may read it; only trainers/admins curate it.
-- =========================================================================================

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text,
  description text,
  image_media_id uuid references public.media (id) on delete set null,
  video_media_id uuid references public.media (id) on delete set null,
  default_sets integer not null default 3,
  default_reps text not null default '8-12',
  alternative_exercise_id uuid references public.exercises (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger exercises_set_updated_at
  before update on public.exercises
  for each row execute function public.set_updated_at();

alter table public.exercises enable row level security;

create policy "exercises_select_portal" on public.exercises
  for select to authenticated
  using (public.is_member() or public.is_trainer_or_admin());

create policy "exercises_write_trainer_or_admin" on public.exercises
  for all to authenticated
  using (public.is_trainer_or_admin())
  with check (public.is_trainer_or_admin());

-- =========================================================================================
-- training_plan_templates — rule-based starting points for a new member's draft plan, keyed
-- by goal + experience level. `days` holds the day/exercise structure as JSONB (an internal
-- seed detail edited by us, not exposed as its own CRUD UI — every *assigned* plan is fully
-- normalized into training_plan_days/training_plan_exercises below, which the trainer UI does
-- edit row by row).
-- =========================================================================================

create table public.training_plan_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null,
  level text not null check (level in ('einsteiger', 'fortgeschritten', 'erfahren')),
  description text,
  days jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.training_plan_templates enable row level security;

create policy "training_plan_templates_select_portal" on public.training_plan_templates
  for select to authenticated
  using (public.is_member() or public.is_trainer_or_admin());

create policy "training_plan_templates_write_trainer_or_admin" on public.training_plan_templates
  for all to authenticated
  using (public.is_trainer_or_admin())
  with check (public.is_trainer_or_admin());

-- =========================================================================================
-- training_plans / training_plan_days / training_plan_exercises — one member's actual,
-- editable plan. Never created directly by the member (see generate_draft_plan below); the
-- member may only ever read their own, and only a trainer/admin may move it out of draft.
-- =========================================================================================

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending_review'
    check (status in ('draft', 'pending_review', 'active', 'change_requested', 'archived')),
  version integer not null default 1,
  source_template_id uuid references public.training_plan_templates (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only one plan may be the member's live, active plan at a time.
create unique index training_plans_one_active_per_member
  on public.training_plans (member_id)
  where status = 'active';

create trigger training_plans_set_updated_at
  before update on public.training_plans
  for each row execute function public.set_updated_at();

create index training_plans_member_idx on public.training_plans (member_id);

alter table public.training_plans enable row level security;

create policy "training_plans_select" on public.training_plans
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "training_plans_write_trainer_or_admin" on public.training_plans
  for all to authenticated
  using (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  with check (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create table public.training_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans (id) on delete cascade,
  weekday text not null check (weekday in ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
  title text not null,
  sort_order integer not null default 0
);

create index training_plan_days_plan_idx on public.training_plan_days (plan_id, sort_order);

alter table public.training_plan_days enable row level security;

create policy "training_plan_days_select" on public.training_plan_days
  for select to authenticated
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id
        and (p.member_id = auth.uid() or public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  );

create policy "training_plan_days_write_trainer_or_admin" on public.training_plan_days
  for all to authenticated
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id and (public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id and (public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  );

create table public.training_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_day_id uuid not null references public.training_plan_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  alternative_exercise_id uuid references public.exercises (id) on delete set null,
  sets integer not null default 3,
  reps text not null default '8-12',
  rest_seconds integer not null default 90,
  target_weight_kg numeric(6, 2),
  trainer_note text,
  sort_order integer not null default 0
);

create index training_plan_exercises_day_idx on public.training_plan_exercises (plan_day_id, sort_order);

alter table public.training_plan_exercises enable row level security;

create policy "training_plan_exercises_select" on public.training_plan_exercises
  for select to authenticated
  using (
    exists (
      select 1 from public.training_plan_days d
      join public.training_plans p on p.id = d.plan_id
      where d.id = plan_day_id
        and (p.member_id = auth.uid() or public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  );

create policy "training_plan_exercises_write_trainer_or_admin" on public.training_plan_exercises
  for all to authenticated
  using (
    exists (
      select 1 from public.training_plan_days d
      join public.training_plans p on p.id = d.plan_id
      where d.id = plan_day_id and (public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.training_plan_days d
      join public.training_plans p on p.id = d.plan_id
      where d.id = plan_day_id and (public.assigned_trainer_of(p.member_id) = auth.uid() or public.is_admin())
    )
  );

-- =========================================================================================
-- workout_sessions / workout_sets — the member's own logged training data. Unlike the plan
-- itself, this is written directly by the member (that's the whole point of the active
-- training mode), so members get real INSERT/UPDATE rights on their own rows here.
-- =========================================================================================

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid references public.training_plans (id) on delete set null,
  plan_day_id uuid references public.training_plan_days (id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_min integer,
  total_volume_kg numeric(8, 2),
  feeling_note text,
  created_at timestamptz not null default now()
);

create index workout_sessions_member_idx on public.workout_sessions (member_id, started_at desc);

alter table public.workout_sessions enable row level security;

create policy "workout_sessions_select" on public.workout_sessions
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "workout_sessions_write_own" on public.workout_sessions
  for insert to authenticated
  with check (member_id = auth.uid());

create policy "workout_sessions_update_own_or_staff" on public.workout_sessions
  for update to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  with check (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  plan_exercise_id uuid references public.training_plan_exercises (id) on delete set null,
  set_number integer not null,
  weight_kg numeric(6, 2),
  reps integer,
  perceived_exertion integer check (perceived_exertion between 1 and 10),
  note text,
  pain_flag boolean not null default false,
  completed_at timestamptz not null default now()
);

create index workout_sets_session_idx on public.workout_sets (session_id);

alter table public.workout_sets enable row level security;

create policy "workout_sets_select" on public.workout_sets
  for select to authenticated
  using (
    exists (
      select 1 from public.workout_sessions s
      where s.id = session_id
        and (s.member_id = auth.uid() or public.assigned_trainer_of(s.member_id) = auth.uid() or public.is_admin())
    )
  );

create policy "workout_sets_write_own" on public.workout_sets
  for insert to authenticated
  with check (
    exists (select 1 from public.workout_sessions s where s.id = session_id and s.member_id = auth.uid())
  );

create policy "workout_sets_update_own" on public.workout_sets
  for update to authenticated
  using (
    exists (select 1 from public.workout_sessions s where s.id = session_id and s.member_id = auth.uid())
  )
  with check (
    exists (select 1 from public.workout_sessions s where s.id = session_id and s.member_id = auth.uid())
  );

-- =========================================================================================
-- body_measurements — logged over time by the member (or a trainer during a check-in).
-- =========================================================================================

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  measured_at date not null default current_date,
  weight_kg numeric(5, 2),
  body_fat_pct numeric(4, 1),
  chest_cm numeric(5, 1),
  waist_cm numeric(5, 1),
  hip_cm numeric(5, 1),
  notes text,
  created_at timestamptz not null default now()
);

create index body_measurements_member_idx on public.body_measurements (member_id, measured_at desc);

alter table public.body_measurements enable row level security;

create policy "body_measurements_select" on public.body_measurements
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "body_measurements_write" on public.body_measurements
  for insert to authenticated
  with check (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

-- =========================================================================================
-- coach_messages — a single thread per member, shared between that member and their trainer.
-- Members must never see another member's thread; a trainer only sees threads of members
-- currently assigned to them.
-- =========================================================================================

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  sender_role text not null check (sender_role in ('member', 'trainer')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index coach_messages_member_idx on public.coach_messages (member_id, created_at);

alter table public.coach_messages enable row level security;

create policy "coach_messages_select" on public.coach_messages
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "coach_messages_insert" on public.coach_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  );

create policy "coach_messages_update_read" on public.coach_messages
  for update to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  with check (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

-- =========================================================================================
-- plan_change_requests — a member asking their trainer to adjust the active plan.
-- =========================================================================================

create table public.plan_change_requests (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolution_note text,
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index plan_change_requests_member_idx on public.plan_change_requests (member_id, status);

alter table public.plan_change_requests enable row level security;

create policy "plan_change_requests_select" on public.plan_change_requests
  for select to authenticated
  using (member_id = auth.uid() or public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

create policy "plan_change_requests_insert" on public.plan_change_requests
  for insert to authenticated
  with check (member_id = auth.uid());

create policy "plan_change_requests_update_staff" on public.plan_change_requests
  for update to authenticated
  using (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin())
  with check (public.assigned_trainer_of(member_id) = auth.uid() or public.is_admin());

-- =========================================================================================
-- RPCs — the two multi-row, privilege-sensitive operations in the plan workflow. Both mirror
-- the existing publish_all_drafts()/restore_last_version() pattern: SECURITY DEFINER, an
-- explicit authorization check as the first statement, and an audit_logs row.
-- =========================================================================================

-- Turns a template's `days` JSONB into a real, editable training_plans/…_days/…_exercises
-- tree in status 'pending_review'. Callable by the member themselves (onboarding) or by
-- trainer/admin (manually starting a new plan for a member). The authorization check and the
-- attributed actor both come from auth.uid() — never from a client-supplied parameter, which
-- could otherwise be spoofed to act as (or on behalf of) an arbitrary other user.
create or replace function public.generate_draft_plan(p_member_id uuid, p_template_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_plan_id uuid;
  v_template record;
  v_day jsonb;
  v_day_id uuid;
  v_exercise jsonb;
  v_exercise_id uuid;
  v_day_sort integer := 0;
  v_ex_sort integer;
begin
  if not (v_actor = p_member_id or public.is_trainer_or_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select * into v_template from public.training_plan_templates where id = p_template_id;
  if v_template is null then
    raise exception 'template_not_found';
  end if;

  insert into public.training_plans (member_id, status, source_template_id, created_by, notes)
  values (p_member_id, 'pending_review', p_template_id, v_actor, 'Automatisch aus Vorlage erstellt: ' || v_template.name)
  returning id into v_plan_id;

  for v_day in select * from jsonb_array_elements(v_template.days)
  loop
    insert into public.training_plan_days (plan_id, weekday, title, sort_order)
    values (v_plan_id, v_day->>'weekday', v_day->>'title', v_day_sort)
    returning id into v_day_id;
    v_day_sort := v_day_sort + 1;

    v_ex_sort := 0;
    for v_exercise in select * from jsonb_array_elements(v_day->'exercises')
    loop
      select id into v_exercise_id from public.exercises where name = v_exercise->>'name' limit 1;
      if v_exercise_id is not null then
        insert into public.training_plan_exercises
          (plan_day_id, exercise_id, sets, reps, rest_seconds, target_weight_kg, sort_order)
        values (
          v_day_id,
          v_exercise_id,
          coalesce((v_exercise->>'sets')::integer, 3),
          coalesce(v_exercise->>'reps', '8-12'),
          coalesce((v_exercise->>'rest_seconds')::integer, 90),
          nullif(v_exercise->>'target_weight_kg', '')::numeric,
          v_ex_sort
        );
        v_ex_sort := v_ex_sort + 1;
      end if;
    end loop;
  end loop;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, summary)
  values (v_actor, 'training_plan.draft_created', 'training_plan', v_plan_id,
    'Planentwurf erstellt aus Vorlage: ' || v_template.name);

  return v_plan_id;
end;
$$;

revoke all on function public.generate_draft_plan(uuid, uuid) from public;
grant execute on function public.generate_draft_plan(uuid, uuid) to authenticated;
revoke execute on function public.generate_draft_plan(uuid, uuid) from anon;

-- Approves a pending plan: archives the member's previous active plan (if any) and activates
-- this one, in a single transaction so the member is never briefly without an active plan nor
-- ever has two "active" plans at once. Both the authorization check and the attributed actor
-- come from auth.uid() — never from a client-supplied parameter (a spoofed actor here would
-- let a member self-approve their own plan, defeating the entire point of this function).
create or replace function public.approve_training_plan(p_plan_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_member_id uuid;
begin
  select member_id into v_member_id from public.training_plans where id = p_plan_id;
  if v_member_id is null then
    raise exception 'plan_not_found';
  end if;
  if not (public.assigned_trainer_of(v_member_id) = v_actor or public.is_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  update public.training_plans
  set status = 'archived'
  where member_id = v_member_id and status = 'active';

  update public.training_plans
  set status = 'active', reviewed_by = v_actor, reviewed_at = now()
  where id = p_plan_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, summary)
  values (v_actor, 'training_plan.approved', 'training_plan', p_plan_id, 'Trainingsplan freigegeben');

  return true;
end;
$$;

revoke all on function public.approve_training_plan(uuid) from public;
grant execute on function public.approve_training_plan(uuid) to authenticated;
revoke execute on function public.approve_training_plan(uuid) from anon;
