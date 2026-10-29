const STORAGE_KEY = "rcsReports";
const ADMIN_SESSION_KEY = "rcsAdminSession";
const ADMIN_PASSWORD = "RCS2026";

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
            <h4>${escapeHtml(report.namaPelapor || "Pelapor tidak diketahui")}</h4>
            <button type="button" class="delete-btn" data-id="${report.id}">Hapus</button>
          </div>
          <div class="report-meta">
            <span>${escapeHtml(report.statusLaporan || "Baru")}</span>
            <span>${escapeHtml(report.asalSekolah || "Sekolah belum diisi")}</span>
            <span>${escapeHtml(report.tanggalKejadian || "-")}</span>
          </div>
          <p>${escapeHtml(report.deskripsiKejadian || "Tidak ada deskripsi.")}</p>
        </article>
      `
    )
    .join("");
};

const renderAdminDashboard = () => {
  const totalReportsEl = document.getElementById("countTotal");
  const newReportsEl = document.getElementById("countNew");
  const reviewReportsEl = document.getElementById("countReview");
  const doneReportsEl = document.getElementById("countDone");
  const tableBody = document.getElementById("adminTableBody");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (!tableBody) return;

  const reports = getReports();
  const total = reports.length;
  const newCount = reports.filter((report) => report.statusLaporan === "Baru").length;
  const reviewCount = reports.filter((report) => report.statusLaporan === "Ditinjau").length;
  const doneCount = reports.filter((report) => report.statusLaporan === "Selesai").length;

  if (totalReportsEl) totalReportsEl.textContent = String(total);
  if (newReportsEl) newReportsEl.textContent = String(newCount);
  if (reviewReportsEl) reviewReportsEl.textContent = String(reviewCount);
  if (doneReportsEl) doneReportsEl.textContent = String(doneCount);

  const filters = {
    search: (searchInput ? searchInput.value : "").trim().toLowerCase(),
    status: statusFilter ? statusFilter.value : "all",
  };

  let filteredReports = reports.filter((report) => {
    const matchesSearch =
      !filters.search ||
      `${report.namaPelapor || ""} ${report.asalSekolah || ""} ${report.lokasiKejadian || ""}`
        .toLowerCase()
        .includes(filters.search);

    const matchesStatus = filters.status === "all" || report.statusLaporan === filters.status;
    return matchesSearch && matchesStatus;
  });

  if (sortFilter) {
    const sortValue = sortFilter.value;
    filteredReports = [...filteredReports].sort((a, b) => {
      if (sortValue === "oldest") {
        return new Date(a.tanggalKejadian || 0) - new Date(b.tanggalKejadian || 0);
      }
      if (sortValue === "status") {
        const statusOrder = { Baru: 1, Ditinjau: 2, Selesai: 3 };
        return (statusOrder[a.statusLaporan] || 0) - (statusOrder[b.statusLaporan] || 0);
      }
      return new Date(b.tanggalKejadian || 0) - new Date(a.tanggalKejadian || 0);
    });
  }

  if (!filteredReports.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-row">Belum ada laporan.</td></tr>';
    return;
  }

  const statusClassMap = {
    Baru: "status-baru",
    Ditinjau: "status-ditinjau",
    Selesai: "status-selesai",
  };

  tableBody.innerHTML = filteredReports
    .map(
      (report) => `
        <tr>
          <td>${escapeHtml(report.namaPelapor || "-")}</td>
          <td>${escapeHtml(report.asalSekolah || "-")}</td>
          <td>${escapeHtml(report.lingkunganSekolah || "-")}</td>
          <td>${escapeHtml(report.lokasiKejadian || "-")}</td>
          <td>${escapeHtml(report.deskripsiKejadian || "-")}</td>
          <td><span class="status-badge ${statusClassMap[report.statusLaporan] || ""}">${escapeHtml(report.statusLaporan || "Baru")}</span></td>
          <td>${escapeHtml(report.tanggalKejadian || "-")}</td>
        </tr>
      `
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
      namaPelapor: document.getElementById("namaPelapor")?.value.trim() || "",
      statusLaporan: document.getElementById("statusLaporan")?.value || "Baru",
      asalSekolah: document.getElementById("asalSekolah")?.value || "",
      lokasiKejadian: document.getElementById("lokasiKejadian")?.value.trim() || "",
      tanggalKejadian: document.getElementById("tanggalKejadian")?.value || "",
      lingkunganSekolah: document.getElementById("lingkunganSekolah")?.value || "",
      deskripsiKejadian: document.getElementById("deskripsiKejadian")?.value.trim() || "",
    };

    if (!report.namaPelapor || !report.asalSekolah || !report.lokasiKejadian || !report.tanggalKejadian || !report.deskripsiKejadian) {
      return;
    }

    const reports = getReports();
    reports.push(report);
    saveReports(reports);
    renderLandingReports();
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
    renderAdminDashboard();
  });

  renderLandingReports();
};

const initAdminPage = () => {
  const adminForm = document.getElementById("adminLoginForm");
  const adminDashboard = document.getElementById("adminDashboard");
  const loginPanel = document.getElementById("loginPanel");
  const logoutBtn = document.getElementById("adminLogoutBtn");
  const errorText = document.getElementById("authError");

  const isLoggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  if (isLoggedIn) {
    if (loginPanel) loginPanel.hidden = true;
    if (adminDashboard) adminDashboard.hidden = false;
  }

  if (adminForm) {
    adminForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedSchool = document.getElementById("schoolName")?.value || "";
      const password = document.getElementById("adminPassword")?.value || "";

      if (!selectedSchool || !password) {
        if (errorText) errorText.textContent = "Pilih sekolah dan masukkan password.";
        return;
      }

      const normalizedPassword = normalizeSchoolPassword(password);
      const isValidPassword = normalizedPassword === normalizeSchoolPassword(ADMIN_PASSWORD);

      if (isValidPassword) {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
        if (loginPanel) loginPanel.hidden = true;
        if (adminDashboard) adminDashboard.hidden = false;
        if (errorText) errorText.textContent = "";
        renderAdminDashboard();
        return;
      }

      if (errorText) errorText.textContent = "Password salah. Coba cek kembali password demo.";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      if (loginPanel) loginPanel.hidden = false;
      if (adminDashboard) adminDashboard.hidden = true;
      const adminPassword = document.getElementById("adminPassword");
      const schoolName = document.getElementById("schoolName");
      if (adminPassword) adminPassword.value = "";
      if (schoolName) schoolName.value = "";
      if (errorText) errorText.textContent = "";
    });
  }

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const sortFilter = document.getElementById("sortFilter");

  [searchInput, statusFilter, sortFilter].forEach((element) => {
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

