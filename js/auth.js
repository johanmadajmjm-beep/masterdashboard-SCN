// ============================================================
//  auth.js — MEL NLR Indonesia v3 (Secure)
//  Autentikasi via GAS 3 Auth Service
//  Tidak ada password di client — semua verifikasi di server
// ============================================================

const AUTH = (() => {

  // ── GAS AUTH SERVICE URL ──────────────────────────────────
  // Ganti dengan URL GAS 3 setelah di-deploy
  const AUTH_GAS_URL = 'https://script.google.com/macros/s/AKfycby77yzpLyhlyfTf5duCrV0iQ6m9E7Pk2_0wRwnRKvGDZXPwK_brQVLQMe9Qe1DdOH0h/exec';

  // ── SCN LIST (tidak sensitif, boleh di client) ────────────
  const SCN_LIST = [
    { id:'manggarai',  label:'SCN Manggarai'            },
    { id:'banyuwangi', label:'SCN Banyuwangi'           },
    { id:'jember',     label:'SCN Jember'               },
    { id:'situbondo',  label:'SCN Situbondo'            },
    { id:'kupang',     label:'SCN Kupang'               },
    { id:'tts',        label:'SCN Timor Tengah Selatan' },
    { id:'palu',       label:'SCN Palu'                 },
    { id:'sigi',       label:'SCN Sigi'                 },
  ];

  const KEY     = 'mel_v3_session';
  const SCN_KEY = 'mel_v3_active_scn';

  // ── SHA-256 HASH (Web Crypto API, built-in browser) ───────
  async function sha256(message) {
    const msgBuffer  = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── LOGIN ─────────────────────────────────────────────────
  // Kirim hash password ke GAS — password asli tidak pernah disimpan
  async function login(username, password) {
    if (!username || !password) {
      return { ok: false, message: 'Username dan password wajib diisi.' };
    }

    let passwordHash;
    try {
      passwordHash = await sha256(password.trim());
    } catch(e) {
      return { ok: false, message: 'Browser tidak mendukung enkripsi. Gunakan browser modern.' };
    }

    try {
      const resp = await fetch(AUTH_GAS_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body   : JSON.stringify({
          action      : 'login',
          username    : username.trim().toLowerCase(),
          passwordHash: passwordHash,
        }),
      });

      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const result = await resp.json();

      if (!result.ok) return { ok: false, message: result.message || 'Login gagal.' };

      // Simpan session ke sessionStorage (token saja, bukan password)
      const session = {
        token    : result.token,
        username : result.username,
        role     : result.role,
        scn_id   : result.scn_id   || null,
        scn_label: result.scn_label|| 'Semua SCN',
        expiredAt: result.expiredAt,
        loggedAt : Date.now(),
      };
      sessionStorage.setItem(KEY, JSON.stringify(session));
      sessionStorage.removeItem(SCN_KEY);

      return { ok: true, session };

    } catch(e) {
      return { ok: false, message: 'Tidak dapat terhubung ke server. Cek koneksi internet.' };
    }
  }

  // ── LOGOUT ────────────────────────────────────────────────
  async function logout() {
    const s = getSession();
    if (s && s.token) {
      // Beritahu GAS untuk hapus token (fire & forget)
      fetch(AUTH_GAS_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body   : JSON.stringify({ action: 'logout', token: s.token }),
      }).catch(() => {});
    }
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(SCN_KEY);
    window.location.href = '../index.html';
  }

  // ── GET SESSION (dari sessionStorage) ──────────────────────
  function getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY));
      if (!s || !s.token) return null;
      // Cek expired berdasarkan expiredAt dari server
      if (s.expiredAt && new Date(s.expiredAt) < new Date()) {
        sessionStorage.removeItem(KEY);
        return null;
      }
      return s;
    } catch { return null; }
  }

  // ── REQUIRE AUTH ──────────────────────────────────────────
  function requireAuth(redirectTo = '../index.html') {
    const s = getSession();
    if (!s) { window.location.href = redirectTo; return null; }
    return s;
  }

  // ── VERIFY TOKEN KE SERVER (opsional, untuk halaman sensitif) ──
  async function verifyToken() {
    const s = getSession();
    if (!s) return false;
    try {
      const resp = await fetch(AUTH_GAS_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body   : JSON.stringify({ action: 'verify', token: s.token }),
      });
      const result = await resp.json();
      return result.ok === true;
    } catch(e) {
      // Jika tidak bisa reach server, fallback ke local check
      return getSession() !== null;
    }
  }

  // ── GET TOKEN (untuk dikirim ke GAS data endpoint) ────────
  function getToken() {
    const s = getSession();
    return s ? s.token : null;
  }

  function isSuperAdmin() {
    const s = getSession();
    return s && s.role === 'superadmin';
  }

  // Bisa akses mel-* (kecuali mel-analisis)
  function isScnAdmin() {
    const s = getSession();
    return s && (s.role === 'superadmin' || s.role === 'scn_admin');
  }

  // Bisa akses coord-* dan worker-* tapi tidak mel-*
  function isCoordOrAbove() {
    const s = getSession();
    return s && ['superadmin','scn_admin','coord','worker'].includes(s.role);
  }

  // Cek apakah role bisa akses mel-*
  function canAccessMel() {
    const s = getSession();
    return s && (s.role === 'superadmin' || s.role === 'scn_admin');
  }

  function getScnFilter() {
    const s = getSession();
    if (!s) return null;
    if (s.role !== 'superadmin') return s.scn_id;
    return sessionStorage.getItem(SCN_KEY) || null;
  }

  function setScnFilter(scnId) {
    if (scnId) sessionStorage.setItem(SCN_KEY, scnId);
    else sessionStorage.removeItem(SCN_KEY);
  }

  function updateScnBadge(scnId) {
    const badge = document.getElementById('scn-badge');
    if (!badge) return;
    if (!scnId) { badge.textContent = 'Semua SCN'; return; }
    const found = SCN_LIST.find(x => x.id === scnId);
    badge.textContent = found ? found.label : scnId;
  }

  function applySession(opts = {}) {
    const s = getSession();
    if (!s) return;
    if (opts.onScnSwitch) window.__onScnSwitch = opts.onScnSwitch;
    const q = sel => document.querySelector(sel);
    if (q('#user-av'))     q('#user-av').textContent    = s.username.charAt(0).toUpperCase();
    if (q('#user-name'))   q('#user-name').textContent  = s.username.toUpperCase();
    if (q('#user-role'))   q('#user-role').textContent  = s.role === 'superadmin' ? 'Super Admin' : 'SCN Admin';
    if (q('#topbar-date')) q('#topbar-date').textContent = new Date().toLocaleDateString('id-ID', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

    const currentScn = getScnFilter();
    updateScnBadge(currentScn);

    const wrap = q('#scn-switcher-wrap');
    if (wrap && s.role === 'superadmin') {
      const sel = document.createElement('select');
      sel.className = 'scn-switcher';
      sel.innerHTML = `<option value="">— Semua SCN —</option>` +
        SCN_LIST.map(x => `<option value="${x.id}">${x.label}</option>`).join('');
      sel.value = currentScn || '';
      sel.addEventListener('change', () => {
        const scnId = sel.value || null;
        setScnFilter(scnId);
        updateScnBadge(scnId);
        if (window.API && API.clearCache) API.clearCache(scnId);
        if (typeof window.__onScnSwitch === 'function') {
          window.__onScnSwitch(scnId);
        } else {
          location.reload();
        }
      });
      wrap.appendChild(sel);
    }
  }

  function initSidebar(activeGroup, activePage) {
    document.querySelectorAll('.nav-sub-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === activePage);
    });
    document.querySelectorAll('.nav-group').forEach(g => {
      const hasActive = g.querySelector('.nav-sub-item.active');
      if (hasActive) g.classList.remove('collapsed');
      else g.classList.add('collapsed');
    });
    document.querySelectorAll('.nav-group-header').forEach(h => {
      const groupId = h.dataset.group;
      const sub     = document.getElementById('sub-' + groupId);
      if (!sub) return;
      h.addEventListener('click', () => {
        const isOpen = h.classList.contains('open');
        document.querySelectorAll('.nav-group-header').forEach(x => x.classList.remove('open'));
        document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('open'));
        if (!isOpen) { h.classList.add('open'); sub.classList.add('open'); }
      });
    });
    setTimeout(() => {
      if (window.API) {
        const scnId = getScnFilter();
        API.get(scnId).catch(() => {});
      }
    }, 300);
    window.__currentPageId = activePage;
    if (typeof buildBottomNav === 'function') buildBottomNav();
    if (typeof setBottomNavActive === 'function') setBottomNavActive(activePage);
  }

  return {
    login, logout, getSession, requireAuth, verifyToken,
    getToken, isSuperAdmin, isScnAdmin, isCoordOrAbove, canAccessMel,
    getScnFilter, setScnFilter,
    applySession, updateScnBadge, initSidebar, SCN_LIST,
  };

})();
