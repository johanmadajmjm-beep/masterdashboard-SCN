// ============================================================
//  api.js — Koneksi ke Apps Script Multi-SCN
//  Data REAL dari Google Sheet via Apps Script
//  Cache: sessionStorage + lastSync detection
//  Loading hanya terjadi saat data di server benar-benar berubah
// ============================================================

const API = (() => {

  // ── ENDPOINT PER SCN ──────────────────────────────────────
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

  // ── SESSION STORAGE CACHE ─────────────────────────────────
  // Cache disimpan di sessionStorage agar tetap ada saat pindah halaman.
  // Loading hanya terjadi jika lastSync server berbeda dari cache.
  const SS_PREFIX = 'mel_api_';

  function ssGet(key) {
    try {
      const raw = sessionStorage.getItem(SS_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function ssSet(key, value) {
    try { sessionStorage.setItem(SS_PREFIX + key, JSON.stringify(value)); } catch(e) {}
  }

  function ssDel(key) {
    try { sessionStorage.removeItem(SS_PREFIX + key); } catch(e) {}
  }

  function ssDelPrefix(prefix) {
    try {
      Object.keys(sessionStorage)
        .filter(k => k.startsWith(SS_PREFIX + prefix))
        .forEach(k => sessionStorage.removeItem(k));
    } catch(e) {}
  }

  function ssDelAll() {
    try {
      Object.keys(sessionStorage)
        .filter(k => k.startsWith(SS_PREFIX))
        .forEach(k => sessionStorage.removeItem(k));
    } catch(e) {}
  }

  // ── CEK LAST SYNC DARI SERVER (ringan, hanya 1 nilai) ────
  async function fetchLastSync(scnId) {
    const url = ENDPOINTS[scnId];
    if (!url) return null;
    try {
      const resp = await fetch(`${url}?sheet=meta&scn=${scnId}&token=${AUTH.getToken()||''}`);
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.lastSync || null;
    } catch(e) {
      console.warn(`[API] Gagal cek lastSync ${scnId}:`, e.message);
      return null;
    }
  }

  // ── FETCH SHEET DARI SERVER ───────────────────────────────
  async function fetchSheetFromServer(scnId, sheetName) {
    const url = ENDPOINTS[scnId];
    if (!url) return null;
    try {
      const resp = await fetch(`${url}?sheet=${sheetName}&scn=${scnId}&token=${AUTH.getToken()||''}`);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      return json;
    } catch(e) {
      console.warn(`[API] Gagal fetch ${scnId}/${sheetName}:`, e.message);
      return null;
    }
  }

  // ── FETCH DENGAN CACHE CERDAS ─────────────────────────────
  // 1. Cek lastSync server vs cache
  // 2. Jika sama → pakai sessionStorage (instan)
  // 3. Jika berbeda → fetch ulang, update cache
  async function fetchSheet(scnId, sheetName, serverLastSync) {
    const cacheKey = `${scnId}_${sheetName}`;
    const cached   = ssGet(cacheKey);

    // Jika ada cache dan lastSync sama → langsung pakai
    if (cached && serverLastSync && cached.lastSync === serverLastSync) {
      return cached.data;
    }

    // Fetch dari server
    const json = await fetchSheetFromServer(scnId, sheetName);
    if (!json) return cached ? cached.data : null; // fallback ke cache lama jika fetch gagal

    const data = json.data || json;
    const ls   = json.lastSync || serverLastSync || null;

    // Simpan ke sessionStorage
    ssSet(cacheKey, { data, lastSync: ls });
    return data;
  }

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
        nama   : r.na  || '—',
        cbr    : r.cb  || '—',
        ragam  : r.rg  || '—',
        rgd    : r.rgd || '',           // detail ragam disabilitas
        level  : r.lv  || '—',
        kampung: r.k   || '—',
        desa   : r.d   || '—',
        gender : (r.j  || '').toLowerCase().includes('perempuan') ? 'P' : 'L',
        tl     : r.tl  || '',           // tanggal lahir
        usia,
        gu,
        sp     : r.sp  != null ? parseFloat(r.sp) : null,
        sa     : r.sa  != null ? parseFloat(r.sa) : null,
        ep     : (r.ep || '').toLowerCase() === 'ya',
        ob     : (r.ob || '').toLowerCase() === 'ya',
        obf    : r.obf || '',           // fasilitas kesehatan
        obl    : r.obl || '',           // layanan pengobatan
        tr     : (r.tr || '').toLowerCase() === 'ya',
        trj    : r.trj || '',           // jenis terapi
        trs    : r.trs || '',           // pelaksana terapi
        stp    : r.stp || '',           // status pengasuh
        stpl   : r.stpl || '',          // status pengasuh lainnya
        np     : r.np  || '',           // nama pengasuh
        nka    : r.nka || '',
        tka    : r.tka || '',
        nkp    : r.nkp || '',
        tkp    : r.tkp || '',
        wk     : r.wk  || '',           // waktu kunjungan CBR
        lat    : r.lat ? parseFloat(r.lat) : null,
        lon    : r.lon ? parseFloat(r.lon) : null,
        provinsi: r.provinsi || '',
        scn_id : r.scn || '',
        scn    : r.scn || '',   // alias untuk filter konsisten
        irp    : 'Aktif',
        hari   : 999,
        _tema  : r._tema || null,
      };
    }).filter(a => a.nama && a.nama !== '—');
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
      scn : r.scn || '',
      provinsi: r.provinsi || '',
    }));
  }

  // ── MERGE ANAK DARI SEMUA 6 FORM ─────────────────────────
  // Anak di DataAwal → pakai data lengkap (normalizeDataAwal)
  // Anak di form lain tapi tidak di DataAwal → entri minimal
  // Key unik: nama lowercase (trim)
  function mergeAnakFromAllForms(anakAwal, obsRows, rencanaRows, diaryRows, evalMenengahRows, evalAkhirRows) {
    // Map nama → objek anak (dari DataAwal sebagai master)
    const map = {};
    anakAwal.forEach(a => {
      const key = (a.nama || '').toLowerCase().trim();
      if (key && key !== '—') map[key] = a;
    });

    // Helper: ekstrak nama & cbr dari row form lain
    function extractFromForm(rows) {
      if (!rows || !rows.length) return;
      rows.forEach(r => {
        const nama = (r.nama_anak || r.na || r.nama || '').trim();
        const key  = nama.toLowerCase();
        if (!key || key === '—') return;
        if (!map[key]) {
          // Anak belum ada di DataAwal — buat entri minimal
          map[key] = {
            nama    : nama,
            cbr     : r.cbr_worker || r.cb || r.cbr || '—',
            ragam   : '—',
            rgd     : '',
            level   : '—',
            kampung : '—',
            desa    : '—',
            gender  : '—',
            tl      : '',
            usia    : null,
            gu      : '',
            sp      : null,
            sa      : null,
            ep      : false,
            ob      : false,
            obf     : '',
            obl     : '',
            tr      : false,
            trj     : '',
            trs     : '',
            stp     : '',
            stpl    : '',
            np      : '',
            nka     : '',
            tka     : '',
            nkp     : '',
            tkp     : '',
            wk      : '',
            lat     : null,
            lon     : null,
            provinsi: r.provinsi || '',
            scn_id  : r.scn || '',
            scn     : r.scn || '',
            irp     : 'Aktif',
            hari    : 999,
            _tema   : null,
            _sumber : 'form_lain', // penanda: tidak ada di DataAwal
          };
        }
      });
    }

    extractFromForm(obsRows);
    extractFromForm(rencanaRows);
    extractFromForm(diaryRows);
    extractFromForm(evalMenengahRows);
    extractFromForm(evalAkhirRows);

    return Object.values(map);
  }

  // ── HITUNG STATISTIK DARI DATA REAL ──────────────────────
  function calcStats(anak, obs) {
    const now = new Date();
    const lastVisit = {};
    obs.forEach(o => {
      if (!o.na || !o.tgl || o.tgl === '—') return;
      const key = o.na.toLowerCase();
      if (!lastVisit[key] || o.tgl > lastVisit[key]) lastVisit[key] = o.tgl;
    });
    anak.forEach(a => {
      a.hari = 999; // tidak dipakai
    });
    return { anak };
  }

  // ── HITUNG WORKERS DARI DATA REAL ────────────────────────
  function buildWorkers(anak, obs, perencanaan, diary, evalMenengah, evalAkhir) {
    const now      = new Date();
    const bulan    = now.getMonth();
    const tahun    = now.getFullYear();
    const workerMap = {};

    function addWorker(cb) {
      if (!cb || cb === '—') return;
      const key = cb.toLowerCase().replace(/\s/g, '_').replace(/\./g, '');
      if (!workerMap[key]) {
        workerMap[key] = {
          id             : key,
          nama           : cb,
          anak           : 0,
          kunjungan_bulan: 0,
          irp_aktif      : 0,
          late           : 0,
        };
      }
    }

    // Kumpulkan semua worker dari 6 form — deduplikasi by key
    (anak||[]).forEach(a => addWorker(a.cbr));
    (obs||[]).forEach(o => addWorker(o.cb));
    (perencanaan||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (diary||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (evalMenengah||[]).forEach(r => addWorker(r.cbr_worker||r.cb));
    (evalAkhir||[]).forEach(r => addWorker(r.cbr_worker||r.cb));

    // Hitung anak per worker dari DataAwal
    anak.forEach(a => {
      if (!a.cbr) return;
      const key = a.cbr.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
      if (workerMap[key]) workerMap[key].anak++;
    });

    // Hitung kunjungan bulan ini dari obs
    obs.forEach(o => {
      if (!o.tgl || o.tgl === '—') return;
      const d = new Date(o.tgl);
      if (d.getMonth() === bulan && d.getFullYear() === tahun) {
        const key = o.cb?.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
        if (key && workerMap[key]) workerMap[key].kunjungan_bulan++;
      }
    });

    // Hitung late & irp dari DataAwal
    anak.forEach(a => {
      const key = a.cbr?.toLowerCase().replace(/\s/g,'_').replace(/\./g,'');
      const w = key ? workerMap[key] : null;
      if (!w) return;
      // hari tidak dipakai
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
    // Selalu fetch fresh — tidak pakai cache parsial yang bisa menyebabkan data tidak konsisten
    const serverLastSync = await fetchLastSync(scnId);
    const [rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir] = await Promise.all([
      fetchSheet(scnId, 'DataAwal',        serverLastSync),
      fetchSheet(scnId, 'DataObs',         serverLastSync),
      fetchSheet(scnId, 'DataRencana',     serverLastSync),
      fetchSheet(scnId, 'DataDiary',       serverLastSync),
      fetchSheet(scnId, 'DataEvalMenengah',serverLastSync),
      fetchSheet(scnId, 'DataEvalAkhir',   serverLastSync),
    ]);

    if (!rawAwal || !rawAwal.length) {
      console.warn(`[API] Tidak ada data untuk SCN: ${scnId}`);
      setBadge(false, null);
      return null;
    }

    return buildResult(scnId, rawAwal, rawObs || [], rawRencana || [], rawDiary || [], rawEvalMenengah || [], rawEvalAkhir || []);
  }

  // ── BUILD RESULT DARI RAW DATA ────────────────────────────
  function buildResult(scnId, rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir) {
    const awalRows         = Array.isArray(rawAwal)         ? rawAwal         : (rawAwal?.data         || []);
    const obsRows          = Array.isArray(rawObs)          ? rawObs          : (rawObs?.data          || []);
    const rencanaRows      = Array.isArray(rawRencana)      ? rawRencana      : (rawRencana?.data      || []);
    const diaryRows        = Array.isArray(rawDiary)        ? rawDiary        : (rawDiary?.data        || []);
    const evalMenengahRows = Array.isArray(rawEvalMenengah) ? rawEvalMenengah : (rawEvalMenengah?.data || []);
    const evalAkhirRows    = Array.isArray(rawEvalAkhir)    ? rawEvalAkhir    : (rawEvalAkhir?.data    || []);
    const cached   = ssGet(scnId + '_DataAwal');
    const lastSync = cached ? cached.lastSync : null;

    const anakAwal     = normalizeDataAwal(awalRows);
    const obs          = normalizeObs(obsRows);
    const perencanaan  = rencanaRows;
    const diary        = diaryRows;
    const evalMenengah = evalMenengahRows;
    const evalAkhir    = evalAkhirRows;

    // Union unik anak dari semua 6 form — untuk dashboard coordinator & MEL
    const anak = mergeAnakFromAllForms(anakAwal, obsRows, perencanaan, diary, evalMenengah, evalAkhir);

    calcStats(anak, obs);
    const workers = buildWorkers(anak, obs, perencanaan||[], diary||[], evalMenengah||[], evalAkhir||[]);
    const itt     = calcITT(anak, obs);

    const stakeholder = {
      'CBR Worker'    : { total: workers.length, L: Math.ceil(workers.length*.4), P: Math.floor(workers.length*.6) },
      'Pengasuh/Ortu' : { total: anak.length,    L: Math.round(anak.length*.3),  P: Math.round(anak.length*.7)  },
      'Guru'          : { total: 55, L: 25, P: 30 },
      'Nakes'         : { total: 8,  L: 3,  P: 5  },
      'Pemerintah'    : { total: 10, L: 7,  P: 3  },
      'Staff Mitra'   : { total: 7,  L: 5,  P: 2  },
    };

    // referral dihapus — sudah digabung ke coord-rtl

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
      workers, anak, obs, aktivitas, stakeholder,
      perencanaan, diary, evalMenengah, evalAkhir,
      cerita : [],
      itt    : { Y1_Q2: itt },
    };
  }

  // ── TEMA DARI SERVER (Apps Script + Gemini) ──────────────
  // Tema sudah dianalisis Gemini di Apps Script dan dilampirkan
  // ke setiap row sebagai field _tema saat doGet dipanggil
  // Format _tema: { nka:[{kategori,sub}], tka:[...], nkp:[...], tkp:[...] }

  function getTema(anak, field) {
    // Bangun lookup dari _tema yang sudah ada di data
    // field: 'nka' | 'tka' | 'nkp' | 'tkp'
    const result = {};
    (anak||[]).forEach(function(a) {
      if (a._tema && a._tema[field]) {
        result[a.nama] = a._tema[field];
      }
    });
    return result;
  }

  function hasTema(anak) {
    return (anak||[]).some(function(a) { return a._tema && Object.keys(a._tema).length > 0; });
  }

  // ── BACKGROUND REFRESH: cek data baru tanpa block render ─
  async function _refreshIfNew(scnId, cachedLastSync) {
    try {
      const serverLastSync = await fetchLastSync(scnId);
      if (!serverLastSync || serverLastSync === cachedLastSync) return;
      // Ada data baru — fetch ulang
      const [rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir] = await Promise.all([
        fetchSheet(scnId, 'DataAwal',        serverLastSync),
        fetchSheet(scnId, 'DataObs',         serverLastSync),
        fetchSheet(scnId, 'DataRencana',     serverLastSync),
        fetchSheet(scnId, 'DataDiary',       serverLastSync),
        fetchSheet(scnId, 'DataEvalMenengah',serverLastSync),
        fetchSheet(scnId, 'DataEvalAkhir',   serverLastSync),
      ]);
      if (!rawAwal || !rawAwal.length) return;
      const result = buildResult(scnId, rawAwal, rawObs || [], rawRencana || [], rawDiary || [], rawEvalMenengah || [], rawEvalAkhir || []);
      if (window.renderPage) renderPage(result, scnId);
      console.log('[API] Data baru terdeteksi, halaman di-refresh otomatis');
    } catch(e) {
      // Gagal refresh background — tidak masalah
    }
  }

  // ── AGREGASI SEMUA SCN ────────────────────────────────────
  async function loadAll() {
    // Ambil endpoint pertama yang tersedia (semua pakai endpoint sama)
    const anyScnId = Object.keys(ENDPOINTS)[0];
    const url = ENDPOINTS[anyScnId];
    if (!url) { setBadge(false, null); return null; }

    // Fetch DataAwal & DataObs per SCN (butuh filter scn)
    // Fetch 5 form lain sekali tanpa filter (ambil semua data)
    const token = AUTH.getToken() || '';

    async function fetchAll(sheetName) {
      try {
        const resp = await fetch(`${url}?sheet=${sheetName}&token=${token}`);
        if (!resp.ok) return [];
        const json = await resp.json();
        if (json.ok === false) { console.warn(`[API] fetchAll ${sheetName} error:`, json.error); return []; }
        console.log(`[API] fetchAll ${sheetName}:`, (json.data||[]).length, 'rows');
        return json.data || [];
      } catch(e) { console.warn(`[API] Gagal fetch all ${sheetName}:`, e.message); return []; }
    }

    // Fetch semua sheet paralel
    const [rawAwal, rawObs, rawRencana, rawDiary, rawEvalMenengah, rawEvalAkhir, lastSyncResp] = await Promise.all([
      fetchAll('DataAwal'),
      fetchAll('DataObs'),
      fetchAll('DataRencana'),
      fetchAll('DataDiary'),
      fetchAll('DataEvalMenengah'),
      fetchAll('DataEvalAkhir'),
      fetch(`${url}?sheet=meta&token=${token}`).then(r=>r.json()).catch(()=>null),
    ]);

    if (!rawAwal || !rawAwal.length) {
      setBadge(false, null);
      return null;
    }

    const lastSync = lastSyncResp ? lastSyncResp.lastSync : null;

    // Normalize DataAwal
    const awalRows = Array.isArray(rawAwal) ? rawAwal : (rawAwal.data || []);
    const obsRows  = Array.isArray(rawObs)  ? rawObs  : (rawObs.data  || []);

    const anakAwal = normalizeDataAwal(awalRows);
    const obs      = normalizeObs(obsRows);

    const perencanaan  = Array.isArray(rawRencana)      ? rawRencana      : (rawRencana?.data      || []);
    const diary        = Array.isArray(rawDiary)        ? rawDiary        : (rawDiary?.data        || []);
    const evalMenengah = Array.isArray(rawEvalMenengah) ? rawEvalMenengah : (rawEvalMenengah?.data || []);
    const evalAkhir    = Array.isArray(rawEvalAkhir)    ? rawEvalAkhir    : (rawEvalAkhir?.data    || []);

    // Union unik anak dari semua 6 form — untuk dashboard coordinator & MEL
    const anak = mergeAnakFromAllForms(anakAwal, obsRows, perencanaan, diary, evalMenengah, evalAkhir);

    calcStats(anak, obs);
    const workers = buildWorkers(anak, obs, perencanaan, diary, evalMenengah, evalAkhir);
    const itt     = calcITT(anak, obs);

    // referral dihapus — sudah digabung ke coord-rtl
    const aktivitas = obs.filter(o => o.tgl && o.tgl !== '—')
      .sort((a, b) => b.tgl.localeCompare(a.tgl)).slice(0,10)
      .map(o => ({ tgl:o.tgl, nama:`Kunjungan CBR — ${o.na}`, outcome:1, peserta:1, lokasi:'—', scn:o.scn||'' }));

    // Attach Gemini tema — tidak bisa akses PropertiesService di frontend

    const stakeholder = {
      'CBR Worker'    : { total: workers.length, L: Math.ceil(workers.length*.4), P: Math.floor(workers.length*.6) },
      'Pengasuh/Ortu' : { total: anak.length,    L: Math.round(anak.length*.3),  P: Math.round(anak.length*.7)  },
    };

    setBadge(true, lastSync);

    return {
      meta        : { scn: 'Semua SCN', project: 'BEN', provinsi: 'Nasional', tahun: 2026, lastSync },
      workers, anak, obs, aktivitas, cerita: [], stakeholder,
      perencanaan, diary, evalMenengah, evalAkhir,
      itt: { Y1_Q2: itt },
    };
  }

  // ── FILTER RESULT BY SCN (client-side, untuk loadAll) ───────
  // Dipakai saat superadmin pilih SCN tertentu — filter semua array by field scn
  function filterResultBySCN(result, scnId) {
    if (!scnId || !result) return result;
    const sid = scnId.toLowerCase();

    function filterArr(arr, ...fields) {
      if (!arr || !arr.length) return arr;
      return arr.filter(r => {
        for (const f of fields) {
          const v = (r[f] || '').toLowerCase().trim();
          if (v && v === sid) return true;
        }
        return false;
      });
    }

    return {
      ...result,
      anak        : filterArr(result.anak,        'scn', 'scn_id'),
      obs         : filterArr(result.obs,         'scn'),
      perencanaan : filterArr(result.perencanaan, 'scn'),
      diary       : filterArr(result.diary,       'scn'),
      evalMenengah: filterArr(result.evalMenengah,'scn'),
      evalAkhir   : filterArr(result.evalAkhir,   'scn'),
      workers     : result.workers ? result.workers.filter(w => {
        // worker tidak punya field scn langsung — filter berdasarkan anak yang sudah difilter
        const anakFiltered = filterArr(result.anak, 'scn', 'scn_id');
        const namaSet = new Set(anakFiltered.map(a => (a.cbr||'').toLowerCase()));
        return namaSet.has((w.nama||'').toLowerCase());
      }) : [],
      meta: { ...result.meta, scn: result.meta?.scn || scnId },
    };
  }

  // ── CLEAR CACHE ───────────────────────────────────────────
  function clearCache(scnId) {
    if (scnId) {
      ssDelPrefix(scnId + '_');
    } else {
      ssDelAll();
    }
  }

  // ── PUBLIC: get(scnId) ────────────────────────────────────
  const CACHE_TTL_MS = 2 * 60 * 1000; // 2 menit — sesuai trigger sync

  function getCached(key) {
    try {
      const raw = sessionStorage.getItem('mel_cache_' + key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj;
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

  async function get(scnId) {
    const cacheKey = scnId || 'all';
    const cached = getCached(cacheKey);

    // Ada cache — tampilkan langsung
    if (cached && cached.data) {
      if (isStale(cached)) {
        // Stale — revalidate di background, return cache dulu
        setTimeout(async () => {
          try {
            const fresh = scnId ? await loadScn(scnId) : await loadAll();
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
    const result = scnId ? (ENDPOINTS[scnId] ? await loadScn(scnId) : null) : await loadAll();
    if (result) setCached(cacheKey, result);

    if (!result && scnId) {
      setBadge(false, null);
      return {
        meta        : { scn: `SCN ${scnId}`, project: 'BEN', tahun: 2026, sumber: 'Belum terhubung' },
        workers     : [], anak: [], obs: [],
        aktivitas   : [], stakeholder: {}, cerita: [],
        perencanaan : [], diary: [], evalMenengah: [], evalAkhir: [],
        itt         : { Y1_Q2: {} },
      };
    }

    return result;
  }

  return { get, getTema, hasTema, setBadge, clearCache, ENDPOINTS };

})();
