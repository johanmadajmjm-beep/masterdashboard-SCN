// auth.js — Platform MEL NLR Indonesia v2
const AUTH = (() => {
  const USERS = [
    { username:'admin',     password:'admin123',     role:'superadmin', scn_id:null,        scn_label:'Semua SCN'       },
    { username:'manggarai', password:'manggarai123', role:'scn',        scn_id:'manggarai', scn_label:'SCN Manggarai'   },
    { username:'flotim',    password:'flotim123',    role:'scn',        scn_id:'flotim',    scn_label:'SCN Flores Timur'},
    { username:'sikka',     password:'sikka123',     role:'scn',        scn_id:'sikka',     scn_label:'SCN Sikka'       },
  ];
  const SCN_LIST = [
    { id:'manggarai', label:'SCN Manggarai'    },
    { id:'flotim',    label:'SCN Flores Timur' },
    { id:'sikka',     label:'SCN Sikka'        },
  ];
  const KEY        = 'mel_v2_session';
  const SCN_KEY    = 'mel_v2_active_scn'; // persisten lintas halaman

  // ── LOGIN ──
  function login(username, password) {
    const u = USERS.find(u => u.username === username.trim().toLowerCase() && u.password === password);
    if (!u) return { ok: false, message: 'Username atau password salah.' };
    const s = { username: u.username, role: u.role, scn_id: u.scn_id, scn_label: u.scn_label, loggedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(s));
    // Reset pilihan SCN saat login baru
    localStorage.removeItem(SCN_KEY);
    return { ok: true, session: s };
  }

  // ── LOGOUT ──
  function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SCN_KEY);
    window.location.href = '../index.html';
  }

  // ── GET SESSION ──
  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s) return null;
      if (Date.now() - s.loggedAt > 8 * 3600 * 1000) { logout(); return null; }
      return s;
    } catch { return null; }
  }

  // ── REQUIRE AUTH ──
  function requireAuth(redirectTo = '../index.html') {
    const s = getSession();
    if (!s) { window.location.href = redirectTo; return null; }
    return s;
  }

  function isSuperAdmin() { const s = getSession(); return s && s.role === 'superadmin'; }

  // ── GET SCN FILTER ──
  // Untuk SCN user → selalu scn_id dari session
  // Untuk superadmin → ambil dari localStorage (persisten lintas halaman)
  function getScnFilter() {
    const s = getSession();
    if (!s) return null;
    if (s.role !== 'superadmin') return s.scn_id;
    const saved = localStorage.getItem(SCN_KEY);
    return saved || null; // null = Semua SCN
  }

  // ── SIMPAN PILIHAN SCN (superadmin) ──
  function setScnFilter(scnId) {
    if (scnId) {
      localStorage.setItem(SCN_KEY, scnId);
    } else {
      localStorage.removeItem(SCN_KEY);
    }
  }

  // ── UPDATE BADGE TOPBAR ──
  function updateScnBadge(scnId) {
    const badge = document.getElementById('scn-badge');
    if (!badge) return;
    if (!scnId) {
      badge.textContent = 'Semua SCN';
    } else {
      const found = SCN_LIST.find(x => x.id === scnId);
      badge.textContent = found ? found.label : scnId;
    }
  }

  // ── APPLY SESSION KE UI ──
  function applySession(opts = {}) {
    const s = getSession();
    if (!s) return;
    const q = sel => document.querySelector(sel);

    if (q('#user-av'))     q('#user-av').textContent    = s.username.charAt(0).toUpperCase();
    if (q('#user-name'))   q('#user-name').textContent  = s.username.toUpperCase();
    if (q('#user-role'))   q('#user-role').textContent  = s.role === 'superadmin' ? 'Super Admin' : 'SCN Admin';
    if (q('#topbar-date')) q('#topbar-date').textContent = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // Badge awal — pakai nilai yang sudah tersimpan
    const currentScn = getScnFilter();
    updateScnBadge(currentScn);

    // SCN Switcher — hanya untuk superadmin
    const wrap = q('#scn-switcher-wrap');
    if (wrap && s.role === 'superadmin') {
      const sel = document.createElement('select');
      sel.className = 'scn-switcher';
      sel.innerHTML = `<option value="">— Semua SCN —</option>` +
        SCN_LIST.map(x => `<option value="${x.id}">${x.label}</option>`).join('');

      // Restore pilihan sebelumnya
      sel.value = currentScn || '';

      sel.addEventListener('change', () => {
        const scnId = sel.value || null;
        setScnFilter(scnId);        // simpan ke localStorage
        updateScnBadge(scnId);      // update badge topbar
        if (opts.onScnSwitch) opts.onScnSwitch(scnId);
      });

      wrap.appendChild(sel);
    }
  }

  // ── INIT SIDEBAR COLLAPSIBLE ──
  function initSidebar(activeGroup, activePage) {
    document.querySelectorAll('.nav-group-header').forEach(h => {
      const groupId = h.dataset.group;
      const sub     = document.getElementById('sub-' + groupId);
      if (!sub) return;
      if (groupId === activeGroup) { h.classList.add('open'); sub.classList.add('open'); }
      h.addEventListener('click', () => {
        const isOpen = h.classList.contains('open');
        document.querySelectorAll('.nav-group-header').forEach(x => x.classList.remove('open'));
        document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('open'));
        if (!isOpen) { h.classList.add('open'); sub.classList.add('open'); }
      });
    });
    if (activePage) {
      document.querySelectorAll('.nav-sub-item').forEach(item => {
        if (item.dataset.page === activePage) item.classList.add('active');
      });
    }
  }

  return {
    login, logout, getSession, requireAuth,
    isSuperAdmin, getScnFilter, setScnFilter,
    applySession, updateScnBadge, initSidebar,
    SCN_LIST
  };
})();
