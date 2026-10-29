document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const STORAGE_KEY = "rcsReports";
  const form = document.getElementById("laporanForm");
  const reportsList = document.getElementById("reportsList");

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
              <h4>${report.asalSekolah}</h4>
              <button class="delete-btn" data-index="${index}" type="button">Hapus</button>
            </div>
            <div class="report-meta">
              <span>${report.lingkunganSekolah}</span>
              <span>•</span>
              <span>${report.lokasiKejadian}</span>
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
      });
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const report = {
        asalSekolah: formData.get("asalSekolah")?.toString().trim(),
        lokasiKejadian: formData.get("lokasiKejadian")?.toString().trim(),
        tanggalKejadian: formData.get("tanggalKejadian")?.toString(),
        lingkunganSekolah: formData.get("lingkunganSekolah")?.toString(),
        deskripsiKejadian: formData.get("deskripsiKejadian")?.toString().trim(),
        createdAt: new Date().toISOString(),
      };

      if (!report.asalSekolah || !report.lokasiKejadian || !report.tanggalKejadian || !report.deskripsiKejadian || !report.lingkunganSekolah) {
        alert("Semua field wajib diisi sebelum menyimpan laporan.");
        return;
      }

      const reports = getReports();
      reports.unshift(report);
      saveReports(reports);
      form.reset();
      renderReports();
      alert("Laporan berhasil disimpan.");
    });
  }

  renderReports();
});
