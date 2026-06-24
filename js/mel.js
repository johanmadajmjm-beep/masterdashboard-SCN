// ============================================================
//  mel.js — Dashboard MEL
//  Berdasarkan ITT NLR Indonesia (7 Outcome, 3 Tahun)
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
  // STATE — periode aktif dan SCN aktif
  // ----------------------------------------------------------
  let activeYear    = 'Y1';
  let activeQuarter = 'Q1';
  let activeScn     = AUTH.getScnFilter() || 'manggarai';

  // ----------------------------------------------------------
  // DATA ITT — 7 Outcome, berbasis struktur ITT asli
  // Dummy data Manggarai / Year 1 2026
  // Format: { id, kode, label_pendek, label_io, indikator[] }
  // Indikator: { id, kode_lf, label, jenis, target_total,
  //              target_Y1, Q1, Q2, Q3, Q4 }
  // ----------------------------------------------------------
  const ITT = {
    manggarai: {
      meta: { scn: 'SCN Manggarai', project: 'BEN', tahun_mulai: 2026 },
      outcomes: [

        // ── OUTCOME 1 ──────────────────────────────────────
        {
          id: 'O1', warna: '#1264c0',
          label: 'Outcome 1',
          label_pendek: 'CYWD Berdaya',
          deskripsi: 'Anak dan remaja dengan disabilitas berdaya, percaya diri, dan mampu mengambil keputusan atas kesejahteraan mereka.',
          indikator: [
            { id:'O1-i1', kode:'O5.1', jenis:'Standard LF',
              label:'Jumlah CYWD yang melaporkan peningkatan rasa kendali & pengambilan keputusan',
              target_total:150, target_Y1:50, Q1:8, Q2:14, Q3:0, Q4:0 },
            { id:'O1-i2', kode:'O5.2', jenis:'Standard LF',
              label:'Jumlah CYWD yang memiliki peran aktif di komunitas',
              target_total:100, target_Y1:30, Q1:5, Q2:10, Q3:0, Q4:0 },
            { id:'O1-i3', kode:'IOA.1', jenis:'Standard LF',
              label:'Jumlah CYWD yang menerima layanan rehabilitasi sesuai IRP',
              target_total:200, target_Y1:200, Q1:180, Q2:195, Q3:0, Q4:0 },
            { id:'O1-i4', kode:'IOD.1', jenis:'Standard LF',
              label:'Jumlah CYWD yang memiliki keterampilan menyampaikan keinginan secara efektif',
              target_total:120, target_Y1:40, Q1:12, Q2:20, Q3:0, Q4:0 },
            { id:'O1-i5', kode:'IOD.2', jenis:'Standard LF',
              label:'Jumlah CYWD yang mengetahui hak mereka (termasuk HKSR)',
              target_total:120, target_Y1:40, Q1:10, Q2:18, Q3:0, Q4:0 },
            { id:'O1-i6', kode:'IOE.1', jenis:'Standard LF',
              label:'Jumlah CYWD yang berpartisipasi dalam kehidupan keluarga & komunitas',
              target_total:100, target_Y1:35, Q1:20, Q2:28, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 2 ──────────────────────────────────────
        {
          id: 'O2', warna: '#10998a',
          label: 'Outcome 2',
          label_pendek: 'Keluarga & Komunitas',
          deskripsi: 'Keluarga dan komunitas secara aktif mendukung dan mengadvokasi hak serta kebutuhan CYWD.',
          indikator: [
            { id:'O2-i1', kode:'IOC.1', jenis:'Standard LF',
              label:'Jumlah orang tua/pengasuh dengan peningkatan kapasitas mendukung CYWD',
              target_total:200, target_Y1:100, Q1:40, Q2:65, Q3:0, Q4:0 },
            { id:'O2-i2', kode:'Custom', jenis:'Custom',
              label:'Jumlah keluarga yang mengakses layanan rehabilitasi tanpa stigma',
              target_total:150, target_Y1:60, Q1:18, Q2:35, Q3:0, Q4:0 },
            { id:'O2-i3', kode:'Custom', jenis:'Custom',
              label:'Jumlah CYWD dengan dokumen kependudukan lengkap & aktif di perlindungan sosial',
              target_total:180, target_Y1:80, Q1:25, Q2:48, Q3:0, Q4:0 },
            { id:'O2-i4', kode:'Custom', jenis:'Custom',
              label:'Jumlah kelompok keluarga/orang tua aktif di tingkat desa/kecamatan',
              target_total:20, target_Y1:8, Q1:2, Q2:5, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 3 ──────────────────────────────────────
        {
          id: 'O3', warna: '#d97706',
          label: 'Outcome 3',
          label_pendek: 'DPO & CBR',
          deskripsi: 'DPO kuat, secara aktif memimpin gerakan CBR/RBM dengan melibatkan tokoh masyarakat dan struktur desa.',
          indikator: [
            { id:'O3-i1', kode:'Custom', jenis:'Custom',
              label:'Jumlah DPO/CSO yang mempekerjakan penyandang disabilitas dalam peran kepemimpinan',
              target_total:8, target_Y1:4, Q1:2, Q2:3, Q3:0, Q4:0 },
            { id:'O3-i2', kode:'IOB.1', jenis:'Standard LF',
              label:'Jumlah rujukan efektif oleh jejaring berbasis komunitas kepada mitra & penyedia layanan',
              target_total:120, target_Y1:40, Q1:10, Q2:18, Q3:0, Q4:0 },
            { id:'O3-i3', kode:'IOB.2', jenis:'Standard LF',
              label:'Jumlah pekerja CBR/CBID yang memberikan dukungan langsung kepada CYWD',
              target_total:40, target_Y1:8, Q1:8, Q2:8, Q3:0, Q4:0 },
            { id:'O3-i4', kode:'IOA.2', jenis:'Standard LF',
              label:'Jumlah pekerja CBR yang merasa percaya diri dalam memberikan perawatan memadai',
              target_total:40, target_Y1:8, Q1:6, Q2:8, Q3:0, Q4:0 },
            { id:'O3-i5', kode:'Custom', jenis:'Custom',
              label:'Jumlah DPO aktif berkolaborasi dengan penyedia layanan dalam sistem rujukan',
              target_total:8, target_Y1:4, Q1:2, Q2:4, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 4 ──────────────────────────────────────
        {
          id: 'O4', warna: '#7c3aed',
          label: 'Outcome 4',
          label_pendek: 'Layanan Kesehatan',
          deskripsi: 'Penyedia layanan kesehatan memastikan layanan benar-benar dapat diakses, termasuk KSR dan alat bantu bagi CYWD.',
          indikator: [
            { id:'O4-i1', kode:'O1.2', jenis:'Standard LF',
              label:'Jumlah penyedia layanan kesehatan yang meningkatkan fasilitas agar aksesibel',
              target_total:15, target_Y1:5, Q1:1, Q2:3, Q3:0, Q4:0 },
            { id:'O4-i2', kode:'Custom', jenis:'Custom',
              label:'Jumlah penyedia layanan yang meningkatkan layanan inklusif (pengetahuan, sikap, keterampilan)',
              target_total:20, target_Y1:8, Q1:2, Q2:5, Q3:0, Q4:0 },
            { id:'O4-i3', kode:'Custom', jenis:'Custom',
              label:'Jumlah tenaga kesehatan yang dilatih layanan KSR inklusif & sensitif disabilitas',
              target_total:60, target_Y1:20, Q1:8, Q2:15, Q3:0, Q4:0 },
            { id:'O4-i4', kode:'Custom', jenis:'Custom',
              label:'Jumlah kasus kusta yang diidentifikasi dan diobati di tingkat komunitas',
              target_total:50, target_Y1:20, Q1:4, Q2:9, Q3:0, Q4:0 },
            { id:'O4-i5', kode:'IOD.3', jenis:'Standard LF',
              label:'Jumlah CYWD yang memanfaatkan layanan KSR secara efektif',
              target_total:80, target_Y1:30, Q1:5, Q2:12, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 5 ──────────────────────────────────────
        {
          id: 'O5', warna: '#059669',
          label: 'Outcome 5',
          label_pendek: 'Pendidikan Inklusif',
          deskripsi: 'Aktor pendidikan menciptakan lingkungan belajar inklusif, aman, dan suportif bagi CYWD.',
          indikator: [
            { id:'O5-i1', kode:'Custom', jenis:'Custom',
              label:'Jumlah CYWD yang terdaftar di program pendidikan inklusif dengan dukungan sesuai',
              target_total:120, target_Y1:50, Q1:20, Q2:35, Q3:0, Q4:0 },
            { id:'O5-i2', kode:'O2.1', jenis:'Standard LF',
              label:'Jumlah CYWD yang menunjukkan kemajuan sesuai potensi (rencana pembelajaran individual)',
              target_total:100, target_Y1:40, Q1:10, Q2:22, Q3:0, Q4:0 },
            { id:'O5-i3', kode:'O2.2', jenis:'Standard LF',
              label:'Jumlah sekolah dengan peningkatan kualitas pengajaran & lingkungan sekolah',
              target_total:30, target_Y1:10, Q1:2, Q2:5, Q3:0, Q4:0 },
            { id:'O5-i4', kode:'Custom', jenis:'Custom',
              label:'Jumlah sekolah yang mengajukan proposal aksesibilitas ke pemerintah',
              target_total:20, target_Y1:8, Q1:1, Q2:4, Q3:0, Q4:0 },
            { id:'O5-i5', kode:'Custom', jenis:'Custom',
              label:'Jumlah guru PAUD dengan peningkatan pengetahuan identifikasi dini disabilitas',
              target_total:50, target_Y1:20, Q1:8, Q2:16, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 6 ──────────────────────────────────────
        {
          id: 'O6', warna: '#dc2626',
          label: 'Outcome 6',
          label_pendek: 'Pemberdayaan Ekonomi',
          deskripsi: 'Penyedia pelatihan, pemberi kerja, dan otoritas lokal mendukung pemberdayaan ekonomi CYWD dan pengasuh.',
          indikator: [
            { id:'O6-i1', kode:'O3.1', jenis:'Standard LF',
              label:'Jumlah YwD yang berpartisipasi dalam pasar tenaga kerja',
              target_total:60, target_Y1:20, Q1:0, Q2:5, Q3:0, Q4:0 },
            { id:'O6-i2', kode:'IOC.2', jenis:'Standard LF',
              label:'Jumlah orang tua/pengasuh dengan peningkatan pendapatan',
              target_total:80, target_Y1:25, Q1:0, Q2:8, Q3:0, Q4:0 },
            { id:'O6-i3', kode:'Custom', jenis:'Custom',
              label:'Jumlah pusat pelatihan vokasional yang menerapkan model inklusif & fleksibel',
              target_total:5, target_Y1:2, Q1:0, Q2:1, Q3:0, Q4:0 },
            { id:'O6-i4', kode:'O3.2', jenis:'Standard LF',
              label:'Jumlah bisnis/tempat kerja yang meningkatkan prosedur lingkungan kerja inklusif',
              target_total:20, target_Y1:6, Q1:0, Q2:2, Q3:0, Q4:0 },
          ]
        },

        // ── OUTCOME 7 ──────────────────────────────────────
        {
          id: 'O7', warna: '#0284c7',
          label: 'Outcome 7',
          label_pendek: 'Kebijakan & Advokasi',
          deskripsi: 'Institusi pemerintah secara konsisten mengembangkan, mengimplementasikan, dan memonitor kebijakan inklusif.',
          indikator: [
            { id:'O7-i1', kode:'Custom', jenis:'Custom',
              label:'Jumlah kebijakan inklusif yang diadopsi, diimplementasikan & dimonitor bersama DPO/CYWD',
              target_total:10, target_Y1:3, Q1:0, Q2:1, Q3:0, Q4:0 },
            { id:'O7-i2', kode:'IOF.1', jenis:'Standard LF',
              label:'Jumlah aksi lobi dan advokasi oleh DPO/NGO yang memengaruhi kebijakan inklusi',
              target_total:30, target_Y1:10, Q1:2, Q2:4, Q3:0, Q4:0 },
            { id:'O7-i3', kode:'Custom', jenis:'Custom',
              label:'Jumlah kebijakan/hukum yang diharmonisasi dengan kerangka inklusif',
              target_total:8, target_Y1:2, Q1:0, Q2:1, Q3:0, Q4:0 },
            { id:'O7-i4', kode:'Custom', jenis:'Custom',
              label:'Jumlah proses konsultasi kebijakan yang melibatkan CYWD',
              target_total:12, target_Y1:4, Q1:1, Q2:2, Q3:0, Q4:0 },
            { id:'O7-i5', kode:'IOF.2', jenis:'Standard LF',
              label:'Jumlah kasus insiden perlindungan anak yang dilaporkan & ditanggapi',
              target_total:0, target_Y1:0, Q1:0, Q2:0, Q3:0, Q4:0 },
          ]
        },

      ] // end outcomes
    } // end manggarai
  };

  // ----------------------------------------------------------
  // HELPER: hitung capaian berdasarkan periode
  // ----------------------------------------------------------
  function getCapaian(ind, year, quarter) {
    // Saat ini hanya Year 1 yang ada datanya
    if (year !== 'Y1') return 0;
    if (quarter === 'Q1') return ind.Q1;
    if (quarter === 'Q2') return ind.Q1 + ind.Q2;
    if (quarter === 'Q3') return ind.Q1 + ind.Q2 + ind.Q3;
    return ind.Q1 + ind.Q2 + ind.Q3 + ind.Q4; // Q4 = kumulatif tahunan
  }

  function pctBar(capaian, target) {
    if (!target) return 0;
    return Math.min(Math.round((capaian / target) * 100), 100);
  }

  function pctColor(pct) {
    if (pct >= 80) return '#16a34a';
    if (pct >= 50) return '#1264c0';
    if (pct >= 25) return '#d97706';
    return '#dc2626';
  }

  function statusBadge(pct) {
    if (pct >= 80) return '<span class="badge badge-success">On Track</span>';
    if (pct >= 50) return '<span class="badge badge-info">Progres</span>';
    if (pct >= 25) return '<span class="badge badge-warning">Perhatian</span>';
    return '<span class="badge badge-danger">Perlu Aksi</span>';
  }

  // ----------------------------------------------------------
  // RENDER OVERVIEW CARDS (ringkasan 7 outcome)
  // ----------------------------------------------------------
  function renderOverview(data) {
    const container = document.getElementById('overview-grid');
    container.innerHTML = data.outcomes.map(o => {
      const indWithTarget = o.indikator.filter(i => i.target_Y1 > 0);
      const avgPct = indWithTarget.length
        ? Math.round(indWithTarget.reduce((s, i) => {
            return s + pctBar(getCapaian(i, activeYear, activeQuarter), i.target_Y1);
          }, 0) / indWithTarget.length)
        : 0;

      return `
        <div class="overview-card" onclick="scrollToOutcome('${o.id}')" style="border-top:3px solid ${o.warna}">
          <div class="ov-header">
            <span class="ov-label" style="color:${o.warna}">${o.label}</span>
            ${statusBadge(avgPct)}
          </div>
          <div class="ov-name">${o.label_pendek}</div>
          <div class="ov-pct" style="color:${o.warna}">${avgPct}%</div>
          <div class="progress-bar-wrap" style="margin-top:6px">
            <div class="progress-bar-fill" style="width:${avgPct}%;background:${o.warna}"></div>
          </div>
          <div class="ov-sub">${indWithTarget.length} indikator · Target Tahunan</div>
        </div>`;
    }).join('');
  }

  // ----------------------------------------------------------
  // RENDER DETAIL SETIAP OUTCOME
  // ----------------------------------------------------------
  function renderOutcomes(data) {
    const container = document.getElementById('outcomes-detail');
    container.innerHTML = data.outcomes.map(o => {
      const rows = o.indikator.map(ind => {
        const cap    = getCapaian(ind, activeYear, activeQuarter);
        const pct    = pctBar(cap, ind.target_Y1);
        const col    = pctColor(pct);
        const selisih = cap - ind.target_Y1;
        const selisihStr = ind.target_Y1 > 0
          ? (selisih >= 0
              ? `<span style="color:#16a34a">+${selisih}</span>`
              : `<span style="color:#dc2626">${selisih}</span>`)
          : '—';

        return `
          <tr>
            <td>
              <span class="badge ${ind.jenis === 'Standard LF' ? 'badge-info' : 'badge-neutral'}" style="font-size:.65rem;margin-bottom:3px">${ind.kode}</span>
              <div style="font-size:.8125rem;color:var(--gray-700);line-height:1.4">${ind.label}</div>
            </td>
            <td style="text-align:center;font-family:var(--font-mono);font-weight:600">${ind.target_total || '—'}</td>
            <td style="text-align:center;font-family:var(--font-mono)">${ind.target_Y1 || '—'}</td>
            <td style="text-align:center;font-family:var(--font-mono);font-weight:700;color:${col}">${cap}</td>
            <td style="min-width:120px">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="progress-bar-wrap" style="flex:1;height:6px">
                  <div class="progress-bar-fill" style="width:${pct}%;background:${col}"></div>
                </div>
                <span style="font-family:var(--font-mono);font-size:.75rem;color:${col};min-width:32px">${pct}%</span>
              </div>
            </td>
            <td style="text-align:center;font-family:var(--font-mono)">${selisihStr}</td>
          </tr>`;
      }).join('');

      return `
        <div class="outcome-section" id="section-${o.id}">
          <div class="outcome-header" style="border-left:4px solid ${o.warna}">
            <div>
              <span style="font-size:.75rem;font-weight:700;color:${o.warna};text-transform:uppercase;letter-spacing:.05em">${o.label}</span>
              <div class="outcome-title-text">${o.label_pendek}</div>
              <div class="outcome-desc">${o.deskripsi}</div>
            </div>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="min-width:280px">Indikator</th>
                  <th style="text-align:center">Target<br>Total</th>
                  <th style="text-align:center">Target<br>Tahunan</th>
                  <th style="text-align:center">Capaian</th>
                  <th style="min-width:150px">Progress</th>
                  <th style="text-align:center">Selisih</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;
    }).join('');
  }

  // ----------------------------------------------------------
  // RENDER RINGKASAN STAT ATAS
  // ----------------------------------------------------------
  function renderSummaryStats(data) {
    const semua = data.outcomes.flatMap(o => o.indikator);
    const denganTarget = semua.filter(i => i.target_Y1 > 0);
    const onTrack = denganTarget.filter(i => pctBar(getCapaian(i, activeYear, activeQuarter), i.target_Y1) >= 80).length;
    const progres = denganTarget.filter(i => { const p = pctBar(getCapaian(i, activeYear, activeQuarter), i.target_Y1); return p >= 50 && p < 80; }).length;
    const perlu   = denganTarget.filter(i => pctBar(getCapaian(i, activeYear, activeQuarter), i.target_Y1) < 50).length;

    document.getElementById('stat-total-ind').textContent  = semua.length;
    document.getElementById('stat-on-track').textContent   = onTrack;
    document.getElementById('stat-progres').textContent    = progres;
    document.getElementById('stat-perlu-aksi').textContent = perlu;
  }

  // ----------------------------------------------------------
  // SCROLL ke outcome tertentu
  // ----------------------------------------------------------
  window.scrollToOutcome = function(id) {
    const el = document.getElementById('section-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ----------------------------------------------------------
  // PERIOD SELECTOR
  // ----------------------------------------------------------
  document.querySelectorAll('.btn-year').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-year').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeYear = btn.dataset.year;
      refreshDashboard();
    });
  });

  document.querySelectorAll('.btn-quarter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-quarter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeQuarter = btn.dataset.quarter;
      refreshDashboard();
    });
  });

  // ----------------------------------------------------------
  // LOAD & REFRESH
  // ----------------------------------------------------------
  function loadData(scnId) {
    activeScn = scnId || 'manggarai';
    refreshDashboard();
  }

  function refreshDashboard() {
    const data = ITT[activeScn] || ITT['manggarai'];
    document.getElementById('meta-scn').textContent     = data.meta.scn;
    document.getElementById('meta-project').textContent = data.meta.project;
    renderSummaryStats(data);
    renderOverview(data);
    renderOutcomes(data);
  }

  // INIT
  loadData(AUTH.getScnFilter());
});
