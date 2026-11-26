-- RCS hotfix: replace unavailable gen_random_bytes() call.
-- Run this entire file in Supabase SQL Editor.

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
  v_report_id uuid;
begin
  if p_privacy_acknowledged is distinct from true then
    raise exception 'Persetujuan pemberitahuan privasi wajib diberikan.';
  end if;
  if not exists (select 1 from public.schools s where s.id = p_school_id and s.is_active = true) then
    raise exception 'Sekolah tidak tersedia.';
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
  if p_reporter_name is null or char_length(trim(p_reporter_name)) not between 2 and 120 then
    raise exception 'Nama lengkap wajib diisi.';
  end if;
  if p_reporter_class is null or char_length(trim(p_reporter_class)) not between 1 and 40 then
    raise exception 'Kelas wajib diisi.';
  end if;
  if p_reporter_contact is not null and char_length(p_reporter_contact) > 80 then
    raise exception 'Kontak terlalu panjang.';
  end if;

  -- gen_random_uuid() is available in PostgreSQL; avoid pgcrypto schema lookup.
  v_code := 'RCS-' || to_char(now(), 'YYYY') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  insert into public.reports (
    report_code, school_id, category, incident_date,
    incident_location, school_environment, description
  ) values (
    v_code, p_school_id, p_category, p_incident_date,
    trim(p_incident_location), trim(p_school_environment), trim(p_description)
  ) returning id into v_report_id;

  insert into public.report_identities (report_id, full_name, class_name, contact)
  values (
    v_report_id, trim(p_reporter_name), trim(p_reporter_class),
    nullif(trim(coalesce(p_reporter_contact, '')), '')
  );

  return v_code;
end;
$$;

revoke all on function public.submit_student_report(uuid,text,text,text,text,date,text,text,text,boolean) from public;
grant execute on function public.submit_student_report(uuid,text,text,text,text,date,text,text,text,boolean) to anon, authenticated;
