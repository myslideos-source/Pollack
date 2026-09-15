-- Seeds the shared exercise library and two starter training-plan templates (Ganzkörper/
-- Oberkörper-Unterkörper-Split, je Einsteiger/Fortgeschritten), matching the day/exercise
-- structure given in the member-portal brief exactly (Montag Oberkörper, Mittwoch Unterkörper).
-- No personal data here — demo member/trainer accounts are seeded separately, outside version
-- control, since that seed necessarily includes a login password.

insert into public.exercises (name, muscle_group, default_sets, default_reps) values
  ('Bankdrücken', 'Brust', 4, '8-10'),
  ('Rudern am Kabel', 'Rücken', 4, '10-12'),
  ('Schulterdrücken', 'Schultern', 3, '8-10'),
  ('Latzug', 'Rücken', 3, '10-12'),
  ('Bizepscurls', 'Bizeps', 3, '10-12'),
  ('Trizepsdrücken', 'Trizeps', 3, '10-12'),
  ('Beinpresse', 'Beine', 4, '10-12'),
  ('Beinbeuger', 'Beine', 3, '10-12'),
  ('Beinstrecker', 'Beine', 3, '10-12'),
  ('Wadenheben', 'Waden', 3, '15-20'),
  ('Rückenstrecker', 'Rücken', 3, '12-15'),
  ('Kniebeugen', 'Beine', 4, '6-8'),
  ('Kreuzheben', 'Ganzkörper', 3, '6-8'),
  ('Klimmzüge', 'Rücken', 3, '6-10'),
  ('Plank', 'Rumpf', 3, '30-60 Sek.');

insert into public.training_plan_templates (name, goal, level, description, days) values
(
  'Oberkörper/Unterkörper-Split — Einsteiger',
  'Muskeln aufbauen',
  'einsteiger',
  'Zweier-Split für den Einstieg: ein Oberkörper- und ein Unterkörpertag pro Woche, moderates Volumen.',
  '[
    {"weekday": "mon", "title": "Oberkörper", "exercises": [
      {"name": "Bankdrücken", "sets": 3, "reps": "8-10", "rest_seconds": 90},
      {"name": "Rudern am Kabel", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Schulterdrücken", "sets": 3, "reps": "8-10", "rest_seconds": 90},
      {"name": "Latzug", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Bizepscurls", "sets": 3, "reps": "10-12", "rest_seconds": 60},
      {"name": "Trizepsdrücken", "sets": 3, "reps": "10-12", "rest_seconds": 60}
    ]},
    {"weekday": "wed", "title": "Unterkörper", "exercises": [
      {"name": "Beinpresse", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Beinbeuger", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Beinstrecker", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Wadenheben", "sets": 3, "reps": "15-20", "rest_seconds": 60},
      {"name": "Rückenstrecker", "sets": 3, "reps": "12-15", "rest_seconds": 60}
    ]}
  ]'::jsonb
),
(
  'Oberkörper/Unterkörper-Split — Fortgeschritten',
  'Kraft steigern',
  'fortgeschritten',
  'Höheres Volumen und Intensität für Mitglieder mit Trainingserfahrung.',
  '[
    {"weekday": "mon", "title": "Oberkörper", "exercises": [
      {"name": "Bankdrücken", "sets": 4, "reps": "6-8", "rest_seconds": 120},
      {"name": "Klimmzüge", "sets": 4, "reps": "6-10", "rest_seconds": 120},
      {"name": "Schulterdrücken", "sets": 4, "reps": "8-10", "rest_seconds": 90},
      {"name": "Rudern am Kabel", "sets": 4, "reps": "10-12", "rest_seconds": 90},
      {"name": "Bizepscurls", "sets": 3, "reps": "10-12", "rest_seconds": 60},
      {"name": "Trizepsdrücken", "sets": 3, "reps": "10-12", "rest_seconds": 60}
    ]},
    {"weekday": "wed", "title": "Unterkörper", "exercises": [
      {"name": "Kniebeugen", "sets": 4, "reps": "6-8", "rest_seconds": 150},
      {"name": "Kreuzheben", "sets": 3, "reps": "6-8", "rest_seconds": 150},
      {"name": "Beinpresse", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Beinbeuger", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Wadenheben", "sets": 4, "reps": "15-20", "rest_seconds": 60},
      {"name": "Plank", "sets": 3, "reps": "30-60 Sek.", "rest_seconds": 45}
    ]}
  ]'::jsonb
),
(
  'Ganzkörper — Einsteiger',
  'allgemeine Fitness verbessern',
  'einsteiger',
  'Drei kompakte Ganzkörpereinheiten pro Woche für einen sanften Wiedereinstieg.',
  '[
    {"weekday": "mon", "title": "Ganzkörper A", "exercises": [
      {"name": "Beinpresse", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Rudern am Kabel", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Schulterdrücken", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Plank", "sets": 3, "reps": "30-60 Sek.", "rest_seconds": 45}
    ]},
    {"weekday": "wed", "title": "Ganzkörper B", "exercises": [
      {"name": "Bankdrücken", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Latzug", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Beinbeuger", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Rückenstrecker", "sets": 3, "reps": "12-15", "rest_seconds": 60}
    ]},
    {"weekday": "fri", "title": "Ganzkörper C", "exercises": [
      {"name": "Beinstrecker", "sets": 3, "reps": "10-12", "rest_seconds": 90},
      {"name": "Bizepscurls", "sets": 3, "reps": "10-12", "rest_seconds": 60},
      {"name": "Trizepsdrücken", "sets": 3, "reps": "10-12", "rest_seconds": 60},
      {"name": "Wadenheben", "sets": 3, "reps": "15-20", "rest_seconds": 60}
    ]}
  ]'::jsonb
);
