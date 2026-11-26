-- RCS secure multi-school foundation
-- Apply with Supabase SQL Editor. Do not expose service_role keys in the browser.

create extension if not exists pgcrypto;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete restrict,
  full_name text not null,
  role text not null default 'school_admin'
    check (role in ('school_admin', 'platform_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint school_admin_requires_school check (role <> 'school_admin' or school_id is not null)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_code text not null unique,
  school_id uuid not null references public.schools(id) on delete restrict,
  reporter_name text not null,
  reporter_class text not null,
  reporter_contact text,
  category text not null check (category in (
    'Perundungan','Kekerasan fisik atau verbal','Pelecehan',
    'Tekanan akademik','Masalah pertemanan','Masalah keluarga','Masalah pribadi lainnya'
  )),
  incident_date date not null,
  incident_location text not null,
  school_environment text not null,
  description text not null,
  status text not null default 'Baru'
    check (status in ('Baru','Ditinjau','Ditangani','Perlu tindak lanjut','Selesai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reporter_name_length check (char_length(trim(reporter_name)) between 2 and 120),
  constraint reporter_class_length check (char_length(trim(reporter_class)) between 1 and 40),
  constraint reporter_contact_length check (reporter_contact is null or char_length(reporter_contact) <= 80),
  constraint description_length check (char_length(trim(description)) between 10 and 10000)
);

create index if not exists reports_school_created_idx
  on public.reports (school_id, created_at desc);
create index if not exists reports_school_status_idx
  on public.reports (school_id, status, created_at desc);

create table if not exists public.report_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  admin_id uuid not null references public.profiles(id) on delete restrict,
  previous_status text,
  new_status text not null check (new_status in ('Baru','Ditinjau','Ditangani','Perlu tindak lanjut','Selesai')),
  note text not null default '',
  created_at timestamptz not null default now(),
  constraint update_note_length check (char_length(note) <= 4000)
);

create table if not exists public.report_attachments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  storage_path text not null unique,
  original_file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Existing school choices from the current RCS form.
insert into public.schools (name, slug) values
 ('SMA Negeri 1 Banda Aceh','sma-negeri-1-banda-aceh'),
 ('SMA Negeri 2 Banda Aceh','sma-negeri-2-banda-aceh'),
 ('SMA Negeri 3 Banda Aceh','sma-negeri-3-banda-aceh'),
 ('SMA Negeri 4 Banda Aceh','sma-negeri-4-banda-aceh'),
 ('SMA Negeri 5 Banda Aceh','sma-negeri-5-banda-aceh'),
 ('SMA Negeri 6 Banda Aceh','sma-negeri-6-banda-aceh'),
 ('SMA Negeri 7 Banda Aceh','sma-negeri-7-banda-aceh'),
 ('SMA Negeri 8 Banda Aceh','sma-negeri-8-banda-aceh'),
 ('SMA Negeri 9 Banda Aceh','sma-negeri-9-banda-aceh'),
 ('SMA Negeri 10 Banda Aceh','sma-negeri-10-banda-aceh'),
 ('SMA Negeri 11 Banda Aceh','sma-negeri-11-banda-aceh'),
 ('SMA Negeri 12 Banda Aceh','sma-negeri-12-banda-aceh'),
 ('SMA Negeri 13 Banda Aceh','sma-negeri-13-banda-aceh'),
 ('SMA Negeri 14 Banda Aceh','sma-negeri-14-banda-aceh'),
 ('SMA Negeri 15 Banda Aceh','sma-negeri-15-banda-aceh'),
 ('SMA Labschool Banda Aceh','sma-labschool-banda-aceh'),
 ('SMA Muhammadiyah 1 Banda Aceh','sma-muhammadiyah-1-banda-aceh'),
 ('SMA Muhammadiyah 2 Banda Aceh','sma-muhammadiyah-2-banda-aceh'),
 ('SMA Al-Masry Banda Aceh','sma-al-masry-banda-aceh'),
 ('SMA Ulumul Quran Banda Aceh','sma-ulumul-quran-banda-aceh'),
 ('SMA IT Al-Fityan Banda Aceh','sma-it-al-fityan-banda-aceh')
on conflict (name) do nothing;

-- Helper functions run with a fixed search_path to avoid object-shadowing attacks.
create or replace function public.current_school_id()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select p.school_id
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
    and p.role = 'school_admin'
  limit 1
$$;

create or replace function public.is_active_school_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role = 'school_admin'
      and p.school_id is not null
  )
$$;

-- Public intake: identity is mandatory; no public read/list endpoint is granted.
create or replace function public.submit_student_report(
  p_school_id uuid,
  p_reporter_name text,
  p_reporter_class text,
  p_reporter_contact text,
  p_category text,
  p_incident_date date,
  p_incident_location text,
  p_school_environment text,
  p_description text,
  p_privacy_acknowledged boolean
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
begin
  if p_privacy_acknowledged is distinct from true then
    raise exception 'Persetujuan pemberitahuan privasi wajib diberikan.';
  end if;
  if not exists (select 1 from public.schools s where s.id = p_school_id and s.is_active = true) then
    raise exception 'Sekolah tidak tersedia.';
  end if;
  if p_reporter_name is null or char_length(trim(p_reporter_name)) not between 2 and 120 then
    raise exception 'Nama lengkap wajib diisi.';
  end if;
  if p_reporter_class is null or char_length(trim(p_reporter_class)) not between 1 and 40 then
    raise exception 'Kelas wajib diisi.';
  end if;
  if p_category not in ('Perundungan','Kekerasan fisik atau verbal','Pelecehan','Tekanan akademik','Masalah pertemanan','Masalah keluarga','Masalah pribadi lainnya') then
    raise exception 'Kategori laporan tidak valid.';
  end if;
  if p_incident_date is null or p_incident_date > current_date then
    raise exception 'Tanggal kejadian tidak valid.';
  end if;
  if p_incident_location is null or char_length(trim(p_incident_location)) not between 2 and 160 then
    raise exception 'Lokasi kejadian wajib diisi.';
  end if;
  if p_school_environment is null or char_length(trim(p_school_environment)) not between 2 and 80 then
    raise exception 'Lingkungan kejadian wajib dipilih.';
  end if;
  if p_description is null or char_length(trim(p_description)) not between 10 and 10000 then
    raise exception 'Deskripsi harus berisi 10 sampai 10.000 karakter.';
  end if;
  if p_reporter_contact is not null and char_length(p_reporter_contact) > 80 then
    raise exception 'Kontak terlalu panjang.';
  end if;

  v_code := 'RCS-' || to_char(now(), 'YYYY') || '-' ||
    upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));

  insert into public.reports (
    report_code, school_id, reporter_name, reporter_class, reporter_contact,
    category, incident_date, incident_location, school_environment, description
  ) values (
    v_code, p_school_id, trim(p_reporter_name), trim(p_reporter_class),
    nullif(trim(coalesce(p_reporter_contact, '')), ''),
    p_category, p_incident_date, trim(p_incident_location),
    trim(p_school_environment), trim(p_description)
  );

  return v_code;
