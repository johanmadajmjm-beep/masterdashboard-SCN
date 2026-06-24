// ============================================================
//  coordinator.js — Dashboard CBR Coordinator
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const session = AUTH.requireAuth();
  if (!session) return;

  document.getElementById('user-name').textContent  = session.username.toUpperCase();
  document.getElementById('user-role').textContent  = session.role === 'superadmin' ? 'Super Admin' : 'SCN Admin';
  document.getElementById('user-avatar').textContent = session.username.charAt(0).toUpperCase();
  AUTH.applyScnLabel('#scn-label');
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  AUTH.renderScnSwitcher('#scn-switcher-wrap', (scnId) => loadData(scnId));

  // ----------------------------------------------------------
  // DATA DUMMY BEN Manggarai
  // ----------------------------------------------------------
  const DUMMY = {
    manggarai: {
      workers: [
        { nama: 'Elfrida Suryati',      anak: 8,  kunjungan: 6  },
        { nama: 'Jack Roka',            anak: 24, kunjungan: 18 },
        { nama: 'Laurensius Herbianto', anak: 41, kunjungan: 30 },
        { nama: 'Leonardus M. Mawardi', anak: 26, kunjungan: 20 },
        { nama: 'Magdalena Sabe',       anak: 30, kunjungan: 22 },
        { nama: 'Maria Diana Banut',    anak: 20, kunjungan: 14 },
        { nama: 'Miseldis Halmida',     anak: 28, kunjungan: 19 },
        { nama: 'Stanis J. Ngalu',      anak: 23, kunjungan: 15 },
      ],
      irp: { belum: 45, berjalan: 120, selesai: 35 },
      ragam: [
        { label: 'Fisik',       jumlah: 68 },
        { label: 'Intelektual', jumlah: 52 },
        { label: 'Wicara',      jumlah: 35 },
        { label: 'Rungu',       jumlah: 24 },
        { label: 'Netra',       jumlah: 12 },
        { label: 'Ganda',       jumlah: 9  },
      ],
      terlambat: [
        { nama: 'Florianus Tedo',  cbr: 'Jack Roka',      hari: 42 },
        { nama: 'Katarina Seli',   cbr: 'Magdalena Sabe', hari: 38 },
        { nama: 'Petrus Aldi',     cbr: 'Jack Roka',      hari: 35 },
      ],
    }
  };

  function loadData(scnId) {
    const key  = scnId || 'manggarai';
    const data = DUMMY[key] || DUMMY['manggarai'];
    const totalAnak = data.workers.reduce((s, w) => s + w.anak, 0);

    document.getElementById('stat-total').textContent    = totalAnak;
    document.getElementById('stat-aktif').textContent    = data.irp.berjalan;
    document.getElementById('stat-terlambat').textContent= data.terlambat.length;
    document.getElementById('stat-worker').textContent   = data.workers.length;
    document.getElementById('badge-terlambat').textContent = `${data.terlambat.length} anak`;

    // Worker visit
    const maxKunjungan = Math.max(...data.workers.map(w => w.kunjungan));
    document.getElementById('list-worker-visit').innerHTML = data.workers.map(w => {
      const pct = Math.round((w.kunjungan / w.anak) * 100);
      return `
        <div class="worker-row">
          <div class="worker-info">
            <div class="worker-name">${w.nama}</div>
            <div class="worker-stats">${w.kunjungan} kunjungan / ${w.anak} anak</div>
          </div>
          <div class="worker-progress">
            <div class="progress-label"><span>${pct}%</span></div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </div>`;
    }).join('');

    // IRP
    const totalIRP = data.irp.belum + data.irp.berjalan + data.irp.selesai;
    const irpItems = [
      { label: 'Belum Mulai',  val: data.irp.belum,    cls: 'badge-warning' },
      { label: 'Berjalan',     val: data.irp.berjalan,  cls: 'badge-info'    },
      { label: 'Selesai',      val: data.irp.selesai,   cls: 'badge-success' },
    ];
    document.getElementById('list-irp').innerHTML = irpItems.map(item => {
      const pct = Math.round((item.val / totalIRP) * 100);
      return `
        <div class="irp-row">
          <span>${item.label}</span>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="progress-bar-wrap" style="width:100px">
              <div class="progress-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="badge ${item.cls}" style="min-width:28px;justify-content:center">${item.val}</span>
          </div>
        </div>`;
    }).join('');

    // Ragam
    const maxRagam = Math.max(...data.ragam.map(r => r.jumlah));
    document.getElementById('list-ragam').innerHTML = data.ragam.map(r => {
      const pct = Math.round((r.jumlah / totalAnak) * 100);
      return `
        <div class="irp-row">
          <span>${r.label}</span>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="progress-bar-wrap" style="width:100px">
              <div class="progress-bar-fill" style="width:${Math.round((r.jumlah/maxRagam)*100)}%;background:var(--accent-500)"></div>
            </div>
            <span style="font-family:var(--font-mono);font-size:var(--text-sm);min-width:28px;text-align:right">${r.jumlah}</span>
          </div>
        </div>`;
    }).join('');

    // Terlambat
    document.getElementById('list-terlambat').innerHTML = data.terlambat.length
      ? data.terlambat.map(t => `
          <div class="irp-row">
            <div>
              <div style="font-weight:600">${t.nama}</div>
              <div style="font-size:var(--text-xs);color:var(--gray-500)">${t.cbr}</div>
            </div>
            <span class="badge badge-danger">${t.hari} hari</span>
          </div>`).join('')
      : '<p style="color:var(--gray-400);font-size:var(--text-sm)">✓ Semua anak sudah dikunjungi.</p>';
  }

  loadData(AUTH.getScnFilter());
});
