// ============================================================
//  mel.js — Dashboard MEL
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const session = AUTH.requireAuth();
  if (!session) return;

  document.getElementById('user-name').textContent   = session.username.toUpperCase();
  document.getElementById('user-role').textContent   = session.role === 'superadmin' ? 'Super Admin' : 'SCN Admin';
  document.getElementById('user-avatar').textContent = session.username.charAt(0).toUpperCase();
  AUTH.applyScnLabel('#scn-label');
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  AUTH.renderScnSwitcher('#scn-switcher-wrap', (scnId) => loadData(scnId));

  // ----------------------------------------------------------
  // DATA DUMMY BEN Manggarai
  // Nanti: fetch dari Google Sheets MEL Officer input
  // ----------------------------------------------------------
  const DUMMY = {
    manggarai: {
      output: [
        { label: 'Jumlah Beneficiary',   nilai: 200, target: 200, satuan: 'anak'      },
        { label: 'Home Visit',            nilai: 144, target: 160, satuan: 'kunjungan' },
        { label: 'Referral',              nilai: 28,  target: 40,  satuan: 'kasus'     },
        { label: 'Training',              nilai: 6,   target: 8,   satuan: 'sesi'      },
        { label: 'Group Session',         nilai: 12,  target: 16,  satuan: 'sesi'      },
      ],
      outcome1: {
        judul: 'Perkembangan Anak',
        indikator: [
          { label: 'Anak dengan peningkatan kemampuan motorik',    capaian: 78,  target: 80  },
          { label: 'Anak dengan peningkatan kemampuan komunikasi', capaian: 65,  target: 70  },
          { label: 'Anak dengan IRP selesai',                      capaian: 35,  target: 50  },
          { label: 'Anak yang direferral ke layanan',              capaian: 28,  target: 40  },
        ]
      },
      outcome2: {
        judul: 'Enabling Environment',
        indikator: [
          { label: 'Keluarga yang memahami hak disabilitas anak',  capaian: 120, target: 150 },
          { label: 'Stakeholder yang terlibat aktif',              capaian: 45,  target: 63  },
          { label: 'Desa dengan kebijakan inklusif',               capaian: 4,   target: 8   },
        ]
      },
      outcome3: {
        judul: 'DPO & Komunitas',
        indikator: [
          { label: 'Anggota DPO aktif',                            capaian: 32,  target: 40  },
          { label: 'Kegiatan DPO yang terlaksana',                 capaian: 8,   target: 12  },
          { label: 'Komunitas yang mengenal program CBR',          capaian: 15,  target: 20  },
        ]
      },
      cerita: [
        {
          nama    : 'Yohanes, 8 Tahun',
          scn     : 'SCN Manggarai',
          narasi  : 'Sebelum program, Yohanes tidak bisa duduk sendiri. Setelah 6 bulan pendampingan intensif oleh CBR worker, ia kini mampu duduk mandiri dan mulai merespons panggilan namanya.',
          tanggal : 'Mei 2025'
        },
        {
          nama    : 'Keluarga Maria, Desa Wae Rebo',
          scn     : 'SCN Manggarai',
          narasi  : 'Orang tua Maria awalnya menyembunyikan anaknya karena malu. Melalui sesi edukasi bersama CBR worker dan pastor desa, keluarga kini aktif membawa Maria ke kegiatan komunitas.',
          tanggal : 'April 2025'
        },
      ]
    }
  };

  function pctColor(capaian, target) {
    const pct = Math.min((capaian / target) * 100, 100);
    if (pct >= 90) return 'var(--success)';
    if (pct >= 60) return 'var(--primary-500)';
    if (pct >= 30) return 'var(--warning)';
    return 'var(--danger)';
  }

  function renderOutcome(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="outcome-card">
        ${data.indikator.map(ind => {
          const pct  = Math.min(Math.round((ind.capaian / ind.target) * 100), 100);
          const col  = pctColor(ind.capaian, ind.target);
          return `
            <div class="outcome-indicator">
              <div class="indicator-label">${ind.label}</div>
              <div class="indicator-nums">
                <div class="progress-bar-wrap" style="width:80px">
                  <div class="progress-bar-fill" style="width:${pct}%;background:${col}"></div>
                </div>
                <span class="num-actual" style="color:${col}">${ind.capaian}</span>
                <span class="num-target">/ ${ind.target}</span>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function loadData(scnId) {
    const key  = scnId || 'manggarai';
    const data = DUMMY[key] || DUMMY['manggarai'];

    // Output
    document.getElementById('output-grid').innerHTML = data.output.map(o => {
      const pct = Math.min(Math.round((o.nilai / o.target) * 100), 100);
      const col = pctColor(o.nilai, o.target);
      return `
        <div class="stat-card">
          <div class="stat-label">${o.label}</div>
          <div class="stat-value" style="color:${col}">${o.nilai}</div>
          <div class="stat-sub">Target: ${o.target} ${o.satuan}</div>
          <div class="progress-bar-wrap" style="margin-top:8px">
            <div class="progress-bar-fill" style="width:${pct}%;background:${col}"></div>
          </div>
        </div>`;
    }).join('');

    renderOutcome(data.outcome1, 'outcome-1');
    renderOutcome(data.outcome2, 'outcome-2');
    renderOutcome(data.outcome3, 'outcome-3');

    document.getElementById('cerita-grid').innerHTML = data.cerita.map(c => `
      <div class="cerita-item">
        <strong>${c.nama}</strong>
        <p>${c.narasi}</p>
        <div class="cerita-meta">${c.scn} &bull; ${c.tanggal}</div>
      </div>`).join('');
  }

  loadData(AUTH.getScnFilter());
});
