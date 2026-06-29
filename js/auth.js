// auth.js — Platform MEL NLR Indonesia v2
const AUTH = (() => {
  const USERS = [
    { username:'admin',      password:'adminmel123',   role:'superadmin', scn_id:null,          scn_label:'Semua SCN'              },
    { username:'manggarai',  password:'mgr2026',       role:'scn',        scn_id:'manggarai',   scn_label:'SCN Manggarai'          },
    { username:'banyuwangi', password:'bwi2026',       role:'scn',        scn_id:'banyuwangi',  scn_label:'SCN Banyuwangi'         },
    { username:'jember',     password:'jbr2026',       role:'scn',        scn_id:'jember',      scn_label:'SCN Jember'             },
    { username:'situbondo',  password:'sbd2026',       role:'scn',        scn_id:'situbondo',   scn_label:'SCN Situbondo'          },
    { username:'kupang',     password:'kpg2026',       role:'scn',        scn_id:'kupang',      scn_label:'SCN Kupang'             },
    { username:'tts',        password:'tts2026',       role:'scn',        scn_id:'tts',         scn_label:'SCN Timor Tengah Selatan'},
    { username:'palu',       password:'plu2026',       role:'scn',        scn_id:'palu',        scn_label:'SCN Palu'               },
    { username:'sigi',       password:'sgi2026',       role:'scn',        scn_id:'sigi',        scn_label:'SCN Sigi'               },
  ];

  const SCN_LIST = [
    { id:'manggarai',  label:'SCN Manggarai'           },
    { id:'banyuwangi', label:'SCN Banyuwangi'          },
    { id:'jember',     label:'SCN Jember'              },
    { id:'situbondo',  label:'SCN Situbondo'           },
    { id:'kupang',     label:'SCN Kupang'              },
    { id:'tts',        label:'SCN Timor Tengah Selatan'},
    { id:'palu',       label:'SCN Palu'                },
    { id:'sigi',       label:'SCN Sigi'                },
  ];

  const KEY     = 'mel_v2_session';
  const SCN_KEY = 'mel_v2_active_scn';

  function login(username, password) {
    const u = USERS.find(u => u.username === username.trim().toLowerCase() && u.password === password);
    if (!u) return { ok: false, message: 'Username atau password salah.' };
    const s = { username: u.username, role: u.role, scn_id: u.scn_id, scn_label: u.scn_label, loggedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(s));
    localStorage.removeItem(SCN_KEY);
    return { ok: true, session: s };
  }

  function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SCN_KEY);
    window.location.href = '../index.html';
  }

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s) return null;
      if (Date.now() - s.loggedAt > 8 * 3600 * 1000) { logout(); return null; }
      return s;
    } catch { return null; }
  }

  function requireAuth(redirectTo = '../index.html') {
    const s = getSession();
    if (!s) { window.location.href = redirectTo; return null; }
    return s;
  }

  function isSuperAdmin() { const s = getSession(); return s && s.role === 'superadmin'; }

  function getScnFilter() {
    const s = getSession();
    if (!s) return null;
    if (s.role !== 'superadmin') return s.scn_id;
    return localStorage.getItem(SCN_KEY) || null;
  }

  function setScnFilter(scnId) {
    if (scnId) localStorage.setItem(SCN_KEY, scnId);
    else localStorage.removeItem(SCN_KEY);
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
    // Simpan onScnSwitch ke window agar sidebar.js juga bisa memanggilnya
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
      // Bug 2 Fix: langsung trigger onScnSwitch tanpa perlu refresh
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
    // Set active nav item
    document.querySelectorAll('.nav-sub-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === activePage);
    });

    // Bug 1 Fix: default semua grup collapsed, buka hanya grup aktif
    document.querySelectorAll('.nav-group').forEach(g => {
      const hasActive = g.querySelector('.nav-sub-item.active');
      if (hasActive) {
        g.classList.remove('collapsed');
      } else {
        g.classList.add('collapsed');
      }
    });

    // Fallback: sistem lama pakai data-group + sub-* jika masih ada
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

    // Bug 3 Fix: preload data di background agar cache terisi sebelum user navigasi
    setTimeout(() => {
      if (window.API) {
        const scnId = getScnFilter();
        API.get(scnId).catch(() => {});
      }
    }, 300);

    // Mobile bottom nav
    window.__currentPageId = activePage;
    if (typeof buildBottomNav === 'function') buildBottomNav();
    if (typeof setBottomNavActive === 'function') setBottomNavActive(activePage);
  }

  return {
    login, logout, getSession, requireAuth,
    isSuperAdmin, getScnFilter, setScnFilter,
    applySession, updateScnBadge, initSidebar,
    SCN_LIST, USERS
  };
})();
