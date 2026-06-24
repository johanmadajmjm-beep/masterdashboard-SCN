// data.js — Central dummy data store
// Nanti diganti fetch ke Apps Script

// ── HELPER GLOBAL ──
function getPct(cap, target) { if (!target) return 0; return Math.min(Math.round(cap/target*100),100); }
function getPctColor(pct) {
  if (pct >= 80) return '#16a34a';
  if (pct >= 50) return '#1a6fd4';
  if (pct >= 25) return '#d97706';
  return '#dc2626';
}
function getStatusBadge(pct) {
  if (pct >= 80) return '<span class="badge badge-green">On Track</span>';
  if (pct >= 50) return '<span class="badge badge-blue">Progres</span>';
  if (pct >= 25) return '<span class="badge badge-amber">Perhatian</span>';
  return '<span class="badge badge-red">Perlu Aksi</span>';
}

// ── OUTCOME META ──
const OUTCOMES = [
  { id:'O1', label:'Outcome 1', pendek:'CYWD Berdaya',          warna:'#1a6fd4', indikator_ids:['O1-i1','O1-i2','O1-i3','O1-i4','O1-i5','O1-i6'] },
  { id:'O2', label:'Outcome 2', pendek:'Keluarga & Komunitas',  warna:'#10b8a6', indikator_ids:['O2-i1','O2-i2','O2-i3','O2-i4'] },
  { id:'O3', label:'Outcome 3', pendek:'DPO & CBR',             warna:'#d97706', indikator_ids:['O3-i1','O3-i2','O3-i3','O3-i4','O3-i5'] },
  { id:'O4', label:'Outcome 4', pendek:'Layanan Kesehatan',     warna:'#7c3aed', indikator_ids:['O4-i1','O4-i2','O4-i3','O4-i4','O4-i5'] },
  { id:'O5', label:'Outcome 5', pendek:'Pendidikan Inklusif',   warna:'#16a34a', indikator_ids:['O5-i1','O5-i2','O5-i3','O5-i4','O5-i5'] },
  { id:'O6', label:'Outcome 6', pendek:'Pemberdayaan Ekonomi',  warna:'#dc2626', indikator_ids:['O6-i1','O6-i2','O6-i3','O6-i4'] },
  { id:'O7', label:'Outcome 7', pendek:'Kebijakan & Advokasi',  warna:'#0284c7', indikator_ids:['O7-i1','O7-i2','O7-i3','O7-i4','O7-i5'] },
];

const ITT_LABELS = {
  'O1-i1':'CYWD dengan peningkatan rasa kendali & pengambilan keputusan',
  'O1-i2':'CYWD dengan peran aktif di komunitas',
  'O1-i3':'CYWD menerima layanan rehabilitasi sesuai IRP',
  'O1-i4':'CYWD memiliki keterampilan menyampaikan keinginan secara efektif',
  'O1-i5':'CYWD mengetahui hak mereka (termasuk HKSR)',
  'O1-i6':'CYWD berpartisipasi dalam kehidupan keluarga & komunitas',
  'O2-i1':'Orang tua/pengasuh dengan peningkatan kapasitas mendukung CYWD',
  'O2-i2':'Keluarga mengakses layanan rehabilitasi tanpa stigma',
  'O2-i3':'CYWD dengan dokumen kependudukan lengkap & aktif di perlindungan sosial',
  'O2-i4':'Kelompok keluarga/orang tua aktif di tingkat desa/kecamatan',
  'O3-i1':'DPO/CSO yang mempekerjakan penyandang disabilitas dalam peran kepemimpinan',
  'O3-i2':'Rujukan efektif oleh jejaring komunitas',
  'O3-i3':'Pekerja CBR/CBID memberikan dukungan langsung kepada CYWD',
  'O3-i4':'Pekerja CBR percaya diri dalam memberikan perawatan memadai',
  'O3-i5':'DPO aktif berkolaborasi dalam sistem rujukan',
  'O4-i1':'Penyedia layanan kesehatan yang meningkatkan fasilitas aksesibel',
  'O4-i2':'Penyedia layanan yang meningkatkan layanan inklusif',
  'O4-i3':'Tenaga kesehatan dilatih layanan KSR inklusif',
  'O4-i4':'Kasus kusta yang diidentifikasi & diobati di komunitas',
  'O4-i5':'CYWD yang memanfaatkan layanan KSR secara efektif',
  'O5-i1':'CYWD terdaftar di program pendidikan inklusif',
  'O5-i2':'CYWD menunjukkan kemajuan sesuai potensi (ILP)',
  'O5-i3':'Sekolah dengan peningkatan kualitas pengajaran & lingkungan',
  'O5-i4':'Sekolah mengajukan proposal aksesibilitas ke pemerintah',
  'O5-i5':'Guru PAUD dengan peningkatan pengetahuan identifikasi dini',
  'O6-i1':'YwD berpartisipasi dalam pasar tenaga kerja',
  'O6-i2':'Orang tua/pengasuh dengan peningkatan pendapatan',
  'O6-i3':'Pusat pelatihan vokasional menerapkan model inklusif',
  'O6-i4':'Bisnis/tempat kerja dengan prosedur lingkungan kerja inklusif',
  'O7-i1':'Kebijakan inklusif yang diadopsi & dimonitor bersama DPO/CYWD',
  'O7-i2':'Aksi lobi & advokasi oleh DPO/NGO yang memengaruhi kebijakan',
  'O7-i3':'Kebijakan/hukum yang diharmonisasi dengan kerangka inklusif',
  'O7-i4':'Proses konsultasi kebijakan yang melibatkan CYWD',
  'O7-i5':'Kasus insiden perlindungan anak yang dilaporkan & ditanggapi',
};

