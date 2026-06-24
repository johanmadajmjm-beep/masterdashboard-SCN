// ============================================================
//  auth.js — Platform MEL SCN NTT
//  Logika login, session management, dan filter SCN
// ============================================================

const AUTH = (() => {

  // ----------------------------------------------------------
  // USER DATABASE (sementara hardcoded, nanti pindah ke GSheet)
  // Format: { username, passwordHash, role, scn_id, scn_label }
  // role: 'superadmin' | 'scn'
  // ----------------------------------------------------------
  const USERS = [
    {
      username   : 'admin',
      password   : 'admin123',          // ganti setelah email org siap
      role       : 'superadmin',
      scn_id     : null,                // null = akses semua SCN
      scn_label  : 'Semua SCN'
    },
    {
      username   : 'manggarai',
      password   : 'manggarai123',
      role       : 'scn',
      scn_id     : 'manggarai',
      scn_label  : 'SCN Manggarai'
    },
    // Tambahkan SCN lain di sini ketika siap:
    // { username: 'flores_timur', password: 'xxx', role: 'scn', scn_id: 'flores_timur', scn_label: 'SCN Flores Timur' },
  ];

  const SESSION_KEY = 'mel_session';

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  function login(username, password) {
    const user = USERS.find(
      u => u.username === username.trim().toLowerCase()
        && u.password  === password
    );

    if (!user) return { ok: false, message: 'Username atau password salah.' };

    const session = {
      username  : user.username,
      role      : user.role,
      scn_id    : user.scn_id,
      scn_label : user.scn_label,
      loggedAt  : Date.now()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  }

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  // ----------------------------------------------------------
  // GET SESSION — return null kalau belum login
  // ----------------------------------------------------------
  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      // Session expired setelah 8 jam
      if (Date.now() - session.loggedAt > 8 * 60 * 60 * 1000) {
        logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  // ----------------------------------------------------------
  // REQUIRE AUTH — panggil di atas setiap dashboard
  // Kalau belum login → redirect ke index.html
  // ----------------------------------------------------------
  function requireAuth() {
    const session = getSession();
    if (!session) {
      window.location.href = 'index.html';
      return null;
    }
    return session;
  }

  // ----------------------------------------------------------
  // IS SUPER ADMIN
  // ----------------------------------------------------------
  function isSuperAdmin() {
    const s = getSession();
    return s && s.role === 'superadmin';
  }

  // ----------------------------------------------------------
  // GET SCN FILTER
  // Kembalikan scn_id untuk dipakai filter data.
  // null = superadmin (lihat semua), string = filter ke SCN itu
  // ----------------------------------------------------------
  function getScnFilter() {
    const s = getSession();
    if (!s) return null;
    return s.scn_id; // null untuk superadmin, 'manggarai' untuk SCN
  }

  // ----------------------------------------------------------
  // APPLY SCN LABEL ke elemen UI (opsional)
  // ----------------------------------------------------------
  function applyScnLabel(selector = '#scn-label') {
    const s = getSession();
    const el = document.querySelector(selector);
    if (el && s) el.textContent = s.scn_label;
  }

  // ----------------------------------------------------------
  // RENDER SCN SWITCHER (hanya untuk superadmin)
  // Inject dropdown ke elemen target
  // ----------------------------------------------------------
  const SCN_LIST = [
    { id: 'manggarai',   label: 'SCN Manggarai' },
    // tambahkan SCN lain di sini
  ];

  function renderScnSwitcher(targetSelector, onSwitch) {
    if (!isSuperAdmin()) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    const select = document.createElement('select');
    select.className = 'scn-switcher';
    select.innerHTML = `<option value="">Semua SCN</option>`;

    SCN_LIST.forEach(scn => {
      const opt = document.createElement('option');
      opt.value = scn.id;
      opt.textContent = scn.label;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      const val = select.value || null;
      if (typeof onSwitch === 'function') onSwitch(val);
    });

    target.appendChild(select);
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    login,
    logout,
    getSession,
    requireAuth,
    isSuperAdmin,
    getScnFilter,
    applyScnLabel,
    renderScnSwitcher,
    SCN_LIST
  };

})();
