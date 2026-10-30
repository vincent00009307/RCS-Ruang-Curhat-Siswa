document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const REPORTS_KEY = 'rcsReports';
  const ADMIN_KEY = 'rcsAdminLoggedIn';
  const loginForm = document.getElementById('adminLoginForm');
  const loginPanel = document.getElementById('loginPanel');
  const adminDashboard = document.getElementById('adminDashboard');
  const authError = document.getElementById('authError');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const reportForm = document.getElementById('laporanForm');
  const reportsList = document.getElementById('reportsList');
  const tableBody = document.getElementById('adminTableBody');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const sortFilter = document.getElementById('sortFilter');

  function showToast(message) {
    let toast = document.getElementById('rcsToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rcsToast';
      toast.style.position = 'fixed';
      toast.style.right = '20px';
      toast.style.bottom = '20px';
      toast.style.background = 'rgba(16, 33, 59, 0.9)';
      toast.style.color = '#fff';
      toast.style.padding = '12px 16px';
      toast.style.borderRadius = '12px';
      toast.style.boxShadow = '0 18px 40px rgba(16, 33, 59, 0.18)';
      toast.style.zIndex = '9999';
      toast.style.fontWeight = '700';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2200);
  }

  function getReports() {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveReports(reports) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }

  function normalizeStatus(value) {
    return (value || 'Baru').trim();
  }

  function statusClass(value) {
    const status = normalizeStatus(value);
    if (status === 'Selesai') return 'status-selesai';
    if (status === 'Ditinjau') return 'status-ditinjau';
    return 'status-baru';
  }

  function renderPublicReports() {
    if (!reportsList) return;
    const reports = getReports();

    if (!reports.length) {
      reportsList.innerHTML = '<p class="empty-state">Belum ada laporan yang disimpan.</p>';
      return;
    }

    reportsList.innerHTML = reports
      .slice()
      .reverse()
      .map((report) => {
        const status = normalizeStatus(report.status);
        return `
          <article class="report-item">
            <div class="report-item-top">
              <h4>${report.namaPelapor || 'Pelapor'}</h4>
              <button class="delete-btn" type="button" data-id="${report.id}">Hapus</button>
            </div>
            <div class="report-meta">
              <span>${report.asalSekolah || 'Sekolah'}</span>
              <span>${report.lingkunganSekolah || 'Lingkungan'}</span>
              <span class="status-badge ${statusClass(status)}">${status}</span>
            </div>
            <p>${report.deskripsiKejadian || 'Tidak ada deskripsi.'}</p>
          </article>
        `;
      })
      .join('');

    reportsList.querySelectorAll('.delete-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const reportId = Number(button.dataset.id);
        const remaining = getReports().filter((item) => item.id !== reportId);
        saveReports(remaining);
        renderPublicReports();
        renderAdminDashboard();
        showToast('Laporan berhasil dihapus.');
      });
    });
  }

  function renderAdminDashboard() {
    if (!tableBody) return;

    const allReports = getReports();
    const total = allReports.length;
    const done = allReports.filter((report) => normalizeStatus(report.status) === 'Selesai').length;
    const review = allReports.filter((report) => normalizeStatus(report.status) === 'Ditinjau').length;
    const newCount = allReports.filter((report) => normalizeStatus(report.status) === 'Baru').length;

    const totalNode = document.getElementById('countTotal');
    const doneNode = document.getElementById('countDone');
    const reviewNode = document.getElementById('countReview');
    const newNode = document.getElementById('countNew');

    if (totalNode) totalNode.textContent = total;
    if (doneNode) doneNode.textContent = done;
    if (reviewNode) reviewNode.textContent = review;
    if (newNode) newNode.textContent = newCount;

    let filteredReports = [...allReports];

    if (searchInput && searchInput.value.trim()) {
      const keyword = searchInput.value.trim().toLowerCase();
      filteredReports = filteredReports.filter((report) => {
        const haystack = [
          report.namaPelapor,
          report.asalSekolah,
          report.lingkunganSekolah,
          report.lokasiKejadian,
          report.deskripsiKejadian,
        ].join(' ').toLowerCase();
        return haystack.includes(keyword);
      });
    }

    if (statusFilter && statusFilter.value && statusFilter.value !== 'all') {
      filteredReports = filteredReports.filter((report) => normalizeStatus(report.status) === statusFilter.value);
    }

    const orderMap = { Baru: 1, Ditinjau: 2, Selesai: 3 };
    if (sortFilter && sortFilter.value === 'oldest') {
      filteredReports = filteredReports.sort((a, b) => new Date(a.tanggalKejadian) - new Date(b.tanggalKejadian));
    } else if (sortFilter && sortFilter.value === 'status') {
      filteredReports = filteredReports.sort((a, b) => {
        const statusA = orderMap[normalizeStatus(a.status)] || 0;
        const statusB = orderMap[normalizeStatus(b.status)] || 0;
        return statusB - statusA;
      });
    } else {
      filteredReports = filteredReports.sort((a, b) => new Date(b.tanggalKejadian) - new Date(a.tanggalKejadian));
    }

    if (!filteredReports.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="empty-row">Belum ada laporan yang sesuai filter.</td></tr>';
      return;
    }

    tableBody.innerHTML = filteredReports
      .map((report) => {
        const status = normalizeStatus(report.status);
        return `
          <tr>
            <td>${report.namaPelapor || '-'}</td>
            <td>${report.asalSekolah || '-'}</td>
            <td>${report.lingkunganSekolah || '-'}</td>
            <td>${report.lokasiKejadian || '-'}</td>
            <td>${(report.deskripsiKejadian || '').slice(0, 120)}${(report.deskripsiKejadian || '').length > 120 ? '...' : ''}</td>
            <td>
              <select class="status-select" data-id="${report.id}" aria-label="Ubah status laporan">
                <option value="Baru" ${status === 'Baru' ? 'selected' : ''}>Baru</option>
                <option value="Ditinjau" ${status === 'Ditinjau' ? 'selected' : ''}>Ditinjau</option>
                <option value="Selesai" ${status === 'Selesai' ? 'selected' : ''}>Selesai</option>
              </select>
            </td>
            <td>${report.tanggalKejadian || '-'}</td>
          </tr>
        `;
      })
      .join('');
  }

  if (reportForm) {
    reportForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(reportForm);
      const report = {
        id: Date.now(),
        namaPelapor: formData.get('namaPelapor')?.toString().trim() || '',
        status: formData.get('statusLaporan')?.toString() || 'Baru',
        asalSekolah: formData.get('asalSekolah')?.toString() || '',
        lokasiKejadian: formData.get('lokasiKejadian')?.toString().trim() || '',
        tanggalKejadian: formData.get('tanggalKejadian')?.toString() || '',
        lingkunganSekolah: formData.get('lingkunganSekolah')?.toString() || '',
        deskripsiKejadian: formData.get('deskripsiKejadian')?.toString().trim() || '',
      };

      const reports = getReports();
      reports.push(report);
      saveReports(reports);
      renderPublicReports();
      renderAdminDashboard();
      showToast('Laporan berhasil disimpan.');
      reportForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const school = document.getElementById('schoolName')?.value || '';
      const password = document.getElementById('adminPassword')?.value || '';

      if (school && password === 'RCS2026') {
        localStorage.setItem(ADMIN_KEY, 'true');
        if (authError) authError.textContent = '';
        if (loginPanel) loginPanel.hidden = true;
        if (adminDashboard) adminDashboard.hidden = false;
        renderAdminDashboard();
        showToast('Login berhasil.');
      } else {
        if (authError) authError.textContent = 'Nama sekolah atau password salah.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(ADMIN_KEY);
      if (loginPanel) loginPanel.hidden = false;
      if (adminDashboard) adminDashboard.hidden = true;
      if (authError) authError.textContent = '';
      const schoolInput = document.getElementById('schoolName');
      const passwordInput = document.getElementById('adminPassword');
      if (schoolInput) schoolInput.value = '';
      if (passwordInput) passwordInput.value = '';
      showToast('Berhasil keluar.');
    });
  }

  if (tableBody) {
    tableBody.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement) || !target.classList.contains('status-select')) return;

      const reportId = Number(target.dataset.id);
      const nextStatus = target.value;
      const reports = getReports().map((item) => {
        if (item.id === reportId) return { ...item, status: nextStatus };
        return item;
      });
      saveReports(reports);
      renderPublicReports();
      renderAdminDashboard();
      showToast(`Status laporan diubah menjadi ${nextStatus}.`);
    });
  }

  if (searchInput) searchInput.addEventListener('input', renderAdminDashboard);
  if (statusFilter) statusFilter.addEventListener('change', renderAdminDashboard);
  if (sortFilter) sortFilter.addEventListener('change', renderAdminDashboard);

  const isLoggedIn = localStorage.getItem(ADMIN_KEY) === 'true';
  if (loginPanel && adminDashboard) {
    loginPanel.hidden = !(!isLoggedIn);
    adminDashboard.hidden = !isLoggedIn;
  }

  renderPublicReports();
  renderAdminDashboard();
});