// ── FUNGSI BUAT DATA ITT DUMMY ──
// Setiap SCN punya angka acak yang berbeda tapi masuk akal
function makeITT(seed) {
  const r = (min, max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max-min+1) + min);
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  const make = (tgt_y1, tgt_total, factor) => ({
    cap: Math.min(Math.floor(tgt_y1 * factor * (0.4 + (seed++ % 60)/100)), tgt_y1),
    target_y1: tgt_y1,
    target_total: tgt_total
  });
  const f = 0.3 + (seed % 70) / 100; // faktor capaian 0.3–1.0 per SCN
  return {
    'O1-i1': make(50,  150, f),   'O1-i2': make(30,  100, f),
    'O1-i3': make(200, 200, f+.3),'O1-i4': make(40,  120, f),
    'O1-i5': make(40,  120, f),   'O1-i6': make(35,  100, f+.1),
    'O2-i1': make(100, 200, f),   'O2-i2': make(60,  150, f),
    'O2-i3': make(80,  180, f),   'O2-i4': make(8,   20,  f),
    'O3-i1': make(4,   8,   f+.2),'O3-i2': make(40,  120, f),
    'O3-i3': make(8,   40,  f+.4),'O3-i4': make(8,   40,  f+.3),
    'O3-i5': make(4,   8,   f+.2),'O4-i1': make(5,   15,  f),
    'O4-i2': make(8,   20,  f),   'O4-i3': make(20,  60,  f),
    'O4-i4': make(20,  50,  f),   'O4-i5': make(30,  80,  f),
    'O5-i1': make(50,  120, f),   'O5-i2': make(40,  100, f),
    'O5-i3': make(10,  30,  f),   'O5-i4': make(8,   20,  f),
    'O5-i5': make(20,  50,  f),   'O6-i1': make(20,  60,  f*.7),
    'O6-i2': make(25,  80,  f*.7),'O6-i3': make(2,   5,   f*.6),
    'O6-i4': make(6,   20,  f*.6),'O7-i1': make(3,   10,  f*.5),
    'O7-i2': make(10,  30,  f*.6),'O7-i3': make(2,   8,   f*.5),
    'O7-i4': make(4,   12,  f*.5),'O7-i5': make(0,   0,   0),
  };
}

