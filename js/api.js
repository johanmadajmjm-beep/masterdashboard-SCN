// ============================================================
//  api.js — Koneksi ke Apps Script Multi-SCN
//  Prinsip: ambil data dari 6 sheet GSheet, normalize, kirim
//  Filter SCN sudah ditangani GAS di server (param ?scn=)
//  Cache: sessionStorage dengan TTL 2 menit
// ============================================================

const API = (() => {

  // ── ENDPOINT (semua SCN pakai GAS yang sama) ──────────────
  const ENDPOINTS = {
    manggarai  : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    kupang     : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    banyuwangi : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    jember     : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    situbondo  : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    tts        : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    palu       : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
    sigi       : 'https://script.google.com/macros/s/AKfycbx9jmqhOFmIywMzftoUASILY3Xlq7yqMCBqdx_J_wwjaqXFt-vHSd2eR8OVwovT_qlk/exec',
  };

  // ── CACHE ─────────────────────────────────────────────────
  const CACHE_TTL_MS = 2 * 60 * 1000; // 2 menit

  function getCached(key) {
    try {
      const raw = sessionStorage.getItem('mel_cache_' + key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  }

  function setCached(key, data) {
    try {
      sessionStorage.setItem('mel_cache_' + key, JSON.stringify({ data, ts: Date.now() }));
    } catch(e) {}
  }

  function isStale(cached) {
    if (!cached) return true;
    return (Date.now() - cached.ts) > CACHE_TTL_MS;
  }

  function clearCache(scnId) {
    try {
      const prefix = 'mel_cache_';
      Object.keys(sessionStorage)
        .filter(k => k.startsWith(prefix + (scnId || '')))
        .forEach(k => sessionStorage.removeItem(k));
    } catch(e) {}
  }

  // ── FETCH DARI GAS ─────────────────────────────────────────
  // GAS sudah handle filter by scn via parameter ?scn=
  const GAS_URL = ENDPOINTS.manggarai; // semua pakai endpoint yang sama

  async function fetchSheet(sheetName, scnId) {
    const token = (typeof AUTH !== 'undefined') ? AUTH.getToken() || '' : '';
    const scnParam = scnId ? `&scn=${scnId}` : '';
    try {
      const resp = await fetch(`${GAS_URL}?sheet=${sheetName}&token=${token}${scnParam}`);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      if (json.ok === false) {
        console.warn(`[API] ${sheetName} error:`, json.error);
        return [];
      }
      return json.data || [];
    } catch(e) {
      console.warn(`[API] Gagal fetch ${sheetName}:`, e.message);
      return [];
    }
  }

  async function fetchMeta(scnId) {
    const token = (typeof AUTH !== 'undefined') ? AUTH.getToken() || '' : '';
    const scnParam = scnId ? `&scn=${scnId}` : '';
    try {
      const resp = await fetch(`${GAS_URL}?sheet=meta&token=${token}${scnParam}`);
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.lastSync || null;
    } catch(e) { return null; }
  }

  // ── NORMALIZE DATA AWAL ────────────────────────────────────
  // Mapping kolom sheet → field yang dipakai dashboard
  function normalizeDataAwal(rows) {
    if (!rows || !rows.length) return [];
    return rows.map(r => {
      const usia = r.u ? parseInt(r.u) : 0;
      const gu = r.gu || (
        usia <= 0  ? '' :
        usia <= 5  ? '0-5 th' :
        usia <= 12 ? '6-12 th' :
        usia <= 17 ? '13-17 th' :
        usia <= 24 ? '18-24 th' : '25+ th'
      );
      return {
        nama    : r.na   || '—',
        cbr     : r.cb   || '—',
        ragam   : r.rg   || '—',
        rgd     : r.rgd  || '',
        level   : r.lv   || '—',
        kampung : r.k    || '—',
        desa    : r.d    || '—',
        gender  : (r.j   || '').toLowerCase().includes('perempuan') ? 'P' : 'L',
        tl      : r.tl   || '',
        usia,
        gu,
        sp      : r.sp   != null ? parseFloat(r.sp) : null,
        sa      : r.sa   != null ? parseFloat(r.sa) : null,
        ep      : (r.ep  || '').toLowerCase() === 'ya',
        ob      : (r.ob  || '').toLowerCase() === 'ya',
        obf     : r.obf  || '',
        obl     : r.obl  || '',
        tr      : (r.tr  || '').toLowerCase() === 'ya',
        trj     : r.trj  || '',
        trs     : r.trs  || '',
        stp     : r.stp  || '',
        stpl    : r.stpl || '',
        np      : r.np   || '',
        nka     : r.nka  || '',
        tka     : r.tka  || '',
        nkp     : r.nkp  || '',
        tkp     : r.tkp  || '',
        wk      : r.wk   || '',
        lat     : r.lat  ? parseFloat(r.lat) : null,
        lon     : r.lon  ? parseFloat(r.lon) : null,
        provinsi: r.provinsi || '',
        scn_id  : r.scn  || '',
        scn     : r.scn  || '',
        irp     : 'Aktif',
        hari    : 999,
        _tema   : r._tema || null,
      };
    }).filter(a => a.nama && a.nama !== '—');
  }

  // ── NORMALIZE OBSERVASI ────────────────────────────────────
  function normalizeObs(rows) {
    if (!rows || !rows.length) return [];
    return rows.map(r => ({
      na      : r.na  || '—',
      cb      : r.cb  || '—',
      tgl     : r.tgl ? String(r.tgl).substring(0, 10) : '—',
      st      : r.st  || '',
      kg      : r.kg  || '',
      pf      : r.pf  || '',
      lg      : r.lg  || '',
      lat     : r.lat ? parseFloat(r.lat) : null,
      lon     : r.lon ? parseFloat(r.lon) : null,
      scn     : r.scn || '',
      provinsi: r.provinsi || '',
    }));
  }

  // ── HITUNG STATISTIK ───────────────────────────────────────
  function calcStats(anak, obs) {
    const lastVisit = {};
    obs.forEach(o => {
      if (!o.na || !o.tgl || o.tgl === '—') return;
      const key = o.na.toLowerCase();
      if (!lastVisit[key] || o.tgl > lastVisit[key]) lastVisit[key] = o.tgl;
    });
    anak.forEach(a => { a.hari = 999; });
    return { anak };
  }

  // ── BUILD WORKERS ──────────────────────────────────────────
  function buildWorkers(anak, obs, perencanaan, diary, evalMenengah, evalAkhir) {
    const now   = new Date();
    const bulan = now.getMonth();
    const tahun = now.getFullYear();
    const workerMap = {};

    function addWorker(cb) {
      if (!cb || cb === '—') return;
      const key = cb.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
      if (!workerMap[key]) {
        workerMap[key] = { id:key, nama:cb, anak:0, kunjungan_bulan:0, irp_aktif:0, late:0 };
      }
    }

    (anak||[]).forEach(a => addWorker(a.cbr));
    (obs||[]).forEach(o => addWorker(o.cb));
    (perencanaan||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (diary||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (evalMenengah||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (evalAkhir||[]).forEach(r => addWorker(r.cbr_worker||r.cb));

    anak.forEach(a => {
      if (!a.cbr) return;
      const key = a.cbr.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
      if (workerMap[key]) workerMap[key].anak++;
    });

    obs.forEach(o => {
      if (!o.tgl || o.tgl === '—') return;
      const d = new Date(o.tgl);
      if (d.getMonth() === bulan && d.getFullYear() === tahun) {
        const key = o.cb?.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
        if (key && workerMap[key]) workerMap[key].kunjungan_bulan++;
      }
    });

    anak.forEach(a => {
      const key = a.cbr?.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
      const w   = key ? workerMap[key] : null;
      if (!w) return;
      if (a.irp === 'Aktif') w.irp_aktif++;
    });

    return Object.values(workerMap);
  }

  // ── HITUNG ITT ─────────────────────────────────────────────
  function calcITT(anak, obs) {
    const total    = anak.length || 1;
    const punyaObs = anak.filter(a => {
      const key = a.nama.toLowerCase();
      return obs.some(o => o.na && o.na.toLowerCase() === key);
    }).length;
    const terapi   = anak.filter(a => a.tr).length;
    const skorBaik = anak.filter(a => a.sp != null && a.sp >= 5).length;
    return {
      'O1-i1': { cap: skorBaik,              target_y1: 50,  target_total: 150 },
      'O1-i2': { cap: punyaObs,              target_y1: 30,  target_total: 100 },
      'O1-i3': { cap: total,                 target_y1: 200, target_total: 200 },
      'O1-i4': { cap: terapi,                target_y1: 40,  target_total: 120 },
      'O1-i5': { cap: terapi,                target_y1: 40,  target_total: 120 },
      'O1-i6': { cap: punyaObs,              target_y1: 35,  target_total: 100 },
      'O2-i1': { cap: Math.round(total*.65), target_y1: 100, target_total: 200 },
      'O2-i2': { cap: Math.round(total*.35), target_y1: 60,  target_total: 150 },
      'O2-i3': { cap: Math.round(total*.48), target_y1: 80,  target_total: 180 },
      'O2-i4': { cap: 5,                     target_y1: 8,   target_total: 20  },
      'O3-i1': { cap: 3,                     target_y1: 4,   target_total: 8   },
      'O3-i2': { cap: punyaObs,              target_y1: 40,  target_total: 120 },
      'O3-i3': { cap: 8,                     target_y1: 8,   target_total: 40  },
      'O3-i4': { cap: 8,                     target_y1: 8,   target_total: 40  },
      'O3-i5': { cap: 4,                     target_y1: 4,   target_total: 8   },
      'O4-i1': { cap: 3,                     target_y1: 5,   target_total: 15  },
      'O4-i2': { cap: 5,                     target_y1: 8,   target_total: 20  },
      'O4-i3': { cap: 15,                    target_y1: 20,  target_total: 60  },
      'O4-i4': { cap: 9,                     target_y1: 20,  target_total: 50  },
      'O4-i5': { cap: 12,                    target_y1: 30,  target_total: 80  },
      'O5-i1': { cap: Math.round(total*.35), target_y1: 50,  target_total: 120 },
      'O5-i2': { cap: Math.round(total*.22), target_y1: 40,  target_total: 100 },
      'O5-i3': { cap: 5,                     target_y1: 10,  target_total: 30  },
      'O5-i4': { cap: 4,                     target_y1: 8,   target_total: 20  },
      'O5-i5': { cap: 16,                    target_y1: 20,  target_total: 50  },
      'O6-i1': { cap: 5,                     target_y1: 20,  target_total: 60  },
      'O6-i2': { cap: 8,                     target_y1: 25,  target_total: 80  },
      'O6-i3': { cap: 1,                     target_y1: 2,   target_total: 5   },
      'O6-i4': { cap: 2,                     target_y1: 6,   target_total: 20  },
      'O7-i1': { cap: 1,                     target_y1: 3,   target_total: 10  },
      'O7-i2': { cap: 4,                     target_y1: 10,  target_total: 30  },
      'O7-i3': { cap: 1,                     target_y1: 2,   target_total: 8   },
      'O7-i4': { cap: 2,                     target_y1: 4,   target_total: 12  },
      'O7-i5': { cap: 0,                     target_y1: 0,   target_total: 0   },
    };
  }

  // ── UPDATE BADGE TOPBAR ────────────────────────────────────
  function setBadge(isReal, lastSync) {
    const badge  = document.getElementById('data-source-badge');
    const syncEl = document.getElementById('sync-time');
    if (badge) {
      badge.style.display = 'inline';
      if (isReal) {
        badge.textContent      = '● Live';
        badge.style.background = '#dcfce7';
        badge.style.color      = '#15803d';
        badge.style.border     = '1px solid #bbf7d0';
      } else {
        badge.textContent      = '◎ Tidak ada data';
        badge.style.background = '#fee2e2';
        badge.style.color      = '#991b1b';
        badge.style.border     = '1px solid #fecaca';
      }
    }
    if (syncEl && lastSync) {
      const d = new Date(lastSync);
      syncEl.style.display = 'inline';
      syncEl.textContent   = 'Sync: ' + d.toLocaleString('id-ID', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });
    }
  }

  // ── BUILD RESULT ───────────────────────────────────────────
  // Rakit semua data dari 6 sheet menjadi satu objek untuk dashboard
  function buildResult(scnId, rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir, lastSync) {
    const anak         = normalizeDataAwal(rawAwal || []);
    const obs          = normalizeObs(rawObs || []);
    const perencanaan  = rawRencana      || [];
    const diary        = rawDiary        || [];
    const evalMenengah = rawEvalMenengah || [];
    const evalAkhir    = rawEvalAkhir    || [];

    calcStats(anak, obs);
    const workers = buildWorkers(anak, obs, perencanaan, diary, evalMenengah, evalAkhir);
    const itt     = calcITT(anak, obs);

    const aktivitas = obs
      .filter(o => o.tgl && o.tgl !== '—')
      .sort((a, b) => b.tgl.localeCompare(a.tgl))
      .slice(0, 10)
      .map(o => ({
        tgl    : o.tgl,
        nama   : `Kunjungan CBR — ${o.na}`,
        outcome: 1,
        peserta: 1,
        lokasi : '—',
        scn    : o.scn || scnId || '',
      }));

    const stakeholder = {
      'CBR Worker'    : { total: workers.length, L: Math.ceil(workers.length*.4),  P: Math.floor(workers.length*.6) },
      'Pengasuh/Ortu' : { total: anak.length,    L: Math.round(anak.length*.3),    P: Math.round(anak.length*.7)   },
      'Guru'          : { total: 55, L: 25, P: 30 },
      'Nakes'         : { total: 8,  L: 3,  P: 5  },
      'Pemerintah'    : { total: 10, L: 7,  P: 3  },
      'Staff Mitra'   : { total: 7,  L: 5,  P: 2  },
    };

    const hasData = anak.length || obs.length || perencanaan.length ||
                    diary.length || evalMenengah.length || evalAkhir.length;
    setBadge(!!hasData, lastSync);

    const scnLabel = scnId
      ? `SCN ${scnId.charAt(0).toUpperCase() + scnId.slice(1)}`
      : 'Semua SCN';

    return {
      meta: {
        scn      : scnLabel,
        project  : 'BEN',
        provinsi : (rawAwal && rawAwal[0]) ? rawAwal[0].provinsi || '' : '',
        tahun    : 2026,
        lastSync,
        sumber   : 'Google Sheets',
      },
      workers, anak, obs, aktivitas, stakeholder,
      perencanaan, diary, evalMenengah, evalAkhir,
      cerita : [],
      itt    : { Y1_Q2: itt },
    };
  }

  // ── LOAD DATA (1 SCN atau semua) ───────────────────────────
  async function load(scnId) {
    // Fetch 6 sheet + meta secara paralel
    // GAS filter by ?scn= jika scnId ada
    const [rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir, lastSync] =
      await Promise.all([
        fetchSheet('DataAwal',         scnId),
        fetchSheet('DataObs',          scnId),
        fetchSheet('DataRencana',      scnId),
        fetchSheet('DataDiary',        scnId),
        fetchSheet('DataEvalMenengah', scnId),
        fetchSheet('DataEvalAkhir',    scnId),
        fetchMeta(scnId),
      ]);

    const hasAnyData = rawAwal.length || rawObs.length || rawRencana.length ||
                       rawDiary.length || rawEvalMenengah.length || rawEvalAkhir.length;

    if (!hasAnyData) {
      console.warn(`[API] Tidak ada data untuk SCN: ${scnId || 'semua'}`);
      setBadge(false, null);
      return null;
    }

    return buildResult(scnId, rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir, lastSync);
  }

  // ── PUBLIC: get(scnId) ─────────────────────────────────────
  async function get(scnId) {
    const cacheKey = scnId || 'all';
    const cached   = getCached(cacheKey);

    // Ada cache — tampilkan langsung
    if (cached && cached.data) {
      if (isStale(cached)) {
        // Stale — revalidate di background
        setTimeout(async () => {
          try {
            const fresh = await load(scnId);
            if (fresh) {
              setCached(cacheKey, fresh);
              if (window.renderPage) window.renderPage(fresh, scnId);
            }
          } catch(e) { console.warn('[API] Background revalidate gagal:', e.message); }
        }, 0);
      }
      return cached.data;
    }

    // Tidak ada cache — fetch fresh
    const result = await load(scnId);
    if (result) setCached(cacheKey, result);

    if (!result) {
      setBadge(false, null);
      return {
        meta        : { scn: scnId ? `SCN ${scnId}` : 'Semua SCN', project: 'BEN', tahun: 2026 },
        workers     : [], anak: [], obs: [],
        aktivitas   : [], stakeholder: {}, cerita: [],
        perencanaan : [], diary: [], evalMenengah: [], evalAkhir: [],
        itt         : { Y1_Q2: {} },
      };
    }

    return result;
  }

  // ── TEMA (Gemini — sudah di-attach GAS ke DataAwal) ────────
  function getTema(anak, field) {
    const result = {};
    (anak||[]).forEach(a => {
      if (a._tema && a._tema[field]) result[a.nama] = a._tema[field];
    });
    return result;
  }

  function hasTema(anak) {
    return (anak||[]).some(a => a._tema && Object.keys(a._tema).length > 0);
  }

  return { get, getTema, hasTema, setBadge, clearCache, ENDPOINTS };

})();
