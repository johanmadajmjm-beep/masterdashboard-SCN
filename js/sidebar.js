// sidebar.js — inject sidebar HTML ke semua halaman
function buildSidebar() {
  const ICONS = {
    worker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    coord:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    mel:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    home:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    list:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    act:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    worker2:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    benef:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    ref:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    itt:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    stake:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    story:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    chev:   `<svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`,
  };

  // Deteksi depth path untuk href relatif
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const base  = depth <= 1 ? '.' : '..';

  const html = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-nlr">
          <div class="brand-nlr-badge">NLR</div>
          <div class="brand-nlr-text">
            <div class="t1">Yayasan Netherlands Leprosy Relief</div>
            <div class="t2">NLR Indonesia</div>
          </div>
        </div>
        <div class="brand-app-name">Sistem Informasi MEL</div>
        <div class="brand-app-sub">Monitoring · Evaluasi · Pembelajaran</div>
      </div>

      <div class="sidebar-user">
        <div class="user-av" id="user-av">?</div>
        <div class="user-info">
          <div class="u-name" id="user-name">—</div>
          <div class="u-role" id="user-role">—</div>
        </div>
      </div>

      <div id="scn-switcher-wrap"></div>

      <nav class="sidebar-nav">

        <!-- CBR WORKER -->
        <div class="nav-group">
          <div class="nav-group-header" data-group="worker">
            <div class="nav-group-label">
              <span class="nav-dot" style="background:#1a6fd4"></span>
              ${ICONS.worker} CBR Worker
            </div>
            ${ICONS.chev}
          </div>
          <div class="nav-sub" id="sub-worker">
            <a class="nav-sub-item" data-page="w-beranda" href="${base}/pages/worker-beranda.html">${ICONS.home} Beranda</a>
            <a class="nav-sub-item" data-page="w-anak"    href="${base}/pages/worker-anak.html">${ICONS.list} Daftar Anak</a>
            <a class="nav-sub-item" data-page="w-aktivitas" href="${base}/pages/worker-aktivitas.html">${ICONS.act} Aktivitas</a>
          </div>
        </div>

        <!-- CBR COORDINATOR -->
        <div class="nav-group">
          <div class="nav-group-header" data-group="coord">
            <div class="nav-group-label">
              <span class="nav-dot" style="background:#10b8a6"></span>
              ${ICONS.coord} CBR Coordinator
            </div>
            ${ICONS.chev}
          </div>
          <div class="nav-sub" id="sub-coord">
            <a class="nav-sub-item" data-page="c-beranda"  href="${base}/pages/coord-beranda.html">${ICONS.home} Beranda</a>
            <a class="nav-sub-item" data-page="c-worker"   href="${base}/pages/coord-worker.html">${ICONS.worker2} Per CBR Worker</a>
            <a class="nav-sub-item" data-page="c-benef"    href="${base}/pages/coord-benef.html">${ICONS.benef} Beneficiary</a>
            <a class="nav-sub-item" data-page="c-referral" href="${base}/pages/coord-referral.html">${ICONS.ref} Referral & IRP</a>
          </div>
        </div>

        <!-- MEL -->
        <div class="nav-group">
          <div class="nav-group-header" data-group="mel">
            <div class="nav-group-label">
              <span class="nav-dot" style="background:#d97706"></span>
              ${ICONS.mel} MEL
            </div>
            ${ICONS.chev}
          </div>
          <div class="nav-sub" id="sub-mel">
            <a class="nav-sub-item" data-page="m-beranda" href="${base}/pages/mel-beranda.html">${ICONS.home} Beranda</a>
            <a class="nav-sub-item" data-page="m-itt"     href="${base}/pages/mel-itt.html">${ICONS.itt} ITT Tracker</a>
            <a class="nav-sub-item" data-page="m-stake"   href="${base}/pages/mel-stakeholder.html">${ICONS.stake} Stakeholder</a>
            <a class="nav-sub-item" data-page="m-story"   href="${base}/pages/mel-cerita.html">${ICONS.story} Cerita Perubahan</a>
          </div>
        </div>

      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout" onclick="AUTH.logout()">
          ${ICONS.logout} Keluar
        </button>
      </div>
    </aside>`;

  document.body.insertAdjacentHTML('afterbegin', html);
}
