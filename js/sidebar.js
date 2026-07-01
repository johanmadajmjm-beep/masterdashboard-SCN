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
        <a class="nav-sub-item" data-page="w-anak"     href="${base}/pages/worker-anak.html">${ICONS.list} Profil Anak</a>
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
        <a class="nav-sub-item" data-page="c-worker"  href="${base}/pages/coord-worker.html">${ICONS.worker} Profil Worker</a>
        <a class="nav-sub-item" data-page="c-benef"   href="${base}/pages/coord-benef.html">${ICONS.benef} Beneficiary</a>
        <a class="nav-sub-item" data-page="c-rtl"     href="${base}/pages/coord-rtl.html">${ICONS.rtl} RTL</a>
        <a class="nav-sub-item" data-page="c-pihak"  href="${base}/pages/coord-pihak.html">${ICONS.stake} Pihak Terlibat</a>
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
    <div class="nav-direct">
      <a class="nav-direct-item" data-page="g-galeri" href="${base}/pages/mel-galeri.html">
        <span class="nav-group-icon">${ICONS.camera}</span>
        <span class="nav-direct-label">Galeri Foto</span>
      </a>
    </div>

    <!-- PETA -->
    <div class="nav-direct">
      <a class="nav-direct-item" data-page="p-peta" href="${base}/pages/peta.html">
        <span class="nav-group-icon">${ICONS.map}</span>
        <span class="nav-direct-label">Peta</span>
      </a>
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
    <button class="sidebar-logout" onclick="confirmLogout('${base}')">
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
      // Trigger onScnSwitch dari halaman aktif (langsung, tanpa perlu refresh)
      if (typeof window.__onScnSwitch === 'function') {
        window.__onScnSwitch(scn);
      } else {
        // Fallback: reload jika halaman belum registrasi onScnSwitch
        location.reload();
      }
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
  // Simpan pageId untuk dipakai bottom nav
  window.__currentPageId = pageId;

  // Build + inject bottom nav (mobile only)
  buildBottomNav();
  setBottomNavActive(pageId);

  // Set active nav item (termasuk nav-direct-item)
  document.querySelectorAll('.nav-sub-item, .nav-direct-item').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  // Bug 1 Fix: Default semua grup collapsed, buka hanya grup yang berisi halaman aktif
  document.querySelectorAll('.nav-group').forEach(g => {
    const hasActive = g.querySelector('.nav-sub-item.active');
    if (hasActive) {
      g.classList.remove('collapsed');
    } else {
      g.classList.add('collapsed');
    }
  });

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

  // Bug 3 Fix: Preload data di background agar cache terisi sebelum user navigasi
  _preloadData();
}

// ── PRELOAD DATA (background fetch untuk isi cache) ────────
function _preloadData() {
  if (!window.API || !window.AUTH) return;
  const scnId = AUTH.getScnFilter ? AUTH.getScnFilter() : null;
  // Fetch di background — tidak block UI, hasil masuk cache otomatis
  setTimeout(() => {
    API.get(scnId).catch(() => {});
  }, 500); // delay 500ms agar UI render dulu
}

