// ============================================================
//  sidebar.js — NLR Indonesia MEL Platform
//  5 Grup: CBR Worker | Coordinator | MEL | Galeri | Peta
// ============================================================

function buildSidebar() {
  const base = window.location.pathname.includes('/pages/') ? '..' : '.';

  const ICONS = {
    home    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    list    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    obs     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    plan    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    diary   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    eval    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    worker  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20c0-3.3 2.7-6 7-6 1.5 0 2.9.4 4 1"/><path d="M13 15c1-.6 2.5-1 4-1 4.3 0 7 2.7 7 6"/></svg>`,
    benef   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    rtl     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    chart   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    itt     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    stake   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    monthly : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
    story   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    star    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    trend   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    camera  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    map     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>`,
    lock    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    logout  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    chevron : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`,
  };

  const scnId   = AUTH.getScnFilter ? AUTH.getScnFilter() : null;
  const session = AUTH.getSession ? AUTH.getSession() : null;
  const isAdmin = AUTH.isSuperAdmin ? AUTH.isSuperAdmin() : false;

  // SCN Switcher (hanya superadmin)
  const SCN_LIST = [
    { id:'manggarai',  label:'SCN Manggarai' },
    { id:'kupang',     label:'SCN Kupang' },
    { id:'tts',        label:'SCN Timor Tengah Selatan' },
    { id:'banyuwangi', label:'SCN Banyuwangi' },
    { id:'jember',     label:'SCN Jember' },
    { id:'situbondo',  label:'SCN Situbondo' },
    { id:'palu',       label:'SCN Palu' },
    { id:'sigi',       label:'SCN Sigi' },
  ];

  const scnSwitcher = isAdmin ? `
    <div class="sidebar-scn-switcher">
      <div class="switcher-label">SCN Filter</div>
      <select id="scn-switcher-select" class="switcher-select">
        <option value="">Semua SCN</option>
        ${SCN_LIST.map(s => `<option value="${s.id}" ${scnId === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
      </select>
    </div>` : '';

  // Nav groups
  const NAV = `
    <!-- CBR WORKER -->
    <div class="nav-group">
      <div class="nav-group-header" onclick="toggleGroup(this)">
        <span class="nav-group-icon">${ICONS.worker}</span>
        <span class="nav-group-label">CBR Worker</span>
        <span class="nav-group-chevron">${ICONS.chevron}</span>
      </div>
      <div class="nav-group-items">
        <a class="nav-sub-item" data-page="w-beranda"  href="${base}/pages/worker-beranda.html">${ICONS.home} Beranda</a>
        <a class="nav-sub-item" data-page="w-anak"     href="${base}/pages/worker-anak.html">${ICONS.list} Daftar Anak</a>
        <a class="nav-sub-item" data-page="w-obs"      href="${base}/pages/worker-obs.html">${ICONS.obs} Observasi</a>
        <a class="nav-sub-item" data-page="w-plan"     href="${base}/pages/worker-plan.html">${ICONS.plan} Perencanaan</a>
        <a class="nav-sub-item" data-page="w-diary"    href="${base}/pages/worker-diary.html">${ICONS.diary} Buku Harian</a>
        <a class="nav-sub-item" data-page="w-eval"     href="${base}/pages/worker-eval.html">${ICONS.eval} Evaluasi Akhir</a>
        <a class="nav-sub-item" data-page="w-activity" href="${base}/pages/worker-aktivitas.html">${ICONS.activity} Aktivitas</a>
      </div>
    </div>

    <!-- CBR COORDINATOR -->
    <div class="nav-group">
      <div class="nav-group-header" onclick="toggleGroup(this)">
        <span class="nav-group-icon">${ICONS.benef}</span>
        <span class="nav-group-label">CBR Coordinator</span>
        <span class="nav-group-chevron">${ICONS.chevron}</span>
      </div>
      <div class="nav-group-items">
        <a class="nav-sub-item" data-page="c-beranda" href="${base}/pages/coord-beranda.html">${ICONS.home} Beranda</a>
        <a class="nav-sub-item" data-page="c-worker"  href="${base}/pages/coord-worker.html">${ICONS.worker} Per CBR Worker</a>
        <a class="nav-sub-item" data-page="c-benef"   href="${base}/pages/coord-benef.html">${ICONS.benef} Beneficiary</a>
        <a class="nav-sub-item" data-page="c-rtl"     href="${base}/pages/coord-rtl.html">${ICONS.rtl} RTL</a>
      </div>
    </div>

    <!-- MEL -->
    <div class="nav-group">
      <div class="nav-group-header" onclick="toggleGroup(this)">
        <span class="nav-group-icon">${ICONS.chart}</span>
        <span class="nav-group-label">MEL</span>
        <span class="nav-group-chevron">${ICONS.chevron}</span>
      </div>
      <div class="nav-group-items">
        <a class="nav-sub-item" data-page="m-beranda" href="${base}/pages/mel-beranda.html">${ICONS.home} Beranda</a>
        <a class="nav-sub-item" data-page="m-itt"     href="${base}/pages/mel-itt.html">${ICONS.itt} ITT</a>
        <a class="nav-sub-item" data-page="m-stake"   href="${base}/pages/mel-stakeholder.html">${ICONS.stake} Data Stakeholder</a>
        <a class="nav-sub-item" data-page="m-monthly" href="${base}/pages/mel-monthly.html">${ICONS.monthly} Monthly Monitoring</a>
        <a class="nav-sub-item" data-page="m-story"   href="${base}/pages/mel-cerita.html">${ICONS.story} Cerita Perubahan</a>
        <a class="nav-sub-item" data-page="m-sukses"  href="${base}/pages/mel-sukses.html">${ICONS.star} Cerita Sukses</a>
        ${isAdmin ? `<a class="nav-sub-item" data-page="m-analisis" href="${base}/pages/mel-analisis.html">${ICONS.trend} Analisis & Trend</a>` : ''}
      </div>
    </div>

    <!-- GALERI -->
    <div class="nav-group">
      <div class="nav-group-header" onclick="toggleGroup(this)">
        <span class="nav-group-icon">${ICONS.camera}</span>
        <span class="nav-group-label">Galeri Foto</span>
        <span class="nav-group-chevron">${ICONS.chevron}</span>
      </div>
      <div class="nav-group-items">
        <a class="nav-sub-item" data-page="g-galeri" href="${base}/pages/mel-galeri.html">${ICONS.camera} Semua Foto</a>
      </div>
    </div>

    <!-- PETA -->
    <div class="nav-group">
      <div class="nav-group-header" onclick="toggleGroup(this)">
        <span class="nav-group-icon">${ICONS.map}</span>
        <span class="nav-group-label">Peta</span>
        <span class="nav-group-chevron">${ICONS.chevron}</span>
      </div>
      <div class="nav-group-items">
        <a class="nav-sub-item" data-page="p-peta" href="${base}/pages/peta.html">${ICONS.map} Sebaran Beneficiary</a>
      </div>
    </div>`;

  const userName = session ? (session.label || session.username || '—') : '—';
  const userRole = session ? (session.role || '—') : '—';

  const html = `
<aside class="sidebar" id="sidebar">
  <!-- Header -->
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <div class="sidebar-logo-badge">NLR</div>
      <div class="sidebar-logo-text">
        <div class="sidebar-logo-name">NLR Indonesia</div>
        <div class="sidebar-logo-sub">Sistem Informasi MEL</div>
      </div>
    </div>
    <button class="sidebar-toggle" id="sidebar-toggle" onclick="toggleSidebar()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </div>

  <!-- User info -->
  <div class="sidebar-user">
    <div class="sidebar-user-avatar">${userName.charAt(0).toUpperCase()}</div>
    <div class="sidebar-user-info">
      <div class="sidebar-user-name">${userName}</div>
      <div class="sidebar-user-role">${userRole}</div>
    </div>
  </div>

  <!-- SCN Switcher (superadmin only) -->
  ${scnSwitcher}

  <!-- Nav -->
  <nav class="sidebar-nav">
    ${NAV}
  </nav>

  <!-- Footer -->
  <div class="sidebar-footer">
    <button class="sidebar-logout" onclick="AUTH.logout('${base}/index.html')">
      ${ICONS.logout} <span>Keluar</span>
    </button>
  </div>
</aside>

<!-- Mobile overlay -->
<div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>

<!-- Topbar mobile trigger -->
<button class="topbar-menu-btn" id="topbar-menu-btn" onclick="openSidebar()">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
</button>`;

  // Inject sidebar
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);
  // Inject overlay + mobile btn
  wrapper.childNodes.forEach(n => { if (n.nodeType === 1) document.body.insertBefore(n, document.body.firstChild); });

  // Inject styles
  injectSidebarStyles();

  // Auto-set active page
  setTimeout(() => {
    const currentPage = document.querySelector('.nav-sub-item[data-page]');
    if (currentPage) {
      // akan di-set dari initSidebar
    }
  }, 0);

  // SCN switcher event
  const sel = document.getElementById('scn-switcher-select');
  if (sel) {
    sel.addEventListener('change', function() {
      const scn = this.value || null;
      if (AUTH.setScnFilter) AUTH.setScnFilter(scn);
      const badge = document.getElementById('scn-badge');
      if (badge) badge.textContent = scn ? ('SCN ' + scn.charAt(0).toUpperCase() + scn.slice(1)) : 'Semua SCN';
      // Clear cache agar data fresh saat SCN diganti
      if (window.API && API.clearCache) API.clearCache(scn);
      // Trigger onScnSwitch dari halaman aktif
      if (window.__onScnSwitch) window.__onScnSwitch(scn);
    });
  }
}

// ── TOGGLE GROUP ────────────────────────────────────────────
function toggleGroup(header) {
  const group = header.parentElement;
  group.classList.toggle('collapsed');
}

// ── SIDEBAR OPEN/CLOSE (mobile) ────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed');
}
function openSidebar() {
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('sidebar-overlay').classList.add('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// ── INIT SIDEBAR — set active page & buka group ───────────
function initSidebar(group, pageId, scnLabel) {
  // Set active nav item
  document.querySelectorAll('.nav-sub-item').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  // Semua grup default terbuka — tidak perlu tambah class apapun

  // Set topbar
  const topbarDate = document.getElementById('topbar-date');
  if (topbarDate) {
    const now = new Date();
    topbarDate.textContent = now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }

  const scnBadge = document.getElementById('scn-badge');
  if (scnBadge) {
    const scn = AUTH.getScnFilter ? AUTH.getScnFilter() : null;
    const label = scnLabel || (scn ? ('SCN ' + scn.charAt(0).toUpperCase() + scn.slice(1)) : (AUTH.isSuperAdmin && AUTH.isSuperAdmin() ? 'Semua SCN' : '—'));
    scnBadge.textContent = label;
  }
}

// ── INJECT CSS ──────────────────────────────────────────────
function injectSidebarStyles() {
  if (document.getElementById('sidebar-components-css')) return;
  const base = window.location.pathname.includes('/pages/') ? '..' : '.';
  const link = document.createElement('link');
  link.id   = 'sidebar-components-css';
  link.rel  = 'stylesheet';
  link.href = base + '/css/components.css';
  document.head.appendChild(link);
}

// ── AUTH INTEGRATION ──────────────────────────────────────
// Wrap AUTH.applySession agar onScnSwitch tersimpan ke window
// sehingga SCN switcher di sidebar bisa memanggilnya
if (window.AUTH && AUTH.applySession) {
  const _origApply = AUTH.applySession.bind(AUTH);
  AUTH.applySession = function(opts) {
    if (opts && typeof opts.onScnSwitch === 'function') {
      window.__onScnSwitch = opts.onScnSwitch;
    }
    if (_origApply) _origApply(opts);
  };
}
