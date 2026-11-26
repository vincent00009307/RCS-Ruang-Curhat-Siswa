(() => {
  "use strict";

  const supabaseUrl = window.RCS_SUPABASE_URL;
  const supabaseKey = window.RCS_SUPABASE_PUBLISHABLE_KEY;
  const clientFactory = window.supabase && window.supabase.createClient;
  const db = supabaseUrl && supabaseKey && clientFactory
    ? clientFactory(supabaseUrl, supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
    : null;

  const statuses = ["Baru", "Ditinjau", "Ditangani", "Perlu tindak lanjut", "Selesai"];
  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
  const showToast = (message) => {
    let toast = $("rcsToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "rcsToast";
      Object.assign(toast.style, {
        position: "fixed", right: "20px", bottom: "20px", zIndex: "9999",
        background: "rgba(16,33,59,.94)", color: "#fff", padding: "12px 16px",
        borderRadius: "12px", boxShadow: "0 18px 40px rgba(16,33,59,.18)"
      });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => { toast.hidden = true; }, 3500);
  };
  const showError = (node, message) => { if (node) node.textContent = message || ""; };
  const setBusy = (button, busy, busyText = "Memproses...") => {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = busyText;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) button.textContent = button.dataset.originalText;
    }
  };
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value + "T00:00:00");
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
  };

  async function loadSchools(selectId) {
    const select = $(selectId);
    if (!select || !db) return;
    const { data, error } = await db.from("schools").select("id,name").eq("is_active", true).order("name");
    if (error) {
      select.innerHTML = '<option value="">Daftar sekolah tidak dapat dimuat</option>';
      console.error("RCS schools:", error.message);
      return;
    }
    select.innerHTML = '<option value="">Pilih sekolah</option>' + (data || [])
      .map((school) => '<option value="' + escapeHtml(school.id) + '">' + escapeHtml(school.name) + '</option>')
      .join("");
  }

  async function initPublicForm() {
    const form = $("laporanForm");
    if (!form) return;
    const feedback = $("reportFeedback");
    const submitButton = form.querySelector('button[type="submit"]');

    if (!db) {
      showError(feedback, "Koneksi layanan belum siap. Muat ulang halaman atau hubungi pengelola.");
      if (submitButton) submitButton.disabled = true;
      return;
    }

    await loadSchools("asalSekolah");
    const dateInput = $("tanggalKejadian");
    if (dateInput) dateInput.max = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showError(feedback, "");
      if (!form.reportValidity()) return;

      const payload = {
        p_school_id: $("asalSekolah").value,
        p_reporter_name: $("namaPelapor").value.trim(),
        p_reporter_class: $("kelasPelapor").value.trim(),
        p_reporter_contact: $("kontakPelapor").value.trim() || null,
        p_category: $("kategoriLaporan").value,
        p_incident_date: $("tanggalKejadian").value,
        p_incident_location: $("lokasiKejadian").value.trim(),
        p_school_environment: $("lingkunganSekolah").value,
        p_description: $("deskripsiKejadian").value.trim(),
        p_privacy_acknowledged: $("privacyAcknowledged").checked
      };

      setBusy(submitButton, true, "Mengirim laporan...");
      const { data, error } = await db.rpc("submit_student_report", payload);
      setBusy(submitButton, false);
      if (error) {
        showError(feedback, "Laporan belum terkirim. Periksa isian lalu coba lagi. (" + error.message + ")");
        return;
      }

      form.reset();
      if (dateInput) dateInput.max = new Date().toISOString().slice(0, 10);
      showToast("Laporan berhasil dikirim. Simpan kode referensi kamu.");
      if (feedback) {
        feedback.classList.remove("auth-error");
        feedback.style.color = "var(--success)";
        feedback.textContent = "Laporan terkirim. Kode referensi: " + data + ". Simpan kode ini dan sampaikan kepada BK jika diperlukan.";
      }
    });
  }

  async function loadAdminReports() {
    const tableBody = $("adminTableBody");
    if (!tableBody || !db) return;
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Memuat laporan...</td></tr>';

    const { data, error } = await db
      .from("reports")
      .select("id,report_code,category,incident_date,incident_location,school_environment,description,status,created_at,report_identities(full_name,class_name,contact)")
      .order("created_at", { ascending: false });

    if (error) {
      tableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Laporan tidak dapat dimuat. Periksa izin akun atau koneksi.</td></tr>';
      console.error("RCS reports:", error.message);
      return;
    }

    const reports = data || [];
    $("countTotal").textContent = String(reports.length);
    $("countDone").textContent = String(reports.filter((r) => r.status === "Selesai").length);
    $("countReview").textContent = String(reports.filter((r) => r.status === "Ditinjau").length);
    $("countNew").textContent = String(reports.filter((r) => r.status === "Baru").length);

    const search = ($("searchInput")?.value || "").trim().toLowerCase();
    const status = $("statusFilter")?.value || "all";
    const sort = $("sortFilter")?.value || "latest";
    let filtered = reports.filter((r) => {
      const identity = Array.isArray(r.report_identities) ? r.report_identities[0] : r.report_identities;
      const text = [r.report_code, r.category, r.description, r.incident_location, identity?.full_name, identity?.class_name].join(" ").toLowerCase();
      return (!search || text.includes(search)) && (status === "all" || r.status === status);
    });
    if (sort === "oldest") filtered.reverse();
    if (sort === "status") filtered.sort((a, b) => statuses.indexOf(a.status) - statuses.indexOf(b.status));

    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Belum ada laporan yang sesuai filter.</td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map((r) => {
      const identity = Array.isArray(r.report_identities) ? r.report_identities[0] : r.report_identities;
      const name = identity?.full_name || "—";
      const className = identity?.class_name || "—";
      const options = statuses.map((s) => '<option value="' + escapeHtml(s) + '"' + (r.status === s ? " selected" : "") + ">" + escapeHtml(s) + "</option>").join("");
      return '<tr>' +
        '<td>' + escapeHtml(r.report_code) + '</td>' +
        '<td>' + escapeHtml(name) + '<br><small>' + escapeHtml(className) + '</small></td>' +
        '<td>' + escapeHtml(r.category) + '</td>' +
        '<td>' + escapeHtml(r.incident_location) + '<br><small>' + escapeHtml(formatDate(r.incident_date)) + '</small></td>' +
        '<td style="white-space:pre-wrap;max-width:360px">' + escapeHtml(r.description) + '</td>' +
        '<td><select class="status-select" data-id="' + escapeHtml(r.id) + '" aria-label="Ubah status laporan">' + options + '</select></td>' +
        '</tr>';
    }).join("");
  }

  async function initAdmin() {
    const loginForm = $("adminLoginForm");
    const loginPanel = $("loginPanel");
    const dashboard = $("adminDashboard");
    const errorNode = $("authError");
    if (!loginForm || !dashboard || !loginPanel) return;

    if (!db) {
      showError(errorNode, "Koneksi layanan belum siap. Periksa konfigurasi aplikasi.");
      return;
    }

    async function showDashboard() {
      const { data: { user }, error: userError } = await db.auth.getUser();
      if (userError || !user) {
        loginPanel.hidden = false;
        dashboard.hidden = true;
        return;
      }

      const { data: profile, error: profileError } = await db
        .from("profiles")
        .select("full_name,role,school_id,is_active")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile || !profile.is_active || profile.role !== "school_admin" || !profile.school_id) {
        await db.auth.signOut();
        showError(errorNode, "Akun ini belum terdaftar sebagai admin BK aktif. Hubungi pengelola RCS.");
        loginPanel.hidden = false;
        dashboard.hidden = true;
        return;
      }

      const { data: school } = await db.from("schools").select("name").eq("id", profile.school_id).maybeSingle();
      $("adminSchoolName").textContent = (profile.full_name || "Admin BK") + " · " + (school?.name || "Sekolah terdaftar");
      loginPanel.hidden = true;
      dashboard.hidden = false;
      await loadAdminReports();
    }

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      showError(errorNode, "");
      const button = loginForm.querySelector('button[type="submit"]');
      setBusy(button, true, "Memverifikasi...");
      const { error } = await db.auth.signInWithPassword({
        email: $("adminEmail").value.trim(),
        password: $("adminPassword").value
      });
      setBusy(button, false);
      if (error) {
        showError(errorNode, "Email atau password tidak cocok, atau akun belum aktif.");
        return;
      }
      await showDashboard();
    });

    $("adminLogoutBtn")?.addEventListener("click", async () => {
      await db.auth.signOut();
      dashboard.hidden = true;
      loginPanel.hidden = false;
      loginForm.reset();
      showError(errorNode, "");
    });

    ["searchInput", "statusFilter", "sortFilter"].forEach((id) => {
      $(id)?.addEventListener("input", loadAdminReports);
      $(id)?.addEventListener("change", loadAdminReports);
    });

    $("adminTableBody")?.addEventListener("change", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement) || !target.classList.contains("status-select")) return;
      target.disabled = true;
      const { error } = await db.rpc("update_report_status", {
        p_report_id: target.dataset.id,
        p_new_status: target.value,
        p_note: ""
      });
      if (error) {
        showToast("Status gagal diperbarui. Periksa akses dan coba lagi.");
        console.error("RCS status update:", error.message);
      } else {
        showToast("Status laporan berhasil diperbarui.");
      }
      await loadAdminReports();
    });

    const { data: { session } } = await db.auth.getSession();
    if (session) await showDashboard();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const year = $("year");
    if (year) year.textContent = new Date().getFullYear();
    await initPublicForm();
    await initAdmin();
  });
})();
