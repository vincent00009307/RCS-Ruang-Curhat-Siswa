# RCS — Secure multi-school backend setup

This branch introduces the first database/security foundation for RCS. The current static frontend is **not yet connected** to this backend. Do not treat the deployed site as production-ready for real student reports until the integration and tests below are complete.

## Architecture

- Supabase PostgreSQL stores schools, staff profiles, reports, report updates, private attachment metadata, and audit logs.
- Supabase Auth authenticates each school BK administrator.
- Every school administrator profile is bound to exactly one `school_id`.
- PostgreSQL Row Level Security restricts each school administrator to reports and updates from their own school.
- Students submit reports through the `submit_student_report` RPC. Public users cannot list or read reports.
- Status changes must use `update_report_status`; direct table writes are not granted.

## Apply migration

1. Create a Supabase project for RCS.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run `supabase/migrations/202611260001_initial_multi_school.sql`.
4. Confirm that the 21 initial school records exist in `public.schools`.
5. Keep the project's service-role key private. Never put it in HTML, JavaScript, GitHub, or Vercel public environment variables.

## Create school BK administrators

1. In Supabase Authentication, create an Auth user for the school BK administrator.
2. Copy the Auth user's UUID.
3. In the SQL editor, insert a profile mapped to the intended school:

```sql
insert into public.profiles (id, school_id, full_name, role, is_active)
select
  'AUTH-USER-UUID'::uuid,
  s.id,
  'Nama Admin BK',
  'school_admin',
  true
from public.schools s
where s.slug = 'sma-negeri-1-banda-aceh';
```

Use one distinct Auth user per BK administrator. Do not let school admins choose their own `school_id` or role.

## Frontend integration still required

- Add the Supabase browser client using the project URL and publishable/anon key only.
- Load active schools from `public.schools` and submit the selected UUID.
- Collect required student full name and class; collect contact only if there is a clear operational need.
- Present a clear privacy notice and require acknowledgement before submission.
- Call `submit_student_report`; show the returned report code once. Do not render submitted report contents on the public page.
- Implement the BK dashboard using Supabase Auth, the signed-in profile, and RLS-protected report queries.
- Change statuses only through `update_report_status`.
- Remove the legacy demo password, localStorage report store, public report list, and public delete control.
- Add server-side rate limiting / abuse protection before opening the intake publicly.

## Required security checks before production

- Create two test schools and one BK admin for each.
- Verify Admin A cannot read, update, or retrieve any report belonging to School B, including by direct API requests.
- Verify unauthenticated users can submit a valid report but cannot select from `reports`, `report_updates`, `profiles`, or attachments.
- Verify invalid school IDs, missing identity, missing privacy acknowledgement, oversized text, and future incident dates are rejected.
- Verify no service-role secret is present in frontend bundles, Git history, or Vercel public environment variables.
- Test incident escalation and response procedures with the participating schools before accepting real student reports.

## Student privacy and safeguarding

Identity is required by the selected RCS policy. The name and class are private case data, not public profile information. Keep collection minimal, document the purpose and retention period, restrict access to assigned school personnel, and establish a safe procedure for urgent danger or suspected abuse. RCS is not an emergency service. Obtain the necessary institutional approvals and child-data/privacy review before pilot use.