end;
$$;

-- Only a signed-in admin for the report's school can change its status.
create or replace function public.update_report_status(
  p_report_id uuid,
  p_new_status text,
  p_note text default ''
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_school_id uuid;
  v_previous_status text;
begin
  if not public.is_active_school_admin() then
    raise exception 'Akses ditolak.';
  end if;
  if p_new_status not in ('Baru','Ditinjau','Ditangani','Perlu tindak lanjut','Selesai') then
    raise exception 'Status tidak valid.';
  end if;
  if char_length(coalesce(p_note, '')) > 4000 then
    raise exception 'Catatan terlalu panjang.';
  end if;

  select r.school_id, r.status into v_school_id, v_previous_status
  from public.reports r
  where r.id = p_report_id
  for update;

  if v_school_id is null or v_school_id <> public.current_school_id() then
    raise exception 'Laporan tidak ditemukan atau akses ditolak.';
  end if;

  update public.reports
    set status = p_new_status, updated_at = now()
    where id = p_report_id;

  insert into public.report_updates (report_id, admin_id, previous_status, new_status, note)
  values (p_report_id, auth.uid(), v_previous_status, p_new_status, coalesce(p_note, ''));

  insert into public.audit_logs (admin_id, school_id, action, target_type, target_id)
  values (auth.uid(), v_school_id, 'report_status_changed', 'report', p_report_id);
end;
$$;

-- Updated timestamp.
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at before update on public.reports
for each row execute function public.set_updated_at();

-- Enable RLS on every table containing operational or personal data.
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_updates enable row level security;
alter table public.report_attachments enable row level security;
alter table public.audit_logs enable row level security;

-- School list is public only for active schools; no student or report data is exposed.
drop policy if exists "active schools are selectable" on public.schools;
create policy "active schools are selectable" on public.schools
for select to anon, authenticated using (is_active = true);

drop policy if exists "admins read own profile" on public.profiles;
create policy "admins read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "school admins read own school reports" on public.reports;
create policy "school admins read own school reports" on public.reports
for select to authenticated using (
  public.is_active_school_admin() and school_id = public.current_school_id()
);

drop policy if exists "school admins read own report updates" on public.report_updates;
create policy "school admins read own report updates" on public.report_updates
for select to authenticated using (
  exists (
    select 1 from public.reports r
    where r.id = report_id and r.school_id = public.current_school_id()
  )
  and public.is_active_school_admin()
);

drop policy if exists "school admins read own report attachments" on public.report_attachments;
create policy "school admins read own report attachments" on public.report_attachments
for select to authenticated using (
  exists (
    select 1 from public.reports r
    where r.id = report_id and r.school_id = public.current_school_id()
  )
  and public.is_active_school_admin()
);

drop policy if exists "school admins read own audit logs" on public.audit_logs;
create policy "school admins read own audit logs" on public.audit_logs
for select to authenticated using (
  admin_id = auth.uid() and school_id = public.current_school_id()
  and public.is_active_school_admin()
);

-- No direct public inserts, updates or deletes. Intake and status changes use RPCs.
revoke all on public.reports, public.report_updates, public.report_attachments, public.audit_logs from anon, authenticated;
grant select on public.schools to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.reports, public.report_updates, public.report_attachments, public.audit_logs to authenticated;

revoke all on function public.submit_student_report(uuid,text,text,text,text,date,text,text,text,boolean) from public;
grant execute on function public.submit_student_report(uuid,text,text,text,text,date,text,text,text,boolean) to anon, authenticated;

revoke all on function public.update_report_status(uuid,text,text) from public;
grant execute on function public.update_report_status(uuid,text,text) to authenticated;

revoke all on function public.current_school_id() from public;
revoke all on function public.is_active_school_admin() from public;
grant execute on function public.current_school_id() to authenticated;
grant execute on function public.is_active_school_admin() to authenticated;

-- Important: no public SELECT policy exists for reports; student intake only returns a non-secret reference code.
