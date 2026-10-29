:root {
  --bg: #edf4ff;
  --bg-soft: #f7faff;
  --surface: #ffffff;
  --surface-alt: #f4f8ff;
  --primary: #1f4ed8;
  --primary-strong: #183eba;
  --primary-soft: rgba(31, 78, 216, 0.1);
  --secondary: #17b7a3;
  --secondary-soft: rgba(23, 183, 163, 0.1);
  --text: #10213b;
  --muted: #58657d;
  --line: rgba(16, 33, 59, 0.12);
  --success: #1bbf75;
  --warning: #f7b731;
  --danger: #ef4444;
  --shadow-soft: 0 18px 40px rgba(16, 33, 59, 0.08);
  --shadow-card: 0 20px 48px rgba(17, 30, 60, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "Inter", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(31, 78, 216, 0.12), transparent 30%),
    radial-gradient(circle at bottom right, rgba(23, 183, 163, 0.1), transparent 25%),
    linear-gradient(180deg, #f9fbff 0%, var(--bg) 100%);
  color: var(--text);
  line-height: 1.7;
}

body[data-page="admin"] {
  background:
    radial-gradient(circle at top left, rgba(31, 78, 216, 0.12), transparent 30%),
    radial-gradient(circle at right bottom, rgba(23, 183, 163, 0.08), transparent 25%),
    linear-gradient(180deg, #f9fbff 0%, #eef5ff 100%);
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

button,
input,
select,
textarea {
  font: inherit;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.page-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.24;
  pointer-events: none;
  z-index: 0;
}

.glow-one {
  left: -120px;
  top: -120px;
  background: rgba(31, 78, 216, 0.4);
}

.glow-two {
  right: -80px;
  bottom: 40px;
  background: rgba(23, 183, 163, 0.35);
}

.header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid var(--line);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82px;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), #5ca5ff);
  color: white;
  font-weight: 800;
  box-shadow: 0 14px 28px rgba(31, 78, 216, 0.22);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  color: var(--muted);
  font-weight: 600;
}

.nav-links a {
  transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a:focus-visible {
  color: var(--primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  padding: 14px 24px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), #4f7fff);
  color: #fff;
  box-shadow: 0 16px 26px rgba(31, 78, 216, 0.22);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.85);
  color: var(--primary);
  border: 1px solid rgba(31, 78, 216, 0.1);
}

.hero {
  position: relative;
  z-index: 1;
  padding: 72px 0 38px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  align-items: center;
  gap: 46px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.badge {
  display: inline-block;
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(31, 78, 216, 0.08);
  color: var(--primary);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 900;
}

.hero p {
  margin: 0;
  max-width: 640px;
  color: var(--muted);
  font-size: 1.06rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 4px;
}

.hero-stats {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.hero-stats li {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(16, 33, 59, 0.06);
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: var(--shadow-soft);
}

.hero-stats strong {
  display: block;
  font-size: 1.9rem;
  margin-bottom: 2px;
  line-height: 1.1;
}

.hero-stats span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.hero-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(16, 33, 59, 0.06);
  border-radius: 28px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 60px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(16, 33, 59, 0.06);
  background: rgba(17, 39, 74, 0.03);
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #ffbd2f; }
.dot-green { background: #28c840; }

.card-body {
  padding: 22px;
}

.mini-card {
  background: linear-gradient(135deg, rgba(31, 78, 216, 0.06), rgba(23, 183, 163, 0.06));
  border: 1px solid rgba(31, 78, 216, 0.08);
  border-radius: 22px;
  padding: 18px;
  margin-bottom: 18px;
}

.mini-label {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
}

.mini-card strong {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.mini-card small {
  color: var(--muted);
  font-weight: 600;
}

.info-list {
  display: grid;
  gap: 12px;
}

.info-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 14px;
  background: rgba(248, 250, 255, 0.9);
  border: 1px solid rgba(31, 78, 216, 0.06);
  padding: 12px 14px;
  font-weight: 600;
}

.info-list span:last-child {
  background: rgba(23, 183, 163, 0.1);
  color: var(--secondary);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.features,
.report-section,
.about,
.faq,
.cta {
  padding-top: 72px;
  padding-bottom: 72px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  border-radius: 26px;
  padding: 28px 24px;
  box-shadow: 0 12px 26px rgba(17, 32, 69, 0.03);
}

.icon {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(31, 78, 216, 0.12), rgba(23, 183, 163, 0.08));
  border-radius: 18px;
  font-size: 1.8rem;
  margin-bottom: 18px;
}

.feature-item h3 {
  margin: 0 0 10px;
  font-size: 1.35rem;
}

.feature-item p {
  margin: 0;
  color: var(--muted);
}

.report-header {
  text-align: center;
  margin-bottom: 26px;
}

.report-header h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  letter-spacing: -0.04em;
}

.report-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 26px;
  align-items: start;
}

.report-form,
.report-panel,
.about-card,
.cta-box,
.auth-card,
.filter-group,
.summary-card,
.table-responsive {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--line);
  border-radius: 24px;
}

.report-form {
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.report-form label,
.auth-form label,
.filter-group label {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

.report-form label span,
.auth-form label span,
.filter-group label span {
  font-size: 0.9rem;
}

.report-form input,
.report-form select,
.report-form textarea,
.auth-form input,
.auth-form select,
.filter-group input,
.filter-group select {
  width: 100%;
  border: 1px solid rgba(16, 33, 59, 0.12);
  background: #f8fbff;
  border-radius: 14px;
  padding: 13px 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.report-form input:focus,
.report-form select:focus,
.report-form textarea:focus,
.auth-form input:focus,
.auth-form select:focus,
.filter-group input:focus,
.filter-group select:focus {
  border-color: rgba(31, 78, 216, 0.5);
  box-shadow: 0 0 0 3px rgba(31, 78, 216, 0.08);
}

.report-form textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  margin-top: 18px;
  width: 100%;
}

.report-panel {
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.panel-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 18px;
}

.reports-list {
  display: grid;
  gap: 16px;
}

.empty-state {
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background: rgba(31, 78, 216, 0.04);
  color: var(--muted);
  border: 1px dashed rgba(31, 78, 216, 0.18);
}

.report-item {
  background: rgba(248, 250, 255, 0.9);
  border: 1px solid rgba(16, 33, 59, 0.06);
  border-radius: 18px;
  padding: 16px;
}

.report-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.report-item-top h4 {
  margin: 0;
  font-size: 1rem;
}

.delete-btn {
  border: none;
  background: rgba(239, 68, 68, 0.08);
  color: var(--danger);
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.report-meta span,
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.report-meta span {
  background: rgba(31, 78, 216, 0.08);
  color: var(--primary);
}

.report-item p {
  margin: 0;
  color: var(--muted);
}

.about-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 28px;
  align-items: center;
}

.about-card {
  padding: 28px;
  box-shadow: var(--shadow-card);
}

.about-card h2,
.about-card h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.9rem;
  letter-spacing: -0.04em;
}

.about-card p {
  margin: 0;
  color: var(--muted);
}

.about-points {
  display: grid;
  gap: 18px;
}

.about-points div {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 22px 18px;
  box-shadow: var(--shadow-soft);
}

.about-points strong {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--primary);
  font-size: 1.5rem;
}

.about-points p {
  margin: 0;
  color: var(--muted);
}

.faq-list {
  display: grid;
  gap: 18px;
  max-width: 860px;
  margin: 0 auto;
}

.faq-list details {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 20px 22px;
  box-shadow: 0 8px 20px rgba(17, 32, 69, 0.03);
}

.faq-list summary {
  font-weight: 700;
  cursor: pointer;
}

.faq-list details p {
  margin: 14px 0 0;
  color: var(--muted);
}

.cta-box {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: linear-gradient(135deg, rgba(31, 78, 216, 0.08), rgba(23, 183, 163, 0.08));
  border: 1px solid rgba(31, 78, 216, 0.08);
  box-shadow: var(--shadow-card);
}

.cta-box h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.footer {
  padding: 18px 0 42px;
  text-align: center;
  color: var(--muted);
  font-weight: 600;
}

.footer-inner {
  display: grid;
  gap: 6px;
}

.footer-inner p {
  margin: 0;
}

.auth-shell {
  padding: 72px 0 32px;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
}

.auth-card {
  width: min(540px, calc(100% - 24px));
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  border-radius: 28px;
  box-shadow: var(--shadow-card);
  padding: 28px;
}

.auth-card h2 {
  margin: 8px 0 10px;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}

.auth-card p {
  margin: 0 0 18px;
  color: var(--muted);
}

.auth-form {
  display: grid;
  gap: 18px;
}

.auth-note {
  font-size: 0.9rem;
  color: var(--muted);
}

.auth-error {
  min-height: 24px;
  margin: 0;
  color: var(--danger);
  font-size: 0.9rem;
  font-weight: 700;
}

.full-width {
  width: 100%;
}

.admin-page {
  position: relative;
  z-index: 1;
}

.dashboard-header {
  padding: 48px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  padding: 8px 0 18px;
}

.summary-card {
  padding: 22px 18px;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 8px;
}

.summary-card span {
  color: var(--muted);
  font-weight: 700;
}

.summary-card strong {
  font-size: 2rem;
  line-height: 1;
}

.accent-blue { border-left: 4px solid #3b82f6; }
.accent-green { border-left: 4px solid #22c55e; }
.accent-gold { border-left: 4px solid #f59e0b; }
.accent-red { border-left: 4px solid #ef4444; }

.dashboard-controls {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr;
  gap: 18px;
  padding: 12px 0 18px;
}

.filter-group {
  padding: 16px;
}

.dashboard-table-wrap {
  padding: 10px 0 48px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.table-header h2 {
  margin: 0;
}

.table-responsive {
  overflow-x: auto;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.report-table th,
.report-table td {
  padding: 16px 18px;
  text-align: left;
  border-bottom: 1px solid rgba(16, 33, 59, 0.08);
  vertical-align: top;
}

.report-table th {
  background: rgba(31, 78, 216, 0.04);
  color: var(--text);
  font-weight: 800;
}

.report-table tbody tr:hover {
  background: rgba(31, 78, 216, 0.02);
}

.status-badge {
  white-space: nowrap;
}

.status-baru {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.status-ditinjau {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.status-selesai {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.empty-row {
  text-align: center;
  color: var(--muted);
  padding: 26px 16px;
}

@media (max-width: 980px) {
  .hero-grid,
  .about-grid,
  .feature-grid,
  .dashboard-controls,
  .summary-grid,
  .report-layout,
  .cta-box {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-wrap: wrap;
    padding: 18px 0;
    min-height: auto;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 700px) {
  .hero {
    padding-top: 44px;
  }

  .hero-stats,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    grid-template-columns: 1fr;
    display: grid;
  }

  .btn {
    width: 100%;
  }

  .section {
    padding: 72px 0;
  }

  .report-item-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