// ── INJECT CSS ──────────────────────────────────────────────
// components.css sudah dimuat via <link> di setiap halaman.
// Fungsi ini dipertahankan untuk kompatibilitas pemanggilan.
function injectSidebarStyles() {
  // no-op: CSS dimuat langsung dari <link rel="stylesheet"> di <head>
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

// ============================================================
//  MOBILE BOTTOM NAV — injected hanya di viewport < 768px
//  Dipanggil otomatis dari initSidebar()
// ============================================================

function buildBottomNav() {
  // Cek apakah mobile
  if (window.innerWidth >= 768) return;

  const base     = window.location.pathname.includes('/pages/') ? '..' : '.';
  const session  = AUTH.getSession  ? AUTH.getSession()   : null;
  const isAdmin  = AUTH.isSuperAdmin ? AUTH.isSuperAdmin() : false;
  const scnId    = AUTH.getScnFilter ? AUTH.getScnFilter() : null;

  const ICONS = {
    home    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    list    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    obs     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    plan    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    diary   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    eval    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    worker  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20c0-3.3 2.7-6 7-6 1.5 0 2.9.4 4 1"/><path d="M13 15c1-.6 2.5-1 4-1 4.3 0 7 2.7 7 6"/></svg>`,
    benef   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chart   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    camera  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    map     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>`,
    more    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
    scn     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg>`,
    logout  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    itt     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    stake   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    monthly : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    story   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    star    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    trend   : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    rtl     : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  };

  // Define 5 tab groups untuk bottom nav
  const GROUPS = [
    {
      id    : 'worker',
      label : 'Worker',
      icon  : ICONS.worker,
      pages : ['w-beranda','w-anak','w-obs','w-plan','w-diary','w-eval','w-activity'],
      items : [
        { page:'w-beranda',  label:'Beranda',     icon:ICONS.home,     href:`${base}/pages/worker-beranda.html` },
        { page:'w-anak',     label:'Profil Anak', icon:ICONS.list,     href:`${base}/pages/worker-anak.html` },
        { page:'w-obs',      label:'Observasi',   icon:ICONS.obs,      href:`${base}/pages/worker-obs.html` },
        { page:'w-plan',     label:'Perencanaan', icon:ICONS.plan,     href:`${base}/pages/worker-plan.html` },
        { page:'w-diary',    label:'Buku Harian', icon:ICONS.diary,    href:`${base}/pages/worker-diary.html` },
        { page:'w-eval',     label:'Evaluasi',    icon:ICONS.eval,     href:`${base}/pages/worker-eval.html` },
        { page:'w-activity', label:'Aktivitas',   icon:ICONS.activity, href:`${base}/pages/worker-aktivitas.html` },
      ],
    },
    {
      id    : 'coord',
      label : 'Koordinator',
      icon  : ICONS.benef,
      pages : ['c-beranda','c-worker','c-benef','c-rtl','c-pihak'],
      items : [
        { page:'c-beranda', label:'Beranda',    icon:ICONS.home,  href:`${base}/pages/coord-beranda.html` },
        { page:'c-worker',  label:'Worker',     icon:ICONS.worker,href:`${base}/pages/coord-worker.html` },
        { page:'c-benef',   label:'Beneficiary',icon:ICONS.benef, href:`${base}/pages/coord-benef.html` },
        { page:'c-rtl',     label:'RTL',        icon:ICONS.rtl,   href:`${base}/pages/coord-rtl.html` },
        { page:'c-pihak',   label:'Pihak',      icon:ICONS.stake, href:`${base}/pages/coord-pihak.html` },
      ],
    },
    {
      id    : 'mel',
      label : 'MEL',
      icon  : ICONS.chart,
      pages : ['m-beranda','m-itt','m-stake','m-monthly','m-story','m-sukses','m-analisis'],
      items : [
        { page:'m-beranda', label:'Beranda',     icon:ICONS.home,    href:`${base}/pages/mel-beranda.html` },
        { page:'m-itt',     label:'ITT',         icon:ICONS.itt,     href:`${base}/pages/mel-itt.html` },
        { page:'m-stake',   label:'Stakeholder', icon:ICONS.stake,   href:`${base}/pages/mel-stakeholder.html` },
        { page:'m-monthly', label:'Monthly',     icon:ICONS.monthly, href:`${base}/pages/mel-monthly.html` },
        { page:'m-story',   label:'Cerita',      icon:ICONS.story,   href:`${base}/pages/mel-cerita.html` },
        { page:'m-sukses',  label:'Sukses',      icon:ICONS.star,    href:`${base}/pages/mel-sukses.html` },
        ...(isAdmin ? [{ page:'m-analisis', label:'Analisis', icon:ICONS.trend, href:`${base}/pages/mel-analisis.html` }] : []),
      ],
    },
    {
      id    : 'galeri',
      label : 'Galeri',
      icon  : ICONS.camera,
      pages : ['g-galeri'],
      direct: true,
      href  : `${base}/pages/mel-galeri.html`,
    },
    {
      id    : 'peta',
      label : 'Peta',
      icon  : ICONS.map,
      pages : ['p-peta'],
      direct: true,
      href  : `${base}/pages/peta.html`,
    },

  ];

  // SCN list
  const SCN_LIST = [
    { id:'',           label:'Semua SCN' },
    { id:'manggarai',  label:'Manggarai' },
    { id:'kupang',     label:'Kupang' },
    { id:'tts',        label:'TTS' },
    { id:'banyuwangi', label:'Banyuwangi' },
    { id:'jember',     label:'Jember' },
    { id:'situbondo',  label:'Situbondo' },
    { id:'palu',       label:'Palu' },
    { id:'sigi',       label:'Sigi' },
  ];

  // ── Build HTML ──────────────────────────────────────────

  // SCN Sheet (admin only)
  const scnSheetHtml = isAdmin ? `
  <div class="scn-sheet" id="scn-sheet">
    <div class="scn-sheet-header">
      <span class="scn-sheet-title">Pilih SCN</span>
      <button class="scn-sheet-close" onclick="closeSCNSheet()">✕</button>
    </div>
    ${SCN_LIST.map(s => `
    <div class="scn-sheet-option ${scnId === s.id || (!scnId && !s.id) ? 'active' : ''}"
         onclick="selectSCNMobile('${s.id}','${s.label}')">
      <span class="dot"></span>${s.label}
    </div>`).join('')}
  </div>
  <div class="bottom-subnav-overlay" id="scn-overlay" onclick="closeSCNSheet()"></div>` : '';

  // Sub-nav panel (1 panel, kontennya diganti saat tab diklik)
  const subNavHtml = `
  <div class="bottom-subnav" id="bottom-subnav">
    <div class="bottom-subnav-header">
      <span class="bottom-subnav-title" id="subnav-title">Menu</span>
      <button class="bottom-subnav-close" onclick="closeSubNav()">✕</button>
    </div>
    <div class="bottom-subnav-items" id="subnav-items"></div>
  </div>
  <div class="bottom-subnav-overlay" id="subnav-overlay" onclick="closeSubNav()"></div>`;

  // Bottom nav tabs
  const logoutIcon = ICONS.logout;
  const logoutBase = base;
  const tabsHtml = GROUPS.map(g => g.direct
    ? `<button class="bottom-nav-tab" data-group="${g.id}" onclick="window.location.href='${g.href}'">
        ${g.icon}
        <span>${g.label}</span>
      </button>`
    : `<button class="bottom-nav-tab" data-group="${g.id}" onclick="openSubNav('${g.id}')">
        ${g.icon}
        <span>${g.label}</span>
      </button>`
  ).join('') + `
    <button class="bottom-nav-tab bottom-nav-logout" onclick="confirmLogout('${logoutBase}')">
      ${logoutIcon}
      <span>Keluar</span>
    </button>`;

  const bottomNavHtml = `
  <nav class="bottom-nav" id="bottom-nav">
    <div class="bottom-nav-items">${tabsHtml}</div>
  </nav>`;

  // Mobile SCN button (inject ke topbar-right)
  const scnLabel = scnId ? ('SCN ' + scnId.charAt(0).toUpperCase() + scnId.slice(1)) : 'Semua SCN';
  const mobileSCNBtn = isAdmin ? `
  <button class="mobile-scn-btn" id="mobile-scn-btn" onclick="openSCNSheet()">
    ${ICONS.scn} <span id="mobile-scn-label">${scnLabel}</span>
  </button>` : '';

  // ── Inject ke DOM ───────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', scnSheetHtml + subNavHtml + bottomNavHtml);

  // Inject mobile SCN btn ke topbar-right
  const topbarRight = document.querySelector('.topbar-right');
  if (topbarRight && isAdmin) {
    topbarRight.insertAdjacentHTML('afterbegin', mobileSCNBtn);
  }

  // Store groups di window untuk akses fungsi lain
  window.__bottomNavGroups = GROUPS;
}

// ── Set active state bottom nav dari initSidebar ──────────
function setBottomNavActive(pageId) {
  if (window.innerWidth >= 768) return;
  const groups = window.__bottomNavGroups || [];

  // Reset semua tab
  document.querySelectorAll('.bottom-nav-tab').forEach(t => t.classList.remove('active'));

  // Set active tab berdasarkan pageId
  groups.forEach(g => {
    if (g.pages.includes(pageId)) {
      const tab = document.querySelector(`.bottom-nav-tab[data-group="${g.id}"]`);
      if (tab) tab.classList.add('active');
    }
  });
}

// ── Open sub nav panel ───────────────────────────────────
function openSubNav(groupId) {
  const groups  = window.__bottomNavGroups || [];
  const group   = groups.find(g => g.id === groupId);
  const panel   = document.getElementById('bottom-subnav');
  const overlay = document.getElementById('subnav-overlay');
  const title   = document.getElementById('subnav-title');
  const items   = document.getElementById('subnav-items');

  if (!group || !panel) return;

  // "Lainnya" tab: tampilkan info akun + logout
  if (groupId === 'more') {
    const session = AUTH.getSession ? AUTH.getSession() : null;
    const base    = window.location.pathname.includes('/pages/') ? '..' : '.';
    const uname   = session ? (session.label || session.username || '—') : '—';
    const urole   = session ? (session.role || '—') : '—';
    title.textContent = 'Lainnya';
    items.innerHTML = `
      <div style="padding:14px 24px 10px; border-bottom:1px solid rgba(255,255,255,.06); margin-bottom:8px;">
        <div style="font-size:.82rem; font-weight:600; color:rgba(255,255,255,.85);">${uname}</div>
        <div style="font-size:.68rem; color:rgba(255,255,255,.35); margin-top:2px;">${urole}</div>
      </div>
      <div class="bottom-subnav-item" onclick="AUTH.logout('${base}/index.html')" style="color:#f87171;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Keluar
      </div>`;
    panel.classList.add('show');
    overlay.classList.add('show');
    document.querySelectorAll('.bottom-nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.bottom-nav-tab[data-group="more"]`).classList.add('active');
    return;
  }

  // Cek current page
  const currentPage = window.__currentPageId || '';
  title.textContent = group.label;
  items.innerHTML   = group.items.map(item => `
    <a class="bottom-subnav-item ${item.page === currentPage ? 'active' : ''}"
       href="${item.href}" data-page="${item.page}">
      ${item.icon} ${item.label}
    </a>`).join('');

  panel.classList.add('show');
  overlay.classList.add('show');

  // Set active tab
  document.querySelectorAll('.bottom-nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.bottom-nav-tab[data-group="${groupId}"]`).classList.add('active');
}

function closeSubNav() {
  const panel   = document.getElementById('bottom-subnav');
  const overlay = document.getElementById('subnav-overlay');
  if (panel)   panel.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
}

// ── SCN Sheet (mobile admin) ─────────────────────────────
function openSCNSheet() {
  closeSubNav();
  const sheet   = document.getElementById('scn-sheet');
  const overlay = document.getElementById('scn-overlay');
  if (sheet)   sheet.classList.add('show');
  if (overlay) overlay.classList.add('show');
}
function closeSCNSheet() {
  const sheet   = document.getElementById('scn-sheet');
  const overlay = document.getElementById('scn-overlay');
  if (sheet)   sheet.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
}
function selectSCNMobile(scnId, scnLabel) {
  if (AUTH.setScnFilter) AUTH.setScnFilter(scnId || null);

  // Update label
  const btn = document.getElementById('mobile-scn-label');
  if (btn) btn.textContent = scnLabel;

  // Update active state di sheet
  document.querySelectorAll('.scn-sheet-option').forEach(o => o.classList.remove('active'));
  const target = Array.from(document.querySelectorAll('.scn-sheet-option'))
    .find(o => o.textContent.trim() === scnLabel);
  if (target) target.classList.add('active');

  closeSCNSheet();

  // Clear cache dan trigger
  if (window.API && API.clearCache) API.clearCache(scnId || null);
  if (typeof window.__onScnSwitch === 'function') {
    window.__onScnSwitch(scnId || null);
  } else {
    location.reload();
  }
}

// ── LOGOUT DENGAN KONFIRMASI ─────────────────────────────
function confirmLogout(base) {
  const sheet = document.createElement('div');
  sheet.id = 'logout-confirm-sheet';
  sheet.innerHTML = `
    <div style="
      position:fixed; inset:0; z-index:999;
      background:rgba(0,0,0,.5); backdrop-filter:blur(4px);
      display:flex; align-items:center; justify-content:center;
    " onclick="this.remove()">
      <div onclick="event.stopPropagation()" style="
        width:100%; max-width:360px; background:#1F2937;
        border-radius:16px; padding:28px 24px;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
        margin:0 16px;
      ">
        <div style="
          width:48px; height:48px; border-radius:50%;
          background:rgba(239,68,68,.15);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 16px;
        ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <div style="font-size:1rem; font-weight:700; color:white; text-align:center; margin-bottom:8px;">Keluar dari aplikasi?</div>
        <div style="font-size:.78rem; color:rgba(255,255,255,.45); text-align:center; margin-bottom:24px; line-height:1.5;">Kamu harus login kembali untuk mengakses dashboard.</div>
        <button onclick="AUTH.logout('${base}/index.html')" style="
          width:100%; padding:12px; border-radius:10px;
          background:#EF4444; border:none; color:white;
          font-size:.88rem; font-weight:700; cursor:pointer;
          font-family:var(--font); margin-bottom:8px;
        ">Ya, Keluar</button>
        <button onclick="document.getElementById('logout-confirm-sheet').remove()" style="
          width:100%; padding:12px; border-radius:10px;
          background:rgba(255,255,255,.08); border:none; color:rgba(255,255,255,.7);
          font-size:.88rem; font-weight:600; cursor:pointer;
          font-family:var(--font);
        ">Batal</button>
      </div>
    </div>`;
  document.body.appendChild(sheet);
}

// ── PAGE TRANSITION ──────────────────────────────────────────
// Intercept semua klik nav-sub-item dan tambahkan fade out
// sebelum browser pindah halaman.
// Browser yang sudah dukung native View Transition (lihat @view-transition
// di components.css) akan melewati fade manual ini sepenuhnya — supaya
// tidak dobel animasi dan flash putih ditangani native oleh browser.
(function() {
  const supportsViewTransition = 'startViewTransition' in document;

  // Tangkap AbortError yang sengaja dilempar browser saat transisi
  // dilewati (mis. user klik link lain sebelum transisi selesai).
  // Listener 'pagereveal' didaftarkan lebih awal lewat inline <script>
  // di <head> tiap halaman (supaya tidak telat dari event-nya);
  // 'pageswap' aman didaftarkan di sini karena baru terjadi saat user
  // klik link, jauh setelah sidebar.js selesai dimuat.
  if (supportsViewTransition) {
    window.addEventListener('pageswap', (e) => {
      if (e.viewTransition) e.viewTransition.ready.catch(() => {});
    });
  }

  function initPageTransition() {
    if (supportsViewTransition) {
      // Native transition yang urus animasi; cukup pastikan background benar.
      document.body.style.background = '#F8FAFC';
    } else {
      // Fade in saat halaman baru dimuat (fallback browser lama)
      // Catatan: JANGAN pakai transform di body — transform pada body akan
      // membuat body jadi containing block baru untuk semua elemen
      // position:fixed di dalamnya (termasuk .bottom-nav), sehingga bottom-nav
      // nempel ke bawah KONTEN (bisa di luar layar) alih-alih ke bawah VIEWPORT.
      // Ini bug nyata di HP yang browsernya belum dukung View Transition API.
      document.body.style.background = '#F8FAFC';
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .25s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.style.opacity = '1';
        });
      });
    }

    // Intercept klik semua link navigasi
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a.nav-sub-item, a.bottom-subnav-item');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript')) return;

      if (supportsViewTransition) {
        // Jangan preventDefault — biarkan ini jadi navigasi link asli
        // supaya browser memicu native cross-document view transition.
        return;
      }

      e.preventDefault();

      // Fade out lalu navigasi (fallback browser lama) — tanpa transform,
      // lihat catatan di initPageTransition() soal kenapa transform di body
      // berbahaya untuk elemen position:fixed seperti .bottom-nav.
      document.body.style.background = '#F8FAFC';
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .18s ease';

      setTimeout(() => {
        window.location.href = href;
      }, 180);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransition);
  } else {
    initPageTransition();
  }
})();
