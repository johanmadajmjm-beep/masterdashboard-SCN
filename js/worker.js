// ============================================================
//  worker.js — Dashboard CBR Worker
//  Data dummy BEN Manggarai (nanti diganti fetch API)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. AUTH CHECK — harus login dulu
  // ----------------------------------------------------------
  const session = AUTH.requireAuth();
  if (!session) return;

  // ----------------------------------------------------------
  // 2. RENDER INFO SESSION DI SIDEBAR & TOPBAR
  // ----------------------------------------------------------
  document.getElementById('user-name').textContent  = session.username.toUpperCase();
  document.getElementById('user-role').textContent  = session.role === 'superadmin' ? 'Super Admin' : 'SCN Admin';
  document.getElementById('user-avatar').textContent = session.username.charAt(0).toUpperCase();
  AUTH.applyScnLabel('#scn-label');

  // Tanggal
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // SCN Switcher untuk superadmin
  AUTH.renderScnSwitcher('#scn-switcher-wrap', (scnId) => {
    loadData(scnId);
  });

  // ----------------------------------------------------------
  // 3. DATA DUMMY — BEN Manggarai
  //    Nanti diganti dengan fetch ke Apps Script
  // ----------------------------------------------------------
  const DUMMY_DATA = {
    manggarai: {
      cbr_workers: [
        { id: 'elfrida',    nama: 'Elfrida Suryati',       jumlah_anak: 8 },
        { id: 'jack',       nama: 'Jack Roka',              jumlah_anak: 24 },
        { id: 'laurens',   nama: 'Laurensius Herbianto',    jumlah_anak: 41 },
        { id: 'leonardus', nama: 'Leonardus M. Mawardi',   jumlah_anak: 26 },
        { id: 'magdalena', nama: 'Magdalena Sabe',          jumlah_anak: 30 },
        { id: 'diana',     nama: 'Maria Diana Banut',       jumlah_anak: 20 },
        { id: 'miseldis',  nama: 'Miseldis Halmida',        jumlah_anak: 28 },
        { id: 'stanis',    nama: 'Stanis J. Ngalu',         jumlah_anak: 23 },
      ],
      anak: [
        { nama: 'Yohanes Deki',    cbr: 'Jack Roka',       ragam: 'Fisik',          irp: 'Aktif',   kunjungan_terakhir: 3 },
        { nama: 'Maria Leni',      cbr: 'Jack Roka',       ragam: 'Intelektual',    irp: 'Aktif',   kunjungan_terakhir: 7 },
        { nama: 'Petrus Aldi',     cbr: 'Jack Roka',       ragam: 'Wicara',         irp: 'Selesai', kunjungan_terakhir: 35 },
        { nama: 'Agustina Rena',   cbr: 'Jack Roka',       ragam: 'Netra',          irp: 'Aktif',   kunjungan_terakhir: 12 },
        { nama: 'Florianus Tedo',  cbr: 'Jack Roka',       ragam: 'Fisik',          irp: 'Belum',   kunjungan_terakhir: 42 },
        { nama: 'Theresia Wela',   cbr: 'Magdalena Sabe',  ragam: 'Intelektual',    irp: 'Aktif',   kunjungan_terakhir: 5 },
        { nama: 'Benediktus Ema',  cbr: 'Magdalena Sabe',  ragam: 'Fisik',          irp: 'Aktif',   kunjungan_terakhir: 15 },
        { nama: 'Katarina Seli',   cbr: 'Magdalena Sabe',  ragam: 'Rungu',          irp: 'Belum',   kunjungan_terakhir: 38 },
      ],
      referral: [
        { nama: 'Yohanes Deki',   tujuan: 'Puskesmas Langke Rembong', status: 'Proses',  tanggal: '2025-05-10' },
        { nama: 'Maria Leni',     tujuan: 'RS Umum Ruteng',           status: 'Selesai', tanggal: '2025-04-22' },
        { nama: 'Florianus Tedo', tujuan: 'Dinas Sosial Manggarai',   status: 'Proses',  tanggal: '2025-05-18' },
      ],
      kunjungan_bulan_ini: 18,
    }
  };

  // ----------------------------------------------------------
  // 4. LOAD DATA berdasarkan SCN
  // ----------------------------------------------------------
  function loadData(scnId) {
    // Kalau superadmin & pilih "Semua" → tampilkan agregat
    // Sementara dummy: default ke manggarai
    const key  = scnId || 'manggarai';
    const data = DUMMY_DATA[key] || DUMMY_DATA['manggarai'];

    renderStats(data);
    renderListAnak(data.anak);
    renderAlerts(data.anak);
    renderReferral(data.referral);
  }

  // ----------------------------------------------------------
  // 5. RENDER STAT CARDS
  // ----------------------------------------------------------
  function renderStats(data) {
    const totalAnak   = data.anak.length;
    const irpAktif    = data.anak.filter(a => a.irp === 'Aktif').length;
    const followUp    = data.anak.filter(a => a.kunjungan_terakhir > 30).length;

    document.getElementById('stat-total').textContent     = totalAnak;
    document.getElementById('stat-kunjungan').textContent = data.kunjungan_bulan_ini;
    document.getElementById('stat-irp').textContent       = irpAktif;
    document.getElementById('stat-followup').textContent  = followUp;
    document.getElementById('badge-total-anak').textContent = `${totalAnak} anak`;
  }

  // ----------------------------------------------------------
  // 6. RENDER LIST ANAK
  // ----------------------------------------------------------
  function renderListAnak(anak) {
    const container = document.getElementById('list-anak');
    if (!anak.length) {
      container.innerHTML = '<p style="color:var(--gray-400);font-size:var(--text-sm)">Tidak ada data anak.</p>';
      return;
    }

    container.innerHTML = anak.map(a => {
      const badgeClass = a.irp === 'Aktif' ? 'badge-success'
                        : a.irp === 'Selesai' ? 'badge-neutral'
                        : 'badge-warning';
      const telat = a.kunjungan_terakhir > 30
        ? `<span style="color:var(--danger);font-size:var(--text-xs)">⚠ ${a.kunjungan_terakhir} hari lalu</span>`
        : `<span style="color:var(--gray-400);font-size:var(--text-xs)">${a.kunjungan_terakhir} hari lalu</span>`;

      return `
        <div class="child-list-item">
          <div>
            <div class="child-name">${a.nama}</div>
            <div class="child-meta">${a.ragam} &bull; ${a.cbr} &bull; Kunjungan: ${telat}</div>
          </div>
          <span class="badge ${badgeClass}">IRP ${a.irp}</span>
        </div>`;
    }).join('');
  }

  // ----------------------------------------------------------
  // 7. RENDER ALERTS
  // ----------------------------------------------------------
  function renderAlerts(anak) {
    const container = document.getElementById('list-alerts');
    const belum     = anak.filter(a => a.kunjungan_terakhir > 30);

    if (!belum.length) {
      container.innerHTML = '<p style="color:var(--gray-400);font-size:var(--text-sm)">✓ Semua anak sudah dikunjungi dalam 30 hari terakhir.</p>';
      return;
    }

    container.innerHTML = belum.map(a => `
      <div class="alert-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div class="alert-text">
          <strong>${a.nama}</strong>
          Belum dikunjungi selama <b>${a.kunjungan_terakhir} hari</b> — ${a.ragam}
        </div>
      </div>`).join('');
  }

  // ----------------------------------------------------------
  // 8. RENDER REFERRAL
  // ----------------------------------------------------------
  function renderReferral(referral) {
    const container = document.getElementById('list-referral');
    const aktif     = referral.filter(r => r.status === 'Proses');
    document.getElementById('badge-referral').textContent = `${aktif.length} aktif`;

    if (!referral.length) {
      container.innerHTML = '<p style="color:var(--gray-400);font-size:var(--text-sm)">Tidak ada referral.</p>';
      return;
    }

    container.innerHTML = referral.map(r => {
      const badge = r.status === 'Proses'
        ? '<span class="badge badge-warning">Proses</span>'
        : '<span class="badge badge-success">Selesai</span>';
      return `
        <div class="referral-item">
          <div>
            <div style="font-weight:600">${r.nama}</div>
            <div style="color:var(--gray-500);font-size:var(--text-xs)">${r.tujuan}</div>
          </div>
          ${badge}
        </div>`;
    }).join('');
  }

  // ----------------------------------------------------------
  // INISIALISASI
  // ----------------------------------------------------------
  loadData(AUTH.getScnFilter());

});
