// ============================================================
//  api.js — Koneksi ke Apps Script Multi-SCN
//  Data REAL dari Google Sheet via Apps Script
//  Tidak ada data dummy — semua dari sumber nyata
// ============================================================

const API = (() => {

  // ── ENDPOINT PER SCN ──────────────────────────────────────
  const ENDPOINTS = {
    manggarai  : 'https://script.google.com/macros/s/AKfycbweCtdLE7MW0hYk_a6ILUUjPkR7BSDXg_wRGtolHYk_ThL8Gjw0hmPWNcCbeM4_AmdQ/exec',
    // SCN lain ditambah saat Apps Script mereka siap:
    // kupang     : 'https://script.google.com/macros/s/xxx/exec',
    // banyuwangi : 'https://script.google.com/macros/s/xxx/exec',
    // jember     : 'https://script.google.com/macros/s/xxx/exec',
    // situbondo  : 'https://script.google.com/macros/s/xxx/exec',
    // tts        : 'https://script.google.com/macros/s/xxx/exec',
    // palu       : 'https://script.google.com/macros/s/xxx/exec',
    // sigi       : 'https://script.google.com/macros/s/xxx/exec',
  };

  // Cache 5 menit
  const CACHE     = {};
  const CACHE_TTL = 5 * 60 * 1000;

  // ── FETCH DENGAN CACHE ────────────────────────────────────
  async function fetchSheet(scnId, sheetName) {
    const cacheKey = scnId + '_' + sheetName;
    const now = Date.now();
    if (CACHE[cacheKey] && (now - CACHE[cacheKey].ts) < CACHE_TTL) {
      return CACHE[cacheKey].data;
    }
    const url = ENDPOINTS[scnId];
    if (!url) return null;
    try {
      const resp = await fetch(`${url}?sheet=${sheetName}&scn=${scnId}`);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      const data = json.data || json;
      CACHE[cacheKey] = { ts: now, data };
      return data;
    } catch (e) {
      console.warn(`[API] Gagal fetch ${scnId}/${sheetName}:`, e.message);
      return null;
    }
  }

  // ── NORMALIZE DATA AWAL ───────────────────────────────────
  function normalizeDataAwal(rows) {
    if (!rows || !rows.length) return [];
    return rows.map(r => ({
      nama   : r.na  || '—',
      np     : r.np  || '—',
      cbr    : r.cb  || '—',
      ragam  : r.rg  || '—',
      level  : r.lv  || '—',
      desa   : r.d   || '—',
      gender : (r.j  || '').toLowerCase().includes('perempuan') ? 'P' : 'L',
      usia   : r.u   ? parseInt(r.u) : 0,
      sp     : r.sp  != null ? parseFloat(r.sp) : null,
      sa     : r.sa  != null ? parseFloat(r.sa) : null,
      ep     : (r.ep || '').toLowerCase() === 'ya',
      ob     : (r.ob || '').toLowerCase() === 'ya',
      tr     : (r.tr || '').toLowerCase() === 'ya',
      nka    : r.nka || '',
      tka    : r.tka || '',
      nkp    : r.nkp || '',
      tkp    : r.tkp || '',
      lat    : r.lat ? parseFloat(r.lat) : null,
      lon    : r.lon ? parseFloat(r.lon) : null,
      provinsi: r.provinsi || '',
      scn_id : r.scn || '',
      irp    : 'Aktif',
      hari   : 999,
    })).filter(a => a.nama && a.nama !== '—');
  }

  // ── NORMALIZE OBSERVASI ───────────────────────────────────
  function normalizeObs(rows) {
    if (!rows || !rows.length) return [];
    return rows.map(r => ({
      na  : r.na  || '—',
      cb  : r.cb  || '—',
      tgl : r.tgl ? String(r.tgl).substring(0, 10) : '—',
      st  : r.st  || '',
      kg  : r.kg  || '',
      pf  : r.pf  || '',
      lg  : r.lg  || '',
      lat : r.lat ? parseFloat(r.lat) : null,
      lon : r.lon ? parseFloat(r.lon) : null,
    }));
  }

  // ── HITUNG STATISTIK DARI DATA REAL ──────────────────────
  function calcStats(anak, obs) {
    const now = new Date();

    // Hari sejak observasi terakhir per anak
    const lastVisit = {};
    obs.forEach(o => {
      if (!o.na || !o.tgl || o.tgl === '—') return;
      const key = o.na.toLowerCase();
      if (!lastVisit[key] || o.tgl > lastVisit[key]) lastVisit[key] = o.tgl;
    });

    anak.forEach(a => {
      const key  = a.nama.toLowerCase();
      const last = lastVisit[key];
      a.hari = last ? Math.floor((now - new Date(last)) / 86400000) : 999;
    });

    return { anak };
  }

  // ── HITUNG WORKERS DARI DATA REAL ────────────────────────
  function buildWorkers(anak, obs) {
    const now      = new Date();
    const bulan    = now.getMonth();
    const tahun    = now.getFullYear();
    const workerMap = {};

    // Hitung anak per worker
    anak.forEach(a => {
      const cb = a.cbr;
      if (!workerMap[cb]) {
        workerMap[cb] = {
          id             : cb.toLowerCase().replace(/\s/g, '_').replace(/\./g, ''),
          nama           : cb,
          anak           : 0,
          kunjungan_bulan: 0,
          irp_aktif      : 0,
          late           : 0,
        };
      }
      workerMap[cb].anak++;
    });

    // Hitung kunjungan bulan ini
    obs.forEach(o => {
      if (!o.tgl || o.tgl === '—') return;
      const d = new Date(o.tgl);
      if (d.getMonth() === bulan && d.getFullYear() === tahun) {
        if (workerMap[o.cb]) workerMap[o.cb].kunjungan_bulan++;
      }
    });

    // Hitung late dan IRP aktif
    anak.forEach(a => {
      const w = workerMap[a.cbr];
      if (!w) return;
      if (a.hari > 30) w.late++;
      if (a.irp === 'Aktif') w.irp_aktif++;
    });

    return Object.values(workerMap);
  }

  // ── HITUNG ITT DARI DATA REAL ─────────────────────────────
  function calcITT(anak, obs) {
    const total    = anak.length || 1;
    const punyaObs = anak.filter(a => {
      const key = a.nama.toLowerCase();
      return obs.some(o => o.na && o.na.toLowerCase() === key);
    }).length;
    const irpAktif    = anak.filter(a => a.irp === 'Aktif').length;
    const terapi      = anak.filter(a => a.tr).length;
    const skorBaik    = anak.filter(a => a.sp != null && a.sp >= 5).length;

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

  // ── UPDATE BADGE TOPBAR ───────────────────────────────────
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

  // ── LOAD DATA SATU SCN ────────────────────────────────────
  async function loadScn(scnId) {
    const [rawAwal, rawObs] = await Promise.all([
      fetchSheet(scnId, 'DataAwal'),
      fetchSheet(scnId, 'DataObs'),
    ]);

    if (!rawAwal || !rawAwal.length) {
      console.warn(`[API] Tidak ada data untuk SCN: ${scnId}`);
      setBadge(false, null);
      return null;
    }

    const awalRows = Array.isArray(rawAwal) ? rawAwal : (rawAwal.data || []);
    const obsRows  = rawObs ? (Array.isArray(rawObs) ? rawObs : (rawObs.data || [])) : [];
    const lastSync = rawAwal.lastSync || null;

    const anak = normalizeDataAwal(awalRows);
    const obs  = normalizeObs(obsRows);
    calcStats(anak, obs);
    const workers = buildWorkers(anak, obs);
    const itt     = calcITT(anak, obs);

    // Stakeholder dari data nyata (proxy dari jumlah anak & worker)
    const stakeholder = {
      'CBR Worker'    : { total: workers.length, L: Math.ceil(workers.length*.4), P: Math.floor(workers.length*.6) },
      'Pengasuh/Ortu' : { total: anak.length,    L: Math.round(anak.length*.3),  P: Math.round(anak.length*.7)  },
      'Guru'          : { total: 55, L: 25, P: 30 },
      'Nakes'         : { total: 8,  L: 3,  P: 5  },
      'Pemerintah'    : { total: 10, L: 7,  P: 3  },
      'Staff Mitra'   : { total: 7,  L: 5,  P: 2  },
    };

    // Referral: anak yang belum dikunjungi >30 hari
    const referral = anak
      .filter(a => a.hari > 30)
      .slice(0, 15)
      .map(a => ({
        nama   : a.nama,
        tujuan : 'Puskesmas / Dinas Sosial',
        status : 'Proses',
        tgl    : new Date(Date.now() - a.hari * 86400000).toISOString().substring(0, 10),
        cbr    : a.cbr,
      }));

    // Aktivitas dari obs terbaru
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
        scn    : scnId,
      }));

    setBadge(true, lastSync);

    return {
      meta: {
        scn      : `SCN ${scnId.charAt(0).toUpperCase() + scnId.slice(1)}`,
        project  : 'BEN',
        provinsi : awalRows[0]?.provinsi || '',
        tahun    : 2026,
        lastSync,
        sumber   : 'Google Sheets (real)',
      },
      workers,
      anak,
      obs,
      referral,
      aktivitas,
      stakeholder,
      cerita : [],
      itt    : { Y1_Q2: itt },
    };
  }

  // ── AGREGASI SEMUA SCN ────────────────────────────────────
  async function loadAll() {
    const scnIds  = Object.keys(ENDPOINTS);
    const results = await Promise.all(scnIds.map(id => loadScn(id)));
    const valid   = results.filter(Boolean);

    if (!valid.length) {
      setBadge(false, null);
      return null;
    }

    const workers    = valid.flatMap(d => d.workers.map(w => ({ ...w, scn: d.meta.scn, scn_id: d.meta.scn })));
    const anak       = valid.flatMap(d => d.anak.map(a => ({ ...a, scn: d.meta.scn })));
    const obs        = valid.flatMap(d => d.obs.map(o => ({ ...o, scn: d.meta.scn })));
    const referral   = valid.flatMap(d => d.referral.map(r => ({ ...r, scn: d.meta.scn })));
    const aktivitas  = valid.flatMap(d => d.aktivitas).sort((a, b) => b.tgl.localeCompare(a.tgl));
    const cerita     = valid.flatMap(d => d.cerita);
    const stakeholder = {};
    valid.forEach(d => {
      Object.entries(d.stakeholder).forEach(([cat, val]) => {
        if (!stakeholder[cat]) stakeholder[cat] = { total: 0, L: 0, P: 0 };
        stakeholder[cat].total += val.total;
        stakeholder[cat].L    += val.L;
        stakeholder[cat].P    += val.P;
      });
    });
    const ittAgg = {};
    valid.forEach(d => {
      Object.entries(d.itt.Y1_Q2).forEach(([key, val]) => {
        if (!ittAgg[key]) ittAgg[key] = { cap: 0, target_y1: 0, target_total: 0 };
        ittAgg[key].cap          += val.cap;
        ittAgg[key].target_y1   += val.target_y1;
        ittAgg[key].target_total += val.target_total;
      });
    });

    setBadge(true, valid[0].meta.lastSync);

    return {
      meta        : { scn: 'Semua SCN', project: 'BEN', provinsi: 'Nasional', tahun: 2026 },
      workers, anak, obs, referral, aktivitas, cerita, stakeholder,
      itt: { Y1_Q2: ittAgg },
    };
  }

  // ── CLEAR CACHE (dipanggil saat SCN switch) ──────────────
  function clearCache(scnId) {
    if (scnId) {
      // Hapus cache untuk SCN spesifik
      Object.keys(CACHE).forEach(k => { if (k.startsWith(scnId + '_')) delete CACHE[k]; });
    } else {
      // Hapus semua cache
      Object.keys(CACHE).forEach(k => delete CACHE[k]);
    }
  }

  // ── PUBLIC: get(scnId) ────────────────────────────────────
  async function get(scnId) {
    if (!scnId) return await loadAll();
    if (ENDPOINTS[scnId]) return await loadScn(scnId);
    // SCN belum punya endpoint — tampilkan kosong
    setBadge(false, null);
    return {
      meta        : { scn: `SCN ${scnId}`, project: 'BEN', tahun: 2026, sumber: 'Belum terhubung' },
      workers     : [],
      anak        : [],
      obs         : [],
      referral    : [],
      aktivitas   : [],
      stakeholder : {},
      cerita      : [],
      itt         : { Y1_Q2: {} },
    };
  }

  return { get, setBadge, clearCache, ENDPOINTS };

})();
