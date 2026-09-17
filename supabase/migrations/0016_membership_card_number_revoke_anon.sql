-- Supabase's public schema grants EXECUTE to anon/authenticated/service_role on every new
-- function by default (a default-privileges rule, not something "revoke ... from public"
-- undoes) — same gotcha get_weekly_visitor_count needed a follow-up migration for in 0007.
-- This function increments a sequence as SECURITY DEFINER; anon has no business calling it.
revoke execute on function public.generate_membership_card_number from anon;
