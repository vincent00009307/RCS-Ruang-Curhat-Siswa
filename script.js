document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const STORAGE_KEY = "rcsReports";

  function getReports() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Gagal membaca localStorage:", error);
      return [];
    }
  }

  function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function renderReports() {
    const reports = getReports();
    const reportsList = document.getElementById("reportsList");

    if (!reportsList) return;

    if (reports.length === 0) {
      reportsList.innerHTML = '<p class="empty-state">Belum ada laporan yang disimpan.</p>';
      return;
    }

    reportsList.innerHTML = reports
      .map(
        (report, index) => `
          <article class="report-item">
            <div class="report-item-top">
              <h4>${report.namaPelapor || "Pelapor"}</h4>
              <button class="delete-btn" data-index="${index}" type="button">Hapus</button>
            </div>
            <div class="report-meta">
              <span>${report.statusLaporan || "Baru"}</span>
              <span>•</span>
              <span>${report.asalSekolah}</span>
              <span>•</span>
              <span>${report.lingkunganSekolah}</span>
              <span>•</span>
              <span>${formatDate(report.tanggalKejadian)}</span>
            </div>
            <p>${report.deskripsiKejadian}</p>
          </article>
        `
      )
      .join("");

    const deleteButtons = reportsList.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const allReports = getReports();
        allReports.splice(index, 1);
        saveReports(allReports);
        renderReports();
        renderDashboard();
      });
    });
  }

  function renderDashboard() {
    const totalReportsEl = document.getElementById("totalReports");
    const newReportsEl = document.getElementById("newReports");
    const reviewReportsEl = document.getElementById("reviewReports");
    const doneReportsEl = document.getElementById("doneReports");
    const tableBody = document.getElementById("adminReportTableBody");
    const schoolFilter = document.getElementById("schoolFilter");
    const statusFilter = document.getElementById("statusFilter");
    const searchInput = document.getElementById("searchInput");

    if (!tableBody) return;

    const reports = getReports();

    if (totalReportsEl) {
      totalReportsEl.textContent = reports.length;
    }

    if (newReportsEl) {
      newReportsEl.textContent = reports.filter((item) => item.statusLaporan === "Baru").length;
    }

    if (reviewReportsEl) {
      reviewReportsEl.textContent = reports.filter((item) => item.statusLaporan === "Ditinjau").length;
    }

    if (doneReportsEl) {
      doneReportsEl.textContent = reports.filter((item) => item.statusLaporan === "Selesai").length;
    }

    const uniqueSchools = [...new Set(reports.map((report) => report.asalSekolah).filter(Boolean))].sort();

    if (schoolFilter) {
      const currentValue = schoolFilter.value;
      schoolFilter.innerHTML = '<option value="">Semua sekolah</option>' +
        uniqueSchools.map((school) => `<option value="${school}">${school}</option>`).join("");
      schoolFilter.value = uniqueSchools.includes(currentValue) ? currentValue : "";
    }

    const searchTerm = (searchInput?.value || "").toLowerCase();
    const schoolTerm = schoolFilter?.value || "";
    const statusTerm = statusFilter?.value || "";

    const filteredReports = reports.filter((report) => {
      const matchSearch =
        !searchTerm ||
        (report.namaPelapor || "").toLowerCase().includes(searchTerm) ||
        (report.asalSekolah || "").toLowerCase().includes(searchTerm) ||
        (report.deskripsiKejadian || "").toLowerCase().includes(searchTerm);

      const matchSchool = !schoolTerm || report.asalSekolah === schoolTerm;
      const matchStatus = !statusTerm || report.statusLaporan === statusTerm;

      return matchSearch && matchSchool && matchStatus;
    });

    if (filteredReports.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Tidak ada laporan sesuai filter.</td></tr>';
      return;
    }

    tableBody.innerHTML = filteredReports
      .map(
        (report) => `
          <tr>
            <td>
              <div class="person-cell">
                <strong>${report.namaPelapor || "Pelapor"}</strong>
              </div>
            </td>
            <td>${report.asalSekolah || "-"}</td>
            <td>${report.lokasiKejadian || "-"}</td>
            <td>${formatDate(report.tanggalKejadian)}</td>
            <td>
              <span class="status-badge status-${(report.statusLaporan || "Baru").toLowerCase().replace(/\s+/g, "-")}">
                ${report.statusLaporan || "Baru"}
              </span>
            </td>
            <td>${report.deskripsiKejadian || "-"}</td>
          </tr>
        `
      )
      .join("");
  }

  const form = document.getElementById("laporanForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const report = {
        id: Date.now(),
        namaPelapor: formData.get("namaPelapor")?.toString().trim(),
        asalSekolah: formData.get("asalSekolah")?.toString().trim(),
        lokasiKejadian: formData.get("lokasiKejadian")?.toString().trim(),
        tanggalKejadian: formData.get("tanggalKejadian")?.toString(),
        lingkunganSekolah: formData.get("lingkunganSekolah")?.toString(),
        deskripsiKejadian: formData.get("deskripsiKejadian")?.toString().trim(),
        statusLaporan: formData.get("statusLaporan")?.toString() || "Baru",
        createdAt: new Date().toISOString(),
      };

      if (!report.namaPelapor || !report.asalSekolah || !report.lokasiKejadian || !report.tanggalKejadian || !report.deskripsiKejadian || !report.lingkunganSekolah) {
        alert("Semua field wajib diisi sebelum menyimpan laporan.");
        return;
      }

      const reports = getReports();
      reports.unshift(report);
      saveReports(reports);
      form.reset();
      renderReports();
      renderDashboard();
      alert("Laporan berhasil disimpan.");
    });
  }

  const searchInput = document.getElementById("searchInput");
  const schoolFilter = document.getElementById("schoolFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (searchInput) {
    searchInput.addEventListener("input", renderDashboard);
  }

  if (schoolFilter) {
    schoolFilter.addEventListener("change", renderDashboard);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", renderDashboard);
  }

  renderReports();
  renderDashboard();
});