// ── DATA PER SCN ──
const DATA = {

  manggarai: {
    meta: { scn:'SCN Manggarai', project:'BEN', provinsi:'NTT', tahun:2026 },
    workers: [
      { id:'elfrida',   nama:'Elfrida Suryati',       anak:8,  kunjungan_bulan:6,  irp_aktif:5,  late:0 },
      { id:'jack',      nama:'Jack Roka',              anak:24, kunjungan_bulan:18, irp_aktif:16, late:3 },
      { id:'laurens',   nama:'Laurensius Herbianto',   anak:41, kunjungan_bulan:30, irp_aktif:28, late:2 },
      { id:'leonardus', nama:'Leonardus M. Mawardi',  anak:26, kunjungan_bulan:20, irp_aktif:18, late:1 },
      { id:'magdalena', nama:'Magdalena Sabe',         anak:30, kunjungan_bulan:22, irp_aktif:20, late:2 },
      { id:'diana',     nama:'Maria Diana Banut',      anak:20, kunjungan_bulan:14, irp_aktif:12, late:1 },
      { id:'miseldis',  nama:'Miseldis Halmida',       anak:28, kunjungan_bulan:19, irp_aktif:16, late:2 },
      { id:'stanis',    nama:'Stanis J. Ngalu',        anak:23, kunjungan_bulan:15, irp_aktif:14, late:1 },
    ],
    anak: [
      { nama:'Yohanes Deki',    cbr:'jack',      ragam:'Fisik',       irp:'Aktif',   hari:3,  desa:'Desa Wae Rebo',  gender:'L', usia:8  },
      { nama:'Maria Leni',      cbr:'jack',      ragam:'Intelektual', irp:'Aktif',   hari:7,  desa:'Desa Cancar',    gender:'P', usia:10 },
      { nama:'Petrus Aldi',     cbr:'jack',      ragam:'Wicara',      irp:'Belum',   hari:35, desa:'Desa Ranaka',    gender:'L', usia:7  },
      { nama:'Agustina Rena',   cbr:'jack',      ragam:'Netra',       irp:'Aktif',   hari:12, desa:'Desa Golo',      gender:'P', usia:12 },
      { nama:'Florianus Tedo',  cbr:'jack',      ragam:'Fisik',       irp:'Belum',   hari:42, desa:'Desa Wae Rebo',  gender:'L', usia:9  },
      { nama:'Theresia Wela',   cbr:'magdalena', ragam:'Intelektual', irp:'Aktif',   hari:5,  desa:'Desa Lamba',     gender:'P', usia:11 },
      { nama:'Benediktus Ema',  cbr:'magdalena', ragam:'Fisik',       irp:'Aktif',   hari:15, desa:'Desa Poco',      gender:'L', usia:8  },
      { nama:'Katarina Seli',   cbr:'magdalena', ragam:'Rungu',       irp:'Belum',   hari:38, desa:'Desa Cancar',    gender:'P', usia:13 },
      { nama:'Andreas Moa',     cbr:'laurens',   ragam:'Fisik',       irp:'Aktif',   hari:8,  desa:'Desa Ruteng',    gender:'L', usia:6  },
      { nama:'Elisabet Nara',   cbr:'laurens',   ragam:'Ganda',       irp:'Aktif',   hari:20, desa:'Desa Wae Rii',   gender:'P', usia:14 },
    ],
    referral: [
      { nama:'Yohanes Deki',   tujuan:'Puskesmas Langke Rembong', status:'Proses',  tgl:'2026-05-10', cbr:'jack'      },
      { nama:'Maria Leni',     tujuan:'RS Umum Ruteng',           status:'Selesai', tgl:'2026-04-22', cbr:'jack'      },
      { nama:'Florianus Tedo', tujuan:'Dinas Sosial Manggarai',   status:'Proses',  tgl:'2026-05-18', cbr:'jack'      },
      { nama:'Theresia Wela',  tujuan:'Puskesmas Satarmese',      status:'Selesai', tgl:'2026-05-02', cbr:'magdalena' },
      { nama:'Andreas Moa',    tujuan:'RSUD Ruteng',              status:'Proses',  tgl:'2026-06-01', cbr:'laurens'   },
    ],
    aktivitas: [
      { tgl:'2026-06-18', nama:'Penguatan Kapasitas DPO PERTUNI',  outcome:3, peserta:27, lokasi:'Aula Dinas Sosial'   },
      { tgl:'2026-06-15', nama:'SRHR Awareness & Education',        outcome:4, peserta:37, lokasi:'SMPN 1 Satarmese'    },
      { tgl:'2026-06-08', nama:'Penguatan Forum Orang Tua',         outcome:2, peserta:30, lokasi:'Aula YKM Ruteng'     },
      { tgl:'2026-05-29', nama:'TOT Pendidikan Inklusi',            outcome:5, peserta:59, lokasi:'Aula YKM Ruteng'     },
    ],
    stakeholder: {
      'Guru':            { total:55, L:25, P:30 },
      'Staff Mitra':     { total:7,  L:5,  P:2  },
      'Pengasuh/Ortu':   { total:12, L:3,  P:9  },
      'Nakes':           { total:8,  L:3,  P:5  },
      'Pemerintah':      { total:10, L:7,  P:3  },
      'CBR Worker':      { total:8,  L:3,  P:5  },
    },
    itt: { Y1_Q2: makeITT(42) },
    cerita: [
      { nama:'Yohanes, 8 Tahun', lokasi:'Desa Wae Rebo', worker:'Jack Roka', tanggal:'Mei 2026', tag:'Perkembangan Anak',
        narasi:'Sebelum program, Yohanes tidak bisa duduk sendiri. Setelah 6 bulan pendampingan, ia kini mampu duduk mandiri dan mulai merespons panggilan namanya.' },
      { nama:'Keluarga Maria', lokasi:'Desa Lamba', worker:'Magdalena Sabe', tanggal:'April 2026', tag:'Keluarga & Komunitas',
        narasi:'Orang tua Maria awalnya menyembunyikan anaknya karena malu. Kini keluarga aktif membawa Maria ke kegiatan komunitas setiap minggu.' },
      { nama:'Forum Orang Tua Langke Rembong', lokasi:'Kecamatan Langke Rembong', worker:'Tim SCN Manggarai', tanggal:'Juni 2026', tag:'DPO & Komunitas',
        narasi:'30 orang tua kini punya wadah untuk saling mendukung dan secara kolektif mengadvokasi hak anak-anak mereka.' },
    ],
  },

  banyuwangi: {
    meta: { scn:'SCN Banyuwangi', project:'BEN', provinsi:'Jawa Timur', tahun:2026 },
    workers: [
      { id:'sari',    nama:'Sari Dewi Rahayu',     anak:22, kunjungan_bulan:16, irp_aktif:14, late:1 },
      { id:'bagus',   nama:'Bagus Prasetyo',        anak:18, kunjungan_bulan:12, irp_aktif:10, late:2 },
      { id:'fitri',   nama:'Fitri Handayani',       anak:25, kunjungan_bulan:20, irp_aktif:18, late:0 },
      { id:'agung',   nama:'Agung Santoso',         anak:19, kunjungan_bulan:14, irp_aktif:12, late:1 },
      { id:'dewi',    nama:'Dewi Lestari',          anak:28, kunjungan_bulan:18, irp_aktif:15, late:3 },
    ],
    anak: [
      { nama:'Rizal Fadilah',    cbr:'sari',   ragam:'Fisik',       irp:'Aktif',  hari:5,  desa:'Ds. Glagah',    gender:'L', usia:9  },
      { nama:'Nur Aini',         cbr:'sari',   ragam:'Intelektual', irp:'Aktif',  hari:10, desa:'Ds. Licin',     gender:'P', usia:11 },
      { nama:'Dani Kurniawan',   cbr:'bagus',  ragam:'Wicara',      irp:'Belum',  hari:33, desa:'Ds. Rogojampi', gender:'L', usia:8  },
      { nama:'Siti Rahmawati',   cbr:'fitri',  ragam:'Rungu',       irp:'Aktif',  hari:4,  desa:'Ds. Srono',     gender:'P', usia:12 },
      { nama:'Eko Wahyudi',      cbr:'fitri',  ragam:'Fisik',       irp:'Selesai',hari:18, desa:'Ds. Muncar',    gender:'L', usia:14 },
      { nama:'Lailatul Fitriah', cbr:'agung',  ragam:'Netra',       irp:'Aktif',  hari:7,  desa:'Ds. Purwoharjo',gender:'P', usia:10 },
      { nama:'Ahmad Fauzi',      cbr:'dewi',   ragam:'Ganda',       irp:'Belum',  hari:41, desa:'Ds. Tegaldlimo',gender:'L', usia:7  },
    ],
    referral: [
      { nama:'Rizal Fadilah',  tujuan:'Puskesmas Glagah',      status:'Proses',  tgl:'2026-05-20', cbr:'sari'  },
      { nama:'Dani Kurniawan', tujuan:'RS Blambangan',         status:'Proses',  tgl:'2026-06-01', cbr:'bagus' },
      { nama:'Eko Wahyudi',    tujuan:'Dinas Sosial Banyuwangi',status:'Selesai',tgl:'2026-04-15', cbr:'fitri' },
    ],
    aktivitas: [
      { tgl:'2026-06-20', nama:'Pelatihan CBR Worker',         outcome:3, peserta:22, lokasi:'Aula Puskesmas Glagah'   },
      { tgl:'2026-06-10', nama:'Sosialisasi Hak Disabilitas',  outcome:1, peserta:45, lokasi:'Balai Desa Rogojampi'    },
      { tgl:'2026-05-25', nama:'Pembentukan Forum Orang Tua',  outcome:2, peserta:28, lokasi:'Kantor Kecamatan Srono'  },
    ],
    stakeholder: {
      'Guru':          { total:38, L:15, P:23 },
      'Pengasuh/Ortu': { total:18, L:6,  P:12 },
      'Nakes':         { total:12, L:4,  P:8  },
      'Pemerintah':    { total:8,  L:6,  P:2  },
      'CBR Worker':    { total:5,  L:2,  P:3  },
    },
    itt: { Y1_Q2: makeITT(87) },
    cerita: [
      { nama:'Rizal, 9 Tahun', lokasi:'Desa Glagah', worker:'Sari Dewi Rahayu', tanggal:'Juni 2026', tag:'Perkembangan Anak',
        narasi:'Rizal yang sebelumnya tidak bisa berjalan kini mulai bisa berdiri dengan bantuan alat bantu setelah 4 bulan terapi rutin bersama CBR worker.' },
      { nama:'Keluarga Ahmad', lokasi:'Desa Tegaldlimo', worker:'Dewi Lestari', tanggal:'Mei 2026', tag:'Keluarga & Komunitas',
        narasi:'Orang tua Ahmad kini aktif mengikuti forum orang tua dan telah berhasil mendaftarkan Ahmad dalam program BPJS Kesehatan.' },
    ],
  },

  jember: {
    meta: { scn:'SCN Jember', project:'BEN', provinsi:'Jawa Timur', tahun:2026 },
    workers: [
      { id:'budi',    nama:'Budi Santoso',      anak:20, kunjungan_bulan:15, irp_aktif:13, late:1 },
      { id:'rina',    nama:'Rina Wulandari',    anak:24, kunjungan_bulan:18, irp_aktif:16, late:2 },
      { id:'hendra',  nama:'Hendra Gunawan',    anak:18, kunjungan_bulan:14, irp_aktif:11, late:0 },
      { id:'maya',    nama:'Maya Sari',         anak:22, kunjungan_bulan:17, irp_aktif:14, late:1 },
      { id:'fajar',   nama:'Fajar Nugroho',     anak:16, kunjungan_bulan:12, irp_aktif:10, late:2 },
    ],
    anak: [
      { nama:'Andika Putra',    cbr:'budi',   ragam:'Fisik',       irp:'Aktif',  hari:6,  desa:'Ds. Kaliwates',  gender:'L', usia:8  },
      { nama:'Nisa Amalia',     cbr:'budi',   ragam:'Intelektual', irp:'Aktif',  hari:11, desa:'Ds. Sumbersari', gender:'P', usia:10 },
      { nama:'Riko Setiawan',   cbr:'rina',   ragam:'Wicara',      irp:'Belum',  hari:36, desa:'Ds. Patrang',    gender:'L', usia:7  },
      { nama:'Sinta Dewi',      cbr:'hendra', ragam:'Rungu',       irp:'Aktif',  hari:3,  desa:'Ds. Ambulu',     gender:'P', usia:13 },
      { nama:'Wahyu Hidayat',   cbr:'maya',   ragam:'Fisik',       irp:'Selesai',hari:22, desa:'Ds. Kencong',    gender:'L', usia:11 },
    ],
    referral: [
      { nama:'Andika Putra',  tujuan:'RSUD dr. Soebandi',      status:'Proses',  tgl:'2026-05-28', cbr:'budi'  },
      { nama:'Riko Setiawan', tujuan:'Puskesmas Patrang',      status:'Proses',  tgl:'2026-06-05', cbr:'rina'  },
      { nama:'Wahyu Hidayat', tujuan:'Dinas Sosial Jember',    status:'Selesai', tgl:'2026-04-20', cbr:'maya'  },
    ],
    aktivitas: [
      { tgl:'2026-06-15', nama:'TOT Pendidikan Inklusi',       outcome:5, peserta:40, lokasi:'SMPN 3 Jember'        },
      { tgl:'2026-06-02', nama:'Sosialisasi SRHR',             outcome:4, peserta:35, lokasi:'Puskesmas Kaliwates'  },
      { tgl:'2026-05-20', nama:'Penguatan Kapasitas DPO',      outcome:3, peserta:20, lokasi:'Aula Dinas Sosial'    },
    ],
    stakeholder: {
      'Guru':          { total:42, L:18, P:24 },
      'Pengasuh/Ortu': { total:20, L:7,  P:13 },
      'Nakes':         { total:10, L:3,  P:7  },
      'Pemerintah':    { total:9,  L:6,  P:3  },
      'CBR Worker':    { total:5,  L:2,  P:3  },
    },
    itt: { Y1_Q2: makeITT(63) },
    cerita: [
      { nama:'Sinta, 13 Tahun', lokasi:'Desa Ambulu', worker:'Hendra Gunawan', tanggal:'Juni 2026', tag:'Perkembangan Anak',
        narasi:'Sinta yang tuli kini bisa berkomunikasi menggunakan bahasa isyarat setelah mengikuti pelatihan yang difasilitasi CBR worker.' },
    ],
  },

  situbondo: {
    meta: { scn:'SCN Situbondo', project:'BEN', provinsi:'Jawa Timur', tahun:2026 },
    workers: [
      { id:'anton',  nama:'Anton Wijaya',     anak:18, kunjungan_bulan:13, irp_aktif:11, late:2 },
      { id:'yuni',   nama:'Yuni Astuti',      anak:21, kunjungan_bulan:16, irp_aktif:14, late:1 },
      { id:'dodi',   nama:'Dodi Firmansyah',  anak:16, kunjungan_bulan:12, irp_aktif:10, late:0 },
      { id:'susi',   nama:'Susi Rahayu',      anak:19, kunjungan_bulan:14, irp_aktif:12, late:2 },
    ],
    anak: [
      { nama:'Hasan Basri',    cbr:'anton', ragam:'Fisik',       irp:'Aktif',  hari:8,  desa:'Ds. Panji',      gender:'L', usia:9  },
      { nama:'Fatimah Zahra',  cbr:'yuni',  ragam:'Intelektual', irp:'Aktif',  hari:4,  desa:'Ds. Mlandingan', gender:'P', usia:11 },
      { nama:'Ridho Akbar',    cbr:'dodi',  ragam:'Wicara',      irp:'Belum',  hari:40, desa:'Ds. Besuki',     gender:'L', usia:7  },
      { nama:'Nurul Hidayah',  cbr:'susi',  ragam:'Rungu',       irp:'Aktif',  hari:6,  desa:'Ds. Kendit',     gender:'P', usia:10 },
    ],
    referral: [
      { nama:'Hasan Basri',   tujuan:'RSUD Abdoer Rahem',    status:'Proses',  tgl:'2026-05-30', cbr:'anton' },
      { nama:'Ridho Akbar',   tujuan:'Puskesmas Besuki',     status:'Proses',  tgl:'2026-06-08', cbr:'dodi'  },
    ],
    aktivitas: [
      { tgl:'2026-06-12', nama:'Pelatihan Orang Tua',        outcome:2, peserta:25, lokasi:'Balai Desa Panji'      },
      { tgl:'2026-05-28', nama:'Sosialisasi Hak Disabilitas', outcome:1, peserta:32, lokasi:'Aula Kecamatan Besuki' },
    ],
    stakeholder: {
      'Guru':          { total:30, L:12, P:18 },
      'Pengasuh/Ortu': { total:15, L:4,  P:11 },
      'Nakes':         { total:8,  L:3,  P:5  },
      'Pemerintah':    { total:7,  L:5,  P:2  },
      'CBR Worker':    { total:4,  L:1,  P:3  },
    },
    itt: { Y1_Q2: makeITT(29) },
    cerita: [
      { nama:'Fatimah, 11 Tahun', lokasi:'Desa Mlandingan', worker:'Yuni Astuti', tanggal:'Mei 2026', tag:'Perkembangan Anak',
        narasi:'Fatimah kini bisa makan dan berpakaian sendiri setelah program stimulasi yang rutin dilakukan bersama orang tuanya.' },
    ],
  },

  kupang: {
    meta: { scn:'SCN Kupang', project:'BEN', provinsi:'NTT', tahun:2026 },
    workers: [
      { id:'samuel',   nama:'Samuel Ndun',       anak:20, kunjungan_bulan:15, irp_aktif:13, late:1 },
      { id:'maria_k',  nama:'Maria Klau',         anak:25, kunjungan_bulan:19, irp_aktif:17, late:2 },
      { id:'yosef',    nama:'Yosef Benu',         anak:18, kunjungan_bulan:13, irp_aktif:11, late:1 },
      { id:'agnes',    nama:'Agnes Fallo',         anak:22, kunjungan_bulan:16, irp_aktif:14, late:0 },
      { id:'petrus_k', nama:'Petrus Kore',         anak:17, kunjungan_bulan:12, irp_aktif:10, late:2 },
    ],
    anak: [
      { nama:'Maximus Adu',    cbr:'samuel',  ragam:'Fisik',       irp:'Aktif',  hari:5,  desa:'Ds. Oesapa',    gender:'L', usia:8  },
      { nama:'Theresia Lelo',  cbr:'maria_k', ragam:'Intelektual', irp:'Aktif',  hari:9,  desa:'Ds. Fatuleu',   gender:'P', usia:11 },
      { nama:'Dominikus Banu', cbr:'yosef',   ragam:'Wicara',      irp:'Belum',  hari:38, desa:'Ds. Noemuti',   gender:'L', usia:7  },
      { nama:'Katarina Tonu',  cbr:'agnes',   ragam:'Rungu',       irp:'Aktif',  hari:4,  desa:'Ds. Camplong',  gender:'P', usia:13 },
      { nama:'Alfonsius Seran',cbr:'petrus_k',ragam:'Ganda',       irp:'Belum',  hari:45, desa:'Ds. Oelbubuk',  gender:'L', usia:9  },
    ],
    referral: [
      { nama:'Maximus Adu',    tujuan:'RSUD W.Z. Johannes',   status:'Proses',  tgl:'2026-05-25', cbr:'samuel'  },
      { nama:'Dominikus Banu', tujuan:'Puskesmas Noemuti',    status:'Proses',  tgl:'2026-06-03', cbr:'yosef'   },
      { nama:'Theresia Lelo',  tujuan:'Dinas Sosial Kupang',  status:'Selesai', tgl:'2026-04-18', cbr:'maria_k' },
    ],
    aktivitas: [
      { tgl:'2026-06-18', nama:'Penguatan Forum Orang Tua',    outcome:2, peserta:28, lokasi:'Aula Kecamatan Fatuleu' },
      { tgl:'2026-06-05', nama:'Pelatihan CBR Worker',         outcome:3, peserta:18, lokasi:'Kantor Dinas Sosial'    },
      { tgl:'2026-05-22', nama:'Sosialisasi SRHR Remaja',      outcome:4, peserta:40, lokasi:'SMPN 1 Kupang'          },
    ],
    stakeholder: {
      'Guru':          { total:35, L:14, P:21 },
      'Pengasuh/Ortu': { total:16, L:5,  P:11 },
      'Nakes':         { total:10, L:4,  P:6  },
      'Pemerintah':    { total:8,  L:6,  P:2  },
      'CBR Worker':    { total:5,  L:2,  P:3  },
    },
    itt: { Y1_Q2: makeITT(55) },
    cerita: [
      { nama:'Maximus, 8 Tahun', lokasi:'Desa Oesapa', worker:'Samuel Ndun', tanggal:'Juni 2026', tag:'Perkembangan Anak',
        narasi:'Maximus kini bisa bergerak lebih mandiri dengan kursi roda yang diperoleh melalui proses referral program BEN.' },
    ],
  },

  tts: {
    meta: { scn:'SCN Timor Tengah Selatan', project:'BEN', provinsi:'NTT', tahun:2026 },
    workers: [
      { id:'benedik',  nama:'Benediktus Neno',    anak:16, kunjungan_bulan:11, irp_aktif:9,  late:2 },
      { id:'rosalia',  nama:'Rosalia Bana',        anak:20, kunjungan_bulan:14, irp_aktif:12, late:1 },
      { id:'marianus', nama:'Marianus Tefa',       anak:18, kunjungan_bulan:13, irp_aktif:11, late:0 },
      { id:'yuliana',  nama:'Yuliana Kolo',        anak:14, kunjungan_bulan:10, irp_aktif:8,  late:1 },
    ],
    anak: [
      { nama:'Sebastianus Benu', cbr:'benedik',  ragam:'Fisik',       irp:'Aktif',  hari:7,  desa:'Ds. Soe',       gender:'L', usia:9  },
      { nama:'Maria Boimau',     cbr:'rosalia',  ragam:'Intelektual', irp:'Aktif',  hari:12, desa:'Ds. Niki-Niki', gender:'P', usia:10 },
      { nama:'Aprianus Tesi',    cbr:'marianus', ragam:'Wicara',      irp:'Belum',  hari:35, desa:'Ds. Mollo',     gender:'L', usia:8  },
      { nama:'Selvia Kore',      cbr:'yuliana',  ragam:'Rungu',       irp:'Aktif',  hari:5,  desa:'Ds. Kapan',     gender:'P', usia:12 },
    ],
    referral: [
      { nama:'Sebastianus Benu', tujuan:'RSUD Soe',           status:'Proses',  tgl:'2026-06-01', cbr:'benedik'  },
      { nama:'Aprianus Tesi',    tujuan:'Puskesmas Mollo',    status:'Proses',  tgl:'2026-06-10', cbr:'marianus' },
    ],
    aktivitas: [
      { tgl:'2026-06-14', nama:'Pelatihan Orang Tua & Keluarga', outcome:2, peserta:22, lokasi:'Balai Desa Soe'       },
      { tgl:'2026-05-30', nama:'Sosialisasi Hak Anak Disabilitas',outcome:1, peserta:30, lokasi:'Aula Kec. Niki-Niki' },
    ],
    stakeholder: {
      'Guru':          { total:28, L:11, P:17 },
      'Pengasuh/Ortu': { total:14, L:4,  P:10 },
      'Nakes':         { total:7,  L:2,  P:5  },
      'Pemerintah':    { total:6,  L:4,  P:2  },
      'CBR Worker':    { total:4,  L:1,  P:3  },
    },
    itt: { Y1_Q2: makeITT(71) },
    cerita: [
      { nama:'Maria Boimau, 10 Tahun', lokasi:'Desa Niki-Niki', worker:'Rosalia Bana', tanggal:'Mei 2026', tag:'Perkembangan Anak',
        narasi:'Maria kini bisa mengikuti kegiatan belajar di rumah dengan pendampingan khusus dari CBR worker dan guru kunjung.' },
    ],
  },

  palu: {
    meta: { scn:'SCN Palu', project:'BEN', provinsi:'Sulawesi Tengah', tahun:2026 },
    workers: [
      { id:'rahmat',  nama:'Rahmat Hidayat',    anak:22, kunjungan_bulan:16, irp_aktif:14, late:1 },
      { id:'nurhayati',nama:'Nurhayati Saleh',  anak:19, kunjungan_bulan:14, irp_aktif:12, late:2 },
      { id:'irfan',   nama:'Irfan Maulana',     anak:24, kunjungan_bulan:18, irp_aktif:16, late:0 },
      { id:'hasna',   nama:'Hasna Putri',       anak:17, kunjungan_bulan:12, irp_aktif:10, late:1 },
      { id:'andi',    nama:'Andi Saputra',      anak:20, kunjungan_bulan:15, irp_aktif:13, late:2 },
    ],
    anak: [
      { nama:'Faisal Amir',     cbr:'rahmat',    ragam:'Fisik',       irp:'Aktif',  hari:4,  desa:'Ds. Talise',    gender:'L', usia:9  },
      { nama:'Putri Ramadhan',  cbr:'nurhayati', ragam:'Intelektual', irp:'Aktif',  hari:8,  desa:'Ds. Lolu',      gender:'P', usia:11 },
      { nama:'Arman Basir',     cbr:'irfan',     ragam:'Wicara',      irp:'Belum',  hari:37, desa:'Ds. Tipo',      gender:'L', usia:7  },
      { nama:'Nadia Safitri',   cbr:'hasna',     ragam:'Rungu',       irp:'Aktif',  hari:6,  desa:'Ds. Buluri',    gender:'P', usia:12 },
      { nama:'Rizky Pratama',   cbr:'andi',      ragam:'Ganda',       irp:'Belum',  hari:43, desa:'Ds. Tavanjuka', gender:'L', usia:8  },
    ],
    referral: [
      { nama:'Faisal Amir',    tujuan:'RSUD Undata Palu',      status:'Proses',  tgl:'2026-05-22', cbr:'rahmat'    },
      { nama:'Arman Basir',    tujuan:'Puskesmas Tipo',        status:'Proses',  tgl:'2026-06-05', cbr:'irfan'     },
      { nama:'Putri Ramadhan', tujuan:'Dinas Sosial Kota Palu',status:'Selesai', tgl:'2026-04-25', cbr:'nurhayati' },
    ],
    aktivitas: [
      { tgl:'2026-06-16', nama:'Pelatihan Pendidikan Inklusi', outcome:5, peserta:38, lokasi:'SMPN 5 Palu'         },
      { tgl:'2026-06-08', nama:'Penguatan Kapasitas DPO',      outcome:3, peserta:22, lokasi:'Sekretariat Pertuni' },
      { tgl:'2026-05-26', nama:'Forum Orang Tua Anak Difabel', outcome:2, peserta:30, lokasi:'Aula Kelurahan Tipo' },
    ],
    stakeholder: {
      'Guru':          { total:40, L:16, P:24 },
      'Pengasuh/Ortu': { total:18, L:6,  P:12 },
      'Nakes':         { total:11, L:4,  P:7  },
      'Pemerintah':    { total:9,  L:6,  P:3  },
      'CBR Worker':    { total:5,  L:2,  P:3  },
    },
    itt: { Y1_Q2: makeITT(38) },
    cerita: [
      { nama:'Faisal, 9 Tahun', lokasi:'Desa Talise', worker:'Rahmat Hidayat', tanggal:'Juni 2026', tag:'Perkembangan Anak',
        narasi:'Setelah gempa 2018, Faisal mengalami trauma dan gangguan motorik. Program BEN membantunya pulih dan kembali aktif bermain bersama teman-temannya.' },
      { nama:'Forum Orang Tua Talise', lokasi:'Kelurahan Talise', worker:'Tim SCN Palu', tanggal:'Mei 2026', tag:'Keluarga & Komunitas',
        narasi:'Forum orang tua yang baru terbentuk berhasil mendaftarkan 12 anak disabilitas ke dalam program BPJS Kesehatan dalam waktu satu bulan.' },
    ],
  },

  sigi: {
    meta: { scn:'SCN Sigi', project:'BEN', provinsi:'Sulawesi Tengah', tahun:2026 },
    workers: [
      { id:'lukman',  nama:'Lukman Hakim',     anak:18, kunjungan_bulan:13, irp_aktif:11, late:1 },
      { id:'ramlah',  nama:'Ramlah Usman',     anak:20, kunjungan_bulan:15, irp_aktif:13, late:2 },
      { id:'suardin', nama:'Suardin Lapananda', anak:16, kunjungan_bulan:11, irp_aktif:9,  late:0 },
      { id:'mariati', nama:'Mariati Djafar',   anak:19, kunjungan_bulan:14, irp_aktif:12, late:1 },
    ],
    anak: [
      { nama:'Kamaludin',    cbr:'lukman',  ragam:'Fisik',       irp:'Aktif',  hari:6,  desa:'Ds. Biromaru',  gender:'L', usia:9  },
      { nama:'Sitti Aisyah', cbr:'ramlah',  ragam:'Intelektual', irp:'Aktif',  hari:10, desa:'Ds. Pandere',   gender:'P', usia:11 },
      { nama:'Musdalifah',   cbr:'suardin', ragam:'Wicara',      irp:'Belum',  hari:34, desa:'Ds. Dolo',      gender:'P', usia:8  },
      { nama:'Ridwan Laki',  cbr:'mariati', ragam:'Rungu',       irp:'Aktif',  hari:5,  desa:'Ds. Marawola',  gender:'L', usia:12 },
    ],
    referral: [
      { nama:'Kamaludin',  tujuan:'RSUD Kabupaten Sigi',  status:'Proses',  tgl:'2026-05-28', cbr:'lukman'  },
      { nama:'Musdalifah', tujuan:'Puskesmas Dolo',       status:'Proses',  tgl:'2026-06-06', cbr:'suardin' },
    ],
    aktivitas: [
      { tgl:'2026-06-11', nama:'Pelatihan CBR Worker Sigi',    outcome:3, peserta:16, lokasi:'Aula Dinsos Sigi'    },
      { tgl:'2026-05-28', nama:'Sosialisasi Inklusi Pendidikan',outcome:5, peserta:28, lokasi:'SDN 1 Biromaru'     },
      { tgl:'2026-05-15', nama:'Pembentukan Forum Orang Tua',   outcome:2, peserta:22, lokasi:'Balai Desa Pandere' },
    ],
    stakeholder: {
      'Guru':          { total:25, L:10, P:15 },
      'Pengasuh/Ortu': { total:12, L:3,  P:9  },
      'Nakes':         { total:6,  L:2,  P:4  },
      'Pemerintah':    { total:5,  L:4,  P:1  },
      'CBR Worker':    { total:4,  L:1,  P:3  },
    },
    itt: { Y1_Q2: makeITT(94) },
    cerita: [
      { nama:'Sitti Aisyah, 11 Tahun', lokasi:'Desa Pandere', worker:'Ramlah Usman', tanggal:'Juni 2026', tag:'Perkembangan Anak',
        narasi:'Aisyah yang semula tidak bisa berinteraksi dengan orang di luar keluarganya kini aktif mengikuti kegiatan posyandu dan mulai berteman dengan anak-anak seusianya.' },
    ],
  },

};

