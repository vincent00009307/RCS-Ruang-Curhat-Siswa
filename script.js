const STORAGE_KEY = "rcsReports";
const ADMIN_SESSION_KEY = "rcsAdminSession";

const DEMO_REPORTS = [
  {
    id: "demo-1",
    namaPelapor: "Aulia Rahma",
    statusLaporan: "Baru",
    asalSekolah: "SMA Negeri 7 Banda Aceh",
    lokasiKejadian: "Koridor sekolah",
    tanggalKejadian: "2026-10-20",
    lingkunganSekolah: "Koridor",
    deskripsiKejadian: "Saya mendapat komentar mengejek dan menyalahkan saat melewati koridor saat istirahat. Saya merasa malu dan tidak nyaman di sekolah.",
  },
  {
    id: "demo-2",
    namaPelapor: "Fikri Al-Hafiz",
    statusLaporan: "Ditinjau",
    asalSekolah: "SMA Labschool Banda Aceh",
    lokasiKejadian: "Kelas XI-2",
    tanggalKejadian: "2026-10-18",
    lingkunganSekolah: "Kelas",
    deskripsiKejadian: "Teman sekelas membuat grup chat dengan nama yang menyindir saya. Saya sudah melaporkan ke guru namun masih terjadi.",
  },
  {
    id: "demo-3",
    namaPelapor: "Nadia Putri",
    statusLaporan: "Selesai",
    asalSekolah: "SMA Muhammadiyah 1 Banda Aceh",
    lokasiKejadian: "Perpustakaan",
    tanggalKejadian: "2026-10-12",
    lingkunganSekolah: "Perpustakaan",
    deskripsiKejadian: "Saya mendapat intimidasi verbal dari beberapa siswa saat belajar di perpustakaan. Setelah pembicaraan dengan BK, situasi sudah mulai membaik.",
  },
];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeSchoolPassword = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getReports = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveReports = (reports) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

const seedDemoReports = () => {
  if (getReports().length === 0) {
    saveReports(DEMO_REPORTS);
  }
};

const renderLandingReports = () => {
  const list = document.getElementById("reportsList");
  if (!list) return;

  const reports = getReports();
  if (!reports.length) {
    list.innerHTML = '<p class="empty-state">Belum ada laporan yang disimpan.</p>';
    return;
  }

  list.innerHTML = reports
    .slice()
    .reverse()
    .map(
      (report) => `
        <article class="report-item">
          <div class="report-item-top">
            <h4>${escapeHtml(report.namaPelapor)}</h4>
            <button type="button" class="delete-btn" data-id="${report.id}">Hapus</button>
          </div>
          <div class="report-meta">
            <span>${escapeHtml(report.statusLaporan)}</span>
            <span>${escapeHtml(report.asalSekolah)}</span>
            <span>${escapeHtml(report.tanggalKejadian)}</span>
          </div>
          <p>${escapeHtml(report.deskripsiKejadian)}</p>
        </article>
      `
    )
    .join("");
};

const renderAdminDashboard = () => {
  const totalReportsEl = document.getElementById("totalReports");
  const newReportsEl = document.getElementById("newReports");
  const reviewReportsEl = document.getElementById("reviewReports");
  const doneReportsEl = document.getElementById("doneReports");
  const tableBody = document.getElementById("adminReportTableBody");
  const searchInput = document.getElementById("searchInput");
  const schoolFilter = document.getElementById("schoolFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (!totalReportsEl || !tableBody) return;

  const reports = getReports();
  const total = reports.length;
  const newCount = reports.filter((report) => report.statusLaporan === "Baru").length;
  const reviewCount = reports.filter((report) => report.statusLaporan === "Ditinjau").length;
  const doneCount = reports.filter((report) => report.statusLaporan === "Selesai").length;

  totalReportsEl.textContent = String(total);
  newReportsEl.textContent = String(newCount);
  reviewReportsEl.textContent = String(reviewCount);
  doneReportsEl.textContent = String(doneCount);

  const filters = {
    search: (searchInput ? searchInput.value : "").trim().toLowerCase(),
    school: schoolFilter ? schoolFilter.value : "",
    status: statusFilter ? statusFilter.value : "",
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !filters.search ||
      `${report.namaPelapor} ${report.asalSekolah} ${report.lokasiKejadian}`
        .toLowerCase()
        .includes(filters.search);

    const matchesSchool = !filters.school || report.asalSekolah === filters.school;
    const matchesStatus = !filters.status || report.statusLaporan === filters.status;

    return matchesSearch && matchesSchool && matchesStatus;
  });

  if (!filteredReports.length) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Belum ada laporan.</td></tr>';
    return;
  }

  const statusClassMap = {
    Baru: "status-baru",
    Ditinjau: "status-ditinjau",
    Selesai: "status-selesai",
  };

  tableBody.innerHTML = filteredReports
    .slice()
    .reverse()
    .map(
      (report) => `
        <tr>
          <td>${escapeHtml(report.namaPelapor)}</td>
          <td>${escapeHtml(report.asalSekolah)}</td>
          <td>${escapeHtml(report.lokasiKejadian)}</td>
          <td>${escapeHtml(report.tanggalKejadian)}</td>
          <td><span class="status-badge ${statusClassMap[report.statusLaporan] || ""}">${escapeHtml(report.statusLaporan)}</span></td>
          <td>${escapeHtml(report.deskripsiKejadian)}</td>
        </tr>
      `
    )
    .join("");
};

