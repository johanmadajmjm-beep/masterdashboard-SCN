// ============================================================
//  api-ben.js — Koneksi ke Apps Script BEN Uploader
//  Cache: sessionStorage + lastSync detection
//  Loading hanya terjadi saat data di server benar-benar berubah
// ============================================================

const API_BEN = (() => {

  const GAS_URL  = 'https://script.google.com/macros/s/AKfycbySgjqTdWKZHAfk7kvalzBCXZBULfBYq7DnuylvIPXRhR9uc5II9dTbWLOvvtc8FZw2/exec';
  const SS_PREFIX = 'ben_api_';

  // ── SESSION STORAGE ───────────────────────────────────────
  function ssGet(key){
    try{ const r=sessionStorage.getItem(SS_PREFIX+key); return r?JSON.parse(r):null; }
    catch(e){ return null; }
  }
  function ssSet(key, value){
    try{ sessionStorage.setItem(SS_PREFIX+key, JSON.stringify(value)); }catch(e){}
  }
  function ssDel(key){
    try{ sessionStorage.removeItem(SS_PREFIX+key); }catch(e){}
  }
  function ssDelPrefix(prefix){
    try{
      Object.keys(sessionStorage)
        .filter(k=>k.startsWith(SS_PREFIX+prefix))
        .forEach(k=>sessionStorage.removeItem(k));
    }catch(e){}
  }
  function ssDelAll(){
    try{
      Object.keys(sessionStorage)
        .filter(k=>k.startsWith(SS_PREFIX))
        .forEach(k=>sessionStorage.removeItem(k));
    }catch(e){}
  }

  // ── FETCH LAST SYNC (ringan) ──────────────────────────────
  async function fetchLastSync(){
    try{
      const r = await fetch(`${GAS_URL}?sheet=meta&token=${(typeof AUTH!=='undefined'&&AUTH.getToken)?AUTH.getToken()||'':''}`);
      if(!r.ok) return null;
      const j = await r.json();
      return j.lastSync||null;
    }catch(e){
      console.warn('[API-BEN] Gagal cek lastSync:', e.message);
      return null;
    }
  }

  // ── FETCH SHEET DARI SERVER ───────────────────────────────
  async function fetchFromServer(sheet, scnId){
    const url = scnId
      ? `${GAS_URL}?sheet=${sheet}&scn=${scnId}&token=${token}`
      : `${GAS_URL}?sheet=${sheet}&token=${token}`;
    try{
      const r = await fetch(url);
      if(!r.ok) throw new Error('HTTP '+r.status);
      const j = await r.json();
      return j;
    }catch(e){
      console.warn(`[API-BEN] Gagal fetch ${sheet}:`, e.message);
      return null;
    }
  }

  // ── CACHE KEY ─────────────────────────────────────────────
  function cacheKey(sheet, scnId){
    return (scnId||'all')+'_'+sheet;
  }

  // ── GET DATA (cache-first) ────────────────────────────────
  async function get(sheet, scnId){
    const key    = cacheKey(sheet, scnId);
    const cached = ssGet(key);

    if(cached){
      // Ada cache — render dari cache dulu (instan)
      // Cek lastSync di background
      _refreshIfNew(sheet, scnId, key, cached.lastSync);
      return cached.data || [];
    }

    // Tidak ada cache — fetch penuh dari server
    const json = await fetchFromServer(sheet, scnId);
    if(!json) return [];

    const data     = json.data || [];
    const lastSync = json.lastSync || null;
    ssSet(key, { data, lastSync });
    return data;
  }

  // ── BACKGROUND REFRESH ────────────────────────────────────
  async function _refreshIfNew(sheet, scnId, key, cachedLastSync){
    try{
      const serverLastSync = await fetchLastSync();
      if(!serverLastSync || serverLastSync === cachedLastSync) return;
      // Ada data baru — fetch ulang
      const json = await fetchFromServer(sheet, scnId);
      if(!json) return;
      const data = json.data||[];
      ssSet(key, { data, lastSync: serverLastSync });
      // Re-render halaman aktif jika tersedia
      if(typeof window.renderPageBEN === 'function'){
        window.renderPageBEN(sheet, data);
        console.log('[API-BEN] Data baru terdeteksi, halaman di-refresh otomatis');
      }
    }catch(e){
      // Gagal refresh background — tidak masalah, tetap pakai cache
    }
  }

  // ── CLEAR CACHE ───────────────────────────────────────────
  function clearCache(scnId){
    if(scnId){
      ssDelPrefix(scnId+'_');
    } else {
      ssDelAll();
    }
  }

  // ── PRELOAD (background fetch saat sidebar load) ──────────
  function preload(scnId){
    setTimeout(()=>{
      get('stakeholder', scnId).catch(()=>{});
      get('monthly', scnId).catch(()=>{});
    }, 400);
  }

  return { get, clearCache, preload };

})();
