<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard BK | RCS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <style>
      * { box-sizing: border-box; }
      :root {
        --bg: #f5f7ff;
        --primary: #4f46e5;
        --primary-dark: #312e81;
        --accent: #14b8a6;
        --text: #1f2937;
        --muted: #6b7280;
        --white: #ffffff;
        --danger: #ef4444;
        --success: #10b981;
        --border: rgba(148, 163, 184, 0.2);
      }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: "Poppins", sans-serif;
        background: linear-gradient(180deg, #f8faff 0%, #eef3ff 100%);
        color: var(--text);
      }
      a { text-decoration: none; }
      input, select, button { font: inherit; }
      .container { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
      .header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(79, 70, 229, 0.08);
      }
      .nav {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-weight: 800;
        color: var(--primary-dark);
        letter-spacing: 0.04em;
      }
      .brand-mark {
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: var(--white);
        box-shadow: 0 20px 45px rgba(79, 70, 229, 0.12);
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .nav-links a { color: var(--text); font-weight: 500; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 999px;
        padding: 14px 22px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .btn:hover { transform: translateY(-1px); }
      .btn-primary {
        background: linear-gradient(135deg, var(--primary), #7c3aed);
        color: var(--white);
        box-shadow: 0 14px 30px rgba(79, 70, 229, 0.25);
      }
      .eyebrow {
        display: inline-block;
        background: rgba(79, 70, 229, 0.08);
        color: var(--primary-dark);
        border: 1px solid rgba(79, 70, 229, 0.12);
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .admin-page {
        padding: 60px 0 90px;
        min-height: calc(100vh - 80px);
      }
      .auth-shell {
        display: grid;
        place-items: center;
        min-height: 70vh;
      }
      .auth-card {
        width: min(500px, calc(100% - 32px));
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid var(--border);
        border-radius: 28px;
        padding: 32px 28px 26px;
        box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
      }
      .auth-card h2 {
        margin: 18px 0 10px;
        font-size: clamp(2rem, 5vw, 2.5rem);
        letter-spacing: -0.04em;
      }
      .auth-card p {
        margin: 0 0 22px;
        color: var(--muted);
        line-height: 1.7;
      }
      .auth-form { display: grid; gap: 18px; }
      .auth-form label {
        display: grid;
        gap: 10px;
        font-weight: 600;
      }
      .auth-form input, .auth-form select {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: #fff;
        border-radius: 14px;
        padding: 14px 16px;
        color: var(--text);
        outline: none;
      }
      .auth-form input:focus, .auth-form select:focus {
        border-color: rgba(79, 70, 229, 0.5);
        box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
      }
      .auth-error {
        min-height: 24px;
        font-size: 0.88rem;
        color: var(--danger);
        margin: 0;
      }
      .auth-note {
        font-size: 0.82rem;
        color: var(--muted);
        margin-top: 8px;
      }
      .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 28px;
      }
      .dashboard-header h1 {
        margin: 14px 0 0;
        font-size: clamp(2rem, 4vw, 3rem);
        letter-spacing: -0.04em;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
        margin-bottom: 24px;
      }
      .summary-card {
        border-radius: 20px;
        padding: 22px 20px;
        color: var(--white);
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
      }
      .summary-card span { display: block; font-size: 0.85rem; opacity: 0.9; }
      .summary-card strong {
        display: block;
        margin-top: 10px;
        font-size: clamp(2rem, 4vw, 2.5rem);
        line-height: 1;
      }
      .accent-blue { background: linear-gradient(135deg, #2563eb, #4f46e5); }
      .accent-green { background: linear-gradient(135deg, #059669, #10b981); }
      .accent-gold { background: linear-gradient(135deg, #d97706, #f59e0b); }
      .accent-red { background: linear-gradient(135deg, #dc2626, #ef4444); }
      .dashboard-controls {
        display: grid;
        grid-template-columns: 1.4fr 1fr 0.8fr;
        gap: 18px;
        margin-bottom: 18px;
      }
      .filter-group label {
        display: grid;
        gap: 10px;
        font-weight: 600;
      }
      .filter-group input,
      .filter-group select {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: #fff;
        border-radius: 14px;
        padding: 12px 14px;
        color: var(--text);
      }
      .dashboard-table-wrap {
        background: rgba(255,255,255,0.8);
        border: 1px solid var(--border);
        border-radius: 24px;
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.04);
        overflow: hidden;
      }
      .table-header {
        padding: 22px 24px 12px;
      }
      .table-header h2 {
        margin: 0;
        font-size: 1.35rem;
      }
      .table-responsive { overflow-x: auto; }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 820px;
      }
      .report-table th,
      .report-table td {
        text-align: left;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        vertical-align: top;
      }
      .report-table th { background: rgba(79, 70, 229, 0.04); color: var(--primary-dark); }
      .status-badge {
        display: inline-block;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid transparent;
      }
      .status-baru { background: rgba(59,130,246,0.1); color: #1d4ed8; border-color: rgba(59,130,246,0.2); }
      .status-ditinjau { background: rgba(245,158,11,0.12); color: #b45309; border-color: rgba(245,158,11,0.2); }
      .status-selesai { background: rgba(16,185,129,0.12); color: #047857; border-color: rgba(16,185,129,0.2); }
      .empty-row { color: var(--muted); text-align: center; }
      [hidden] { display: none !important; }
      @media (max-width: 820px) {
        .nav { flex-wrap: wrap; height: auto; padding: 18px 0; justify-content: center; }
        .nav-links { width: 100%; justify-content: center; flex-wrap: wrap; }
        .summary-grid, .dashboard-controls { grid-template-columns: 1fr; }
        .dashboard-header { flex-direction: column; align-items: flex-start; }
      }
    </style>
  </head>
  <body data-page="admin">
    <header class="header">
      <nav class="nav container">
        <div class="brand">
          <span class="brand-mark">R</span>
          <span>RCS</span>
        </div>
        <div class="nav-links">
          <a href="index.html">Beranda</a>
          <a href="admin.html">Dashboard BK</a>
        </div>
        <a href="index.html#laporan" class="btn btn-primary">Tambah Laporan</a>
      </nav>
    </header>

    <main class="admin-page">
      <section id="adminAuth" class="auth-shell">
        <div class="auth-card">
          <span class="eyebrow">Akses Admin BK</span>
          <h2>Masuk ke dashboard</h2>
          <p>Guru BK harus memilih sekolah dan memasukkan password sesuai akun sekolah.</p>

          <form id="adminLoginForm" class="auth-form">
            <label>
              <span>Pilih sekolah</span>
              <select id="adminSchool" required>
                <option value="">Pilih sekolah</option>
                <option value="SMA Negeri 1 Banda Aceh">SMA Negeri 1 Banda Aceh</option>
                <option value="SMA Negeri 2 Banda Aceh">SMA Negeri 2 Banda Aceh</option>
                <option value="SMA Negeri 3 Banda Aceh">SMA Negeri 3 Banda Aceh</option>
                <option value="SMA Negeri 4 Banda Aceh">SMA Negeri 4 Banda Aceh</option>
                <option value="SMA Negeri 5 Banda Aceh">SMA Negeri 5 Banda Aceh</option>
                <option value="SMA Negeri 6 Banda Aceh">SMA Negeri 6 Banda Aceh</option>
                <option value="SMA Negeri 7 Banda Aceh">SMA Negeri 7 Banda Aceh</option>
                <option value="SMA Negeri 8 Banda Aceh">SMA Negeri 8 Banda Aceh</option>
                <option value="SMA Negeri 9 Banda Aceh">SMA Negeri 9 Banda Aceh</option>
                <option value="SMA Negeri 10 Banda Aceh">SMA Negeri 10 Banda Aceh</option>
                <option value="SMA Negeri 11 Banda Aceh">SMA Negeri 11 Banda Aceh</option>
                <option value="SMA Negeri 12 Banda Aceh">SMA Negeri 12 Banda Aceh</option>
                <option value="SMA Negeri 13 Banda Aceh">SMA Negeri 13 Banda Aceh</option>
                <option value="SMA Negeri 14 Banda Aceh">SMA Negeri 14 Banda Aceh</option>
                <option value="SMA Negeri 15 Banda Aceh">SMA Negeri 15 Banda Aceh</option>
                <option value="SMA Labschool Banda Aceh">SMA Labschool Banda Aceh</option>
                <option value="SMA Muhammadiyah 1 Banda Aceh">SMA Muhammadiyah 1 Banda Aceh</option>
                <option value="SMA Muhammadiyah 2 Banda Aceh">SMA Muhammadiyah 2 Banda Aceh</option>
                <option value="SMA Al-Masry Banda Aceh">SMA Al-Masry Banda Aceh</option>
                <option value="SMA Ulumul Quran Banda Aceh">SMA Ulumul Quran Banda Aceh</option>
                <option value="SMA IT Al-Fityan Banda Aceh">SMA IT Al-Fityan Banda Aceh</option>
              </select>
            </label>

            <label>
              <span>Password sekolah</span>
              <input type="password" id="adminPassword" placeholder="Contoh: SMANegeri7BandaAceh" required />
            </label>

            <button type="submit" class="btn btn-primary">Masuk Dashboard</button>
            <p id="adminError" class="auth-error" role="alert"></p>
            <p class="auth-note">Contoh: guru BK SMA Negeri 7 Banda Aceh harus memasukkan password <strong>SMANegeri7BandaAceh</strong></p>
          </form>
        </div>
      </section>

      <div id="adminDashboard" hidden>
        <section class="container dashboard-header">
          <div>
            <span class="eyebrow">Admin BK</span>
            <h1>Dashboard Pemantauan Pelapor</h1>
          </div>
          <button id="logoutBtn" type="button" class="btn btn-primary">Keluar</button>
        </section>

        <section class="container summary-grid">
          <div class="summary-card accent-blue">
            <span>Total Laporan</span>
            <strong id="totalReports">0</strong>
          </div>
          <div class="summary-card accent-green">
            <span>Baru</span>
            <strong id="newReports">0</strong>
          </div>
          <div class="summary-card accent-gold">
            <span>Ditinjau</span>
            <strong id="reviewReports">0</strong>
          </div>
          <div class="summary-card accent-red">
            <span>Selesai</span>
            <strong id="doneReports">0</strong>
          </div>
        </section>

        <section class="container dashboard-controls">
          <div class="filter-group">
            <label>
              <span>Cari pelapor / sekolah</span>
              <input type="search" id="searchInput" placeholder="Cari nama atau sekolah..." />
            </label>
          </div>

          <div class="filter-group">
            <label>
              <span>Filter sekolah</span>
              <select id="schoolFilter">
                <option value="">Semua sekolah</option>
              </select>
            </label>
          </div>

          <div class="filter-group">
            <label>
              <span>Status</span>
              <select id="statusFilter">
                <option value="">Semua status</option>
                <option value="Baru">Baru</option>
                <option value="Ditinjau">Ditinjau</option>
                <option value="Selesai">Selesai</option>
              </select>
            </label>
          </div>
        </section>

        <section class="container dashboard-table-wrap">
          <div class="table-header">
            <h2>Daftar Pelapor</h2>
          </div>
          <div class="table-responsive">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Pelapor</th>
                  <th>Sekolah</th>
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody id="adminReportTableBody">
                <tr>
                  <td colspan="6" class="empty-row">Belum ada laporan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <script src="script.js"></script>
  </body>
</html>
