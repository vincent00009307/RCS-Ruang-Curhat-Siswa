# Menyiapkan akun Admin BK RCS

Panduan ini hanya untuk pengelola RCS yang berwenang. Jangan membagikan password admin atau akses dashboard kepada siswa.

## 1. Buat akun Auth untuk petugas BK

1. Buka Supabase Dashboard > Authentication > Users.
2. Pilih **Add user** lalu buat akun dengan email petugas BK yang telah diverifikasi oleh sekolah.
3. Gunakan password sementara yang kuat dan sampaikan secara privat kepada petugas.
4. Salin **User UID** dari akun yang baru dibuat.

Jangan membuat akun admin dengan pendaftaran publik. Jangan pernah menaruh password atau service-role key di file website.

## 2. Hubungkan akun dengan satu sekolah

Buka SQL Editor dan jalankan query berikut setelah mengganti tiga nilai contoh:

```sql
insert into public.profiles (id, school_id, full_name, role, is_active)
select
  'GANTI_DENGAN_USER_UID'::uuid,
  s.id,
  'Nama Petugas BK',
  'school_admin',
  true
from public.schools s
where s.slug = 'sma-negeri-1-banda-aceh';
```

Slug sekolah yang sudah disiapkan:
- sma-negeri-1-banda-aceh sampai sma-negeri-15-banda-aceh
- sma-labschool-banda-aceh
- sma-muhammadiyah-1-banda-aceh
- sma-muhammadiyah-2-banda-aceh
- sma-al-masry-banda-aceh
- sma-ulumul-quran-banda-aceh
- sma-it-al-fityan-banda-aceh

Satu profil admin BK hanya boleh terhubung ke satu sekolah. Jangan menggunakan UID milik orang lain.

## 3. Uji login

1. Buka halaman `/admin.html`.
2. Login menggunakan email dan password akun Auth yang dibuat.
3. Pastikan nama sekolah tampil di dashboard.
4. Pastikan admin hanya dapat melihat laporan dari sekolah yang terhubung dengan profilnya.
5. Uji perubahan status pada laporan uji yang tidak berisi data pribadi.

Jika profil belum dibuat atau tidak aktif, login akan ditolak oleh aplikasi.

## Penting sebelum pilot sekolah

- Jangan mengirim laporan siswa sungguhan sebelum uji akses lintas sekolah, anti-spam/rate limiting, prosedur penanganan bahaya langsung, retensi/penghapusan data, dan peninjauan perlindungan data anak diselesaikan.
- RCS bukan layanan darurat.
- SQL migration mengaktifkan RLS dan membatasi akses tabel, tetapi bukan pengganti audit keamanan menyeluruh.
- Jangan pernah menaruh Supabase secret/service_role key di frontend. File `supabase-config.js` hanya boleh berisi Project URL dan publishable key.
