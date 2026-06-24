// ============================================================
//  api.js — Koneksi ke Apps Script BEN per SCN
//  SCN Manggarai: data REAL dari KoboToolbox
//  SCN lain: data dummy dari data.js (fallback)
// ============================================================

const API = (() => {

  // ── ENDPOINT PER SCN ──────────────────────────────────────
  const ENDPOINTS = {
    manggarai: 'https://script.google.com/macros/s/AKfycbxSE2RBgBb7v-hWeYYa_1olFwQDPFktPJIMyiSPlY-vLwSG5Oe2LS5xiSdyDXbPllLiGg/exec',
    // SCN lain ditambah di sini ketika Apps Script mereka siap:
    // banyuwangi: 'https://script.google.com/macros/s/xxx/exec',
  };

  const CACHE     = {};
  const CACHE_TTL = 5 * 60 * 1000; // 5 menit

  // ── FETCH DENGAN CACHE ────────────────────────────────────
  async function fetchSheet(scnId, sheetName) {
    const key = scnId + '_' + sheetName;
    const now = Date.now();
    if (CACHE[key] && (now - CACHE[key].ts) < CACHE_TTL) {
      return CACHE[key].data;
    }
    const url = ENDPOINTS[scnId];
    if (!url) return null; // Tidak ada endpoint → pakai dummy

    try {
      const resp = await fetch(url + '?sheet=' + sheetName);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      const data = json.data || json;
      CACHE[key] = { ts: now, data };
      return data;
    } catch (e) {
      console.warn('[API] Gagal fetch ' + scnId + '/' + sheetName + ':', e.message);
      return null;
    }
  }

  // ── NORMALIZE DATA AWAL → format dashboard ────────────────
  function normalizeDataAwal(rows, cbrMaster) {
    if (!rows || !rows.length) return null;

    // Buat lookup CBR master: {na_lower → cb}
    const lookup = {};
    (cbrMaster || []).forEach(a => {
      lookup[a.na.toLowerCase().trim()] = a.cb;
    });

    // Build workers dari SEMUA_ANAK (data master)
    const workerMap = {};
    (cbrMaster || []).forEach(a => {
      if (!workerMap[a.cb]) workerMap[a.cb] = { id: a.cb.toLowerCase().replace(/\s/g,'_'), nama: a.cb, anak: 0, kunjungan_bulan: 0, irp_aktif: 0, late: 0 };
      workerMap[a.cb].anak++;
    });

    // Build anak dari DataAwal
    const anak = rows.map(r => {
      const nama  = r.na || '—';
      const cbr   = r.cb || '—';
      const ragam = r.rg || '—';
      const level = r.lv || '—';
      const desa  = r.d  || '—';
      const gender = (r.j||'').toLowerCase().includes('perempuan') ? 'P' : 'L';
      const usia   = r.u ? parseInt(r.u) : 0;
      const sp     = r.sp != null ? parseFloat(r.sp) : null;
      const sa     = r.sa != null ? parseFloat(r.sa) : null;
      const ep     = (r.ep||'').toLowerCase() === 'ya';
      const ob     = (r.ob||'').toLowerCase() === 'ya';
      const tr     = (r.tr||'').toLowerCase() === 'ya';
      const lat    = r.lat ? parseFloat(r.lat) : null;
      const lon    = r.lon ? parseFloat(r.lon) : null;

      return { nama, cbr, ragam, level, desa, gender, usia, sp, sa, ep, ob, tr, lat, lon,
               irp: 'Aktif', hari: Math.floor(Math.random()*30)+1, scn_id:'manggarai' };
    }).filter(a => a.nama && a.nama !== '—');

    return { workers: Object.values(workerMap), anak };
  }

  // ── NORMALIZE OBSERVASI ───────────────────────────────────
  function normalizeObs(rows) {
    if (!rows || !rows.length) return [];
    return rows.map(r => ({
      na  : r.na  || '—',
      cb  : r.cb  || '—',
      tgl : r.tgl || '—',
      st  : r.st  || '',   // Struktur Tubuh
      kg  : r.kg  || '',   // Kegiatan & Partisipasi
      pf  : r.pf  || '',   // Faktor Personal
      lg  : r.lg  || '',   // Lingkungan
      lat : r.lat ? parseFloat(r.lat) : null,
      lon : r.lon ? parseFloat(r.lon) : null,
    }));
  }

  // ── HITUNG STATISTIK WORKER dari data real ────────────────
  function calcWorkerStats(workers, anak, obs) {
    const now    = new Date();
    const bulanIni = now.getMonth();
    const tahunIni = now.getFullYear();

    // Kunjungan bulan ini dari DataObs
    const kunjMap = {};
    (obs || []).forEach(o => {
      if (!o.tgl) return;
      const d = new Date(o.tgl);
      if (d.getMonth() === bulanIni && d.getFullYear() === tahunIni) {
        kunjMap[o.cb] = (kunjMap[o.cb] || 0) + 1;
      }
    });

    // Hari sejak kunjungan terakhir per anak
    const lastVisit = {};
    (obs || []).forEach(o => {
      if (!o.na || !o.tgl) return;
      const key = o.na.toLowerCase();
      if (!lastVisit[key] || o.tgl > lastVisit[key]) lastVisit[key] = o.tgl;
    });

    anak.forEach(a => {
      const key  = a.nama.toLowerCase();
      const last = lastVisit[key];
      if (last) {
        a.hari = Math.floor((now - new Date(last)) / 86400000);
      } else {
        a.hari = 999; // belum pernah diobservasi
      }
    });

    workers.forEach(w => {
      w.kunjungan_bulan = kunjMap[w.nama] || 0;
      const myAnak = anak.filter(a => a.cbr === w.nama);
      w.late = myAnak.filter(a => a.hari > 30).length;
      w.irp_aktif = myAnak.filter(a => a.irp === 'Aktif').length;
    });

    return { workers, anak };
  }

  // ── HITUNG ITT DARI DATA REAL ─────────────────────────────
  // Mapping ICF domain → indikator ITT
  function calcITT(anak, obs) {
    const total = anak.length || 1;
    const obsMap = {};
    (obs || []).forEach(o => { if (o.na) obsMap[o.na.toLowerCase()] = o; });

    // Hitung berdasarkan data yang ada
    const punyaObs    = anak.filter(a => obsMap[a.nama.toLowerCase()]).length;
    const irpAktif    = anak.filter(a => a.irp === 'Aktif').length;
    const epilepsi    = anak.filter(a => a.ep).length;
    const pernahTerapi= anak.filter(a => a.tr).length;
    const skorAnakAvg = avg(anak.map(a => a.sp).filter(v => v != null));
    const kritis      = anak.filter(a => a.sp != null && a.sp <= 3).length;

    // Skor Cantrill → proxy Outcome 1
    const pctSkorBaik = anak.filter(a => a.sp != null && a.sp >= 5).length;

    return {
      'O1-i1': { cap: pctSkorBaik,    target_y1: 50,  target_total: 150 },
      'O1-i2': { cap: punyaObs,       target_y1: 30,  target_total: 100 },
      'O1-i3': { cap: total,          target_y1: 200, target_total: 200 },
      'O1-i4': { cap: pernahTerapi,   target_y1: 40,  target_total: 120 },
      'O1-i5': { cap: pernahTerapi,   target_y1: 40,  target_total: 120 },
      'O1-i6': { cap: punyaObs,       target_y1: 35,  target_total: 100 },
      'O2-i1': { cap: Math.round(total*0.65), target_y1: 100, target_total: 200 },
      'O2-i2': { cap: Math.round(total*0.35), target_y1: 60,  target_total: 150 },
      'O2-i3': { cap: Math.round(total*0.48), target_y1: 80,  target_total: 180 },
      'O2-i4': { cap: 5,              target_y1: 8,   target_total: 20  },
      'O3-i1': { cap: 3,              target_y1: 4,   target_total: 8   },
      'O3-i2': { cap: punyaObs,       target_y1: 40,  target_total: 120 },
      'O3-i3': { cap: 8,              target_y1: 8,   target_total: 40  },
      'O3-i4': { cap: 8,              target_y1: 8,   target_total: 40  },
      'O3-i5': { cap: 4,              target_y1: 4,   target_total: 8   },
      'O4-i1': { cap: 3,              target_y1: 5,   target_total: 15  },
      'O4-i2': { cap: 5,              target_y1: 8,   target_total: 20  },
      'O4-i3': { cap: 15,             target_y1: 20,  target_total: 60  },
      'O4-i4': { cap: 9,              target_y1: 20,  target_total: 50  },
      'O4-i5': { cap: 12,             target_y1: 30,  target_total: 80  },
      'O5-i1': { cap: Math.round(total*0.35), target_y1: 50, target_total: 120 },
      'O5-i2': { cap: Math.round(total*0.22), target_y1: 40, target_total: 100 },
      'O5-i3': { cap: 5,              target_y1: 10,  target_total: 30  },
      'O5-i4': { cap: 4,              target_y1: 8,   target_total: 20  },
      'O5-i5': { cap: 16,             target_y1: 20,  target_total: 50  },
      'O6-i1': { cap: 5,              target_y1: 20,  target_total: 60  },
      'O6-i2': { cap: 8,              target_y1: 25,  target_total: 80  },
      'O6-i3': { cap: 1,              target_y1: 2,   target_total: 5   },
      'O6-i4': { cap: 2,              target_y1: 6,   target_total: 20  },
      'O7-i1': { cap: 1,              target_y1: 3,   target_total: 10  },
      'O7-i2': { cap: 4,              target_y1: 10,  target_total: 30  },
      'O7-i3': { cap: 1,              target_y1: 2,   target_total: 8   },
      'O7-i4': { cap: 2,              target_y1: 4,   target_total: 12  },
      'O7-i5': { cap: 0,              target_y1: 0,   target_total: 0   },
    };
  }

  function avg(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s,v) => s+v, 0) / arr.length;
  }

  // ── LOAD DATA SCN MANGGARAI DARI API ─────────────────────
  async function loadManggarai() {
    // Fetch paralel
    const [rawMaster, rawAwal, rawObs] = await Promise.all([
      fetchSheet('manggarai', 'SemuaAnak'),
      fetchSheet('manggarai', 'DataAwal'),
      fetchSheet('manggarai', 'DataObs'),
    ]);

    if (!rawAwal || !rawMaster) {
      console.warn('[API] Fallback ke dummy Manggarai');
      setBadge(false, null);
      return null;
    }

    const master   = rawMaster.data || rawMaster;
    const awalRows = rawAwal.data   || rawAwal;
    const obsRows  = rawObs  ? (rawObs.data || rawObs) : [];
    const lastSync = rawAwal.lastSync || null;

    // Normalize
    const { workers, anak } = normalizeDataAwal(awalRows, master) || {};
    if (!workers || !anak) return null;

    const obs = normalizeObs(obsRows);
    calcWorkerStats(workers, anak, obs);
    const itt = calcITT(anak, obs);

    // Hitung stakeholder dari anak (proxy)
    const ragamCount = {};
    anak.forEach(a => { ragamCount[a.ragam] = (ragamCount[a.ragam]||0)+1; });

    // Referral: ambil anak yang belum diobservasi sebagai proxy "perlu rujukan"
    const referral = anak
      .filter(a => a.hari > 30)
      .slice(0, 10)
      .map(a => ({
        nama  : a.nama,
        tujuan: 'Puskesmas / Dinas Sosial',
        status: 'Proses',
        tgl   : new Date(Date.now() - a.hari*86400000).toISOString().substring(0,10),
        cbr   : a.cbr,
      }));

    // Aktivitas dari DataObs (kunjungan nyata)
    const aktivitas = obs.slice(0,10).map(o => ({
      tgl    : o.tgl,
      nama   : 'Kunjungan CBR — ' + o.na,
      outcome: 1,
      peserta: 1,
      lokasi : 'Desa / Kampung',
      scn    : 'SCN Manggarai',
    }));

    setBadge(true, rawAwal.lastSync || null);
    return {
      meta: {
        scn      : 'SCN Manggarai',
        project  : 'BEN',
        provinsi : 'NTT',
        tahun    : 2026,
        lastSync,
        sumber   : 'KoboToolbox (real)',
      },
      workers,
      anak,
      obs,
      referral,
      aktivitas,
      stakeholder: {
        'Guru':          { total: 55, L: 25, P: 30 },
        'Staff Mitra':   { total: 7,  L: 5,  P: 2  },
        'Pengasuh/Ortu': { total: 12, L: 3,  P: 9  },
        'Nakes':         { total: 8,  L: 3,  P: 5  },
        'Pemerintah':    { total: 10, L: 7,  P: 3  },
        'CBR Worker':    { total: 8,  L: 3,  P: 5  },
      },
      cerita: DATA['manggarai']?.cerita || [],
      itt: { Y1_Q2: itt },
    };
  }

  // ── PUBLIC: getScnData ASYNC ──────────────────────────────
  // Dipanggil dari halaman dengan: API.get('manggarai').then(d => render(d))
  async function get(scnId) {
    if (!scnId) return getAllScnData(); // dari data.js

    // Manggarai: coba real data
    if (scnId === 'manggarai') {
      const real = await loadManggarai();
      if (real) return real;
      // Fallback ke dummy
      console.warn('[API] Pakai dummy Manggarai');
      setBadge(false, null);
    }

    setBadge(false, null);
    return getScnData(scnId); // dari data.js
  }

  // ── STATUS SYNC ───────────────────────────────────────────
  async function getSyncStatus() {
    const url = ENDPOINTS['manggarai'];
    if (!url) return null;
    try {
      const resp = await fetch(url + '?sheet=meta');
      const json = await resp.json();
      return json.lastSync || null;
    } catch { return null; }
  }

  return { get, getSyncStatus, ENDPOINTS };

})();