const populateSchoolFilter = () => {
  const schoolFilter = document.getElementById("schoolFilter");
  if (!schoolFilter) return;

  const reports = getReports();
  const uniqueSchools = [...new Set(reports.map((report) => report.asalSekolah).filter(Boolean))];

  schoolFilter.innerHTML = ['<option value="">Semua sekolah</option>']
    .concat(
      uniqueSchools.map(
        (school) => `<option value="${escapeHtml(school)}">${escapeHtml(school)}</option>`
      )
    )
    .join("");
};

const initLandingPage = () => {
  const form = document.getElementById("laporanForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const report = {
      id: Date.now().toString(),
      namaPelapor: document.getElementById("namaPelapor").value.trim(),
      statusLaporan: document.getElementById("statusLaporan").value,
      asalSekolah: document.getElementById("asalSekolah").value,
      lokasiKejadian: document.getElementById("lokasiKejadian").value.trim(),
      tanggalKejadian: document.getElementById("tanggalKejadian").value,
      lingkunganSekolah: document.getElementById("lingkunganSekolah").value,
      deskripsiKejadian: document.getElementById("deskripsiKejadian").value.trim(),
    };

    if (!report.namaPelapor || !report.asalSekolah || !report.lokasiKejadian || !report.tanggalKejadian || !report.deskripsiKejadian) {
      return;
    }

    const reports = getReports();
    reports.push(report);
    saveReports(reports);
    renderLandingReports();
    populateSchoolFilter();
    renderAdminDashboard();
    form.reset();
  });

  document.getElementById("reportsList")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest(".delete-btn");
    if (!button) return;

    const id = button.dataset.id;
    if (!id) return;

    const updatedReports = getReports().filter((report) => report.id !== id);
    saveReports(updatedReports);
    renderLandingReports();
    populateSchoolFilter();
    renderAdminDashboard();
  });

  renderLandingReports();
  populateSchoolFilter();
};

const initAdminPage = () => {
  const adminForm = document.getElementById("adminLoginForm");
  const adminDashboard = document.getElementById("adminDashboard");
  const adminAuth = document.getElementById("adminAuth");
  const logoutBtn = document.getElementById("logoutBtn");

  const isLoggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  if (isLoggedIn) {
    if (adminAuth) adminAuth.hidden = true;
    if (adminDashboard) adminDashboard.hidden = false;
  }

  if (adminForm) {
    adminForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedSchool = document.getElementById("adminSchool")?.value || "";
      const password = document.getElementById("adminPassword")?.value || "";
      const errorText = document.getElementById("adminError");

      const normalizedSchool = normalizeSchoolPassword(selectedSchool);
      const normalizedPassword = normalizeSchoolPassword(password);

      if (!selectedSchool || !password) {
        if (errorText) errorText.textContent = "Pilih sekolah dan masukkan password.";
        return;
      }

      if (normalizedPassword === normalizedSchool) {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
        if (adminAuth) adminAuth.hidden = true;
        if (adminDashboard) adminDashboard.hidden = false;
        if (errorText) errorText.textContent = "";
        renderAdminDashboard();
        return;
      }

      if (errorText) errorText.textContent = "Password salah. Coba cek kembali data sekolah dan password.";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      if (adminAuth) adminAuth.hidden = false;
      if (adminDashboard) adminDashboard.hidden = true;
      const adminPassword = document.getElementById("adminPassword");
      const adminSchool = document.getElementById("adminSchool");
      if (adminPassword) adminPassword.value = "";
      if (adminSchool) adminSchool.value = "";
    });
  }

  const searchInput = document.getElementById("searchInput");
  const schoolFilter = document.getElementById("schoolFilter");
  const statusFilter = document.getElementById("statusFilter");

  [searchInput, schoolFilter, statusFilter].forEach((element) => {
    if (element) {
      element.addEventListener("input", renderAdminDashboard);
      element.addEventListener("change", renderAdminDashboard);
    }
  });

  renderAdminDashboard();
};

const initYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

document.addEventListener("DOMContentLoaded", () => {
  seedDemoReports();
  initYear();
  initLandingPage();
  initAdminPage();
});
