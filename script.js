const STORAGE_KEY = "rcsReports";
const ADMIN_SESSION_KEY = "rcsAdminSession";

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
      document.getElementById("adminPassword").value = "";
      document.getElementById("adminSchool").value = "";
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
  initYear();
  initLandingPage();
  initAdminPage();
});