// ── FUNGSI UTAMA → lihat getAllScnData() dan getScnData() di bawah ──

// ── AGREGASI SEMUA SCN ──
// Dipanggil saat superadmin pilih "Semua SCN" (scnId = null)
function getAllScnData() {
  const scnIds = Object.keys(DATA);

  // Workers: gabung semua
  const workers = scnIds.flatMap(id =>
    DATA[id].workers.map(w => ({ ...w, scn: DATA[id].meta.scn, scn_id: id }))
  );

  // Anak: gabung semua
  const anak = scnIds.flatMap(id =>
    DATA[id].anak.map(a => ({ ...a, scn: DATA[id].meta.scn, scn_id: id }))
  );

  // Referral: gabung semua
  const referral = scnIds.flatMap(id =>
    DATA[id].referral.map(r => ({ ...r, scn: DATA[id].meta.scn, scn_id: id }))
  );

  // Aktivitas: gabung semua, sort terbaru dulu
  const aktivitas = scnIds.flatMap(id =>
    DATA[id].aktivitas.map(a => ({ ...a, scn: DATA[id].meta.scn, scn_id: id }))
  ).sort((a, b) => b.tgl.localeCompare(a.tgl));

  // Stakeholder: jumlahkan per kategori
  const stakeholder = {};
  scnIds.forEach(id => {
    Object.entries(DATA[id].stakeholder).forEach(([cat, val]) => {
      if (!stakeholder[cat]) stakeholder[cat] = { total: 0, L: 0, P: 0 };
      stakeholder[cat].total += val.total;
      stakeholder[cat].L    += val.L;
      stakeholder[cat].P    += val.P;
    });
  });

  // Cerita: gabung semua
  const cerita = scnIds.flatMap(id =>
    DATA[id].cerita.map(c => ({ ...c, scn: DATA[id].meta.scn }))
  );

  // ITT: jumlahkan capaian dan target dari semua SCN
  const ittAgg = {};
  scnIds.forEach(id => {
    const itt = DATA[id].itt.Y1_Q2;
    Object.entries(itt).forEach(([key, val]) => {
      if (!ittAgg[key]) ittAgg[key] = { cap: 0, target_y1: 0, target_total: 0 };
      ittAgg[key].cap          += val.cap;
      ittAgg[key].target_y1   += val.target_y1;
      ittAgg[key].target_total += val.target_total;
    });
  });

  return {
    meta: { scn: 'Semua SCN', project: 'BEN', provinsi: 'Nasional', tahun: 2026 },
    workers,
    anak,
    referral,
    aktivitas,
    stakeholder,
    cerita,
    itt: { Y1_Q2: ittAgg },
  };
}

// ── UPDATE getScnData agar handle null (Semua SCN) ──
function getScnData(scnId) {
  if (!scnId) return getAllScnData();
  return DATA[scnId] || DATA['manggarai'];
}
