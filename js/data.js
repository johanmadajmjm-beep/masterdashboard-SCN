// data.js — Central dummy data store
// Nanti diganti fetch ke Apps Script

const DATA = {
  manggarai: {
    meta: { scn: 'SCN Manggarai', project: 'BEN', tahun: 2026 },

    workers: [
      { id:'elfrida',    nama:'Elfrida Suryati',       anak:8,  kunjungan_bulan:6,  irp_aktif:5,  late:0 },
      { id:'jack',       nama:'Jack Roka',              anak:24, kunjungan_bulan:18, irp_aktif:16, late:3 },
      { id:'laurens',    nama:'Laurensius Herbianto',   anak:41, kunjungan_bulan:30, irp_aktif:28, late:2 },
      { id:'leonardus',  nama:'Leonardus M. Mawardi',  anak:26, kunjungan_bulan:20, irp_aktif:18, late:1 },
      { id:'magdalena',  nama:'Magdalena Sabe',         anak:30, kunjungan_bulan:22, irp_aktif:20, late:2 },
      { id:'diana',      nama:'Maria Diana Banut',      anak:20, kunjungan_bulan:14, irp_aktif:12, late:1 },
      { id:'miseldis',   nama:'Miseldis Halmida',       anak:28, kunjungan_bulan:19, irp_aktif:16, late:2 },
      { id:'stanis',     nama:'Stanis J. Ngalu',        anak:23, kunjungan_bulan:15, irp_aktif:14, late:1 },
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
      { nama:'Yohanes Deki',   tujuan:'Puskesmas Langke Rembong', status:'Proses',  tgl:'2026-05-10', cbr:'jack' },
      { nama:'Maria Leni',     tujuan:'RS Umum Ruteng',           status:'Selesai', tgl:'2026-04-22', cbr:'jack' },
      { nama:'Florianus Tedo', tujuan:'Dinas Sosial Manggarai',   status:'Proses',  tgl:'2026-05-18', cbr:'jack' },
      { nama:'Theresia Wela',  tujuan:'Puskesmas Satarmese',      status:'Selesai', tgl:'2026-05-02', cbr:'magdalena' },
      { nama:'Andreas Moa',    tujuan:'RSUD Ruteng',              status:'Proses',  tgl:'2026-06-01', cbr:'laurens' },
    ],

    aktivitas: [
      { tgl:'2026-06-18', nama:'Penguatan Kapasitas DPO PERTUNI', outcome:3, peserta:27, lokasi:'Aula Dinas Sosial', output:'DPO yang melaporkan peningkatan kapasitas' },
      { tgl:'2026-06-15', nama:'SRHR Awareness & Education',     outcome:4, peserta:37, lokasi:'SMPN 1 Satarmese',  output:'CYWD yang memanfaatkan layanan KSR' },
      { tgl:'2026-06-08', nama:'Penguatan Forum Orang Tua',       outcome:2, peserta:30, lokasi:'Aula YKM Ruteng',   output:'Forum Orang Tua aktif terbentuk' },
      { tgl:'2026-05-29', nama:'TOT Pendidikan Inklusi',          outcome:5, peserta:59, lokasi:'Aula YKM Ruteng',   output:'Sekolah dengan peningkatan kualitas pengajaran' },
    ],

    stakeholder: {
      Guru:           { total:55, L:25, P:30 },
      'Staff Mitra':  { total:7,  L:5,  P:2  },
      'Pengasuh/Ortu':{ total:12, L:3,  P:9  },
      Nakes:          { total:8,  L:3,  P:5  },
      Pemerintah:     { total:10, L:7,  P:3  },
      'CBR Worker':   { total:8,  L:3,  P:5  },
    },

    itt: {
      Y1_Q2: { // kumulatif Jan–Jun 2026
        'O1-i1':{ cap:22, target_y1:50,  target_total:150 },
        'O1-i2':{ cap:15, target_y1:30,  target_total:100 },
        'O1-i3':{ cap:195,target_y1:200, target_total:200 },
        'O1-i4':{ cap:32, target_y1:40,  target_total:120 },
        'O1-i5':{ cap:28, target_y1:40,  target_total:120 },
        'O1-i6':{ cap:48, target_y1:35,  target_total:100 },
        'O2-i1':{ cap:65, target_y1:100, target_total:200 },
        'O2-i2':{ cap:35, target_y1:60,  target_total:150 },
        'O2-i3':{ cap:48, target_y1:80,  target_total:180 },
        'O2-i4':{ cap:5,  target_y1:8,   target_total:20  },
        'O3-i1':{ cap:3,  target_y1:4,   target_total:8   },
        'O3-i2':{ cap:18, target_y1:40,  target_total:120 },
        'O3-i3':{ cap:8,  target_y1:8,   target_total:40  },
        'O3-i4':{ cap:8,  target_y1:8,   target_total:40  },
        'O3-i5':{ cap:4,  target_y1:4,   target_total:8   },
        'O4-i1':{ cap:3,  target_y1:5,   target_total:15  },
        'O4-i2':{ cap:5,  target_y1:8,   target_total:20  },
        'O4-i3':{ cap:15, target_y1:20,  target_total:60  },
        'O4-i4':{ cap:9,  target_y1:20,  target_total:50  },
        'O4-i5':{ cap:12, target_y1:30,  target_total:80  },
        'O5-i1':{ cap:35, target_y1:50,  target_total:120 },
        'O5-i2':{ cap:22, target_y1:40,  target_total:100 },
        'O5-i3':{ cap:5,  target_y1:10,  target_total:30  },
        'O5-i4':{ cap:4,  target_y1:8,   target_total:20  },
        'O5-i5':{ cap:16, target_y1:20,  target_total:50  },
        'O6-i1':{ cap:5,  target_y1:20,  target_total:60  },
        'O6-i2':{ cap:8,  target_y1:25,  target_total:80  },
        'O6-i3':{ cap:1,  target_y1:2,   target_total:5   },
        'O6-i4':{ cap:2,  target_y1:6,   target_total:20  },
        'O7-i1':{ cap:1,  target_y1:3,   target_total:10  },
        'O7-i2':{ cap:4,  target_y1:10,  target_total:30  },
        'O7-i3':{ cap:1,  target_y1:2,   target_total:8   },
        'O7-i4':{ cap:2,  target_y1:4,   target_total:12  },
        'O7-i5':{ cap:0,  target_y1:0,   target_total:0   },
      }
    },

    cerita: [
      {
        nama:'Yohanes, 8 Tahun',
        lokasi:'Desa Wae Rebo, Kecamatan Langke Rembong',
        worker:'Jack Roka',
        tanggal:'Mei 2026',
        narasi:'Sebelum program, Yohanes tidak bisa duduk sendiri karena kondisi fisiknya. Setelah 6 bulan pendampingan intensif, ia kini mampu duduk mandiri dan mulai merespons panggilan namanya. Orang tuanya mengatakan ini adalah pertama kalinya mereka merasa ada harapan.',
        tag:'Perkembangan Anak'
      },
      {
        nama:'Keluarga Maria, Desa Lamba',
        lokasi:'Desa Lamba, Kecamatan Satarmese',
        worker:'Magdalena Sabe',
        tanggal:'April 2026',
        narasi:'Orang tua Maria awalnya menyembunyikan anaknya karena malu. Melalui sesi edukasi bersama CBR worker dan pastor desa, keluarga kini aktif membawa Maria ke kegiatan komunitas setiap minggu.',
        tag:'Keluarga & Komunitas'
      },
      {
        nama:'Forum Orang Tua Langke Rembong',
        lokasi:'Kecamatan Langke Rembong',
        worker:'Tim SCN Manggarai',
        tanggal:'Juni 2026',
        narasi:'Terbentuknya Forum Orang Tua anak disabilitas di Kecamatan Langke Rembong menjadi tonggak penting. 30 orang tua kini punya wadah untuk saling mendukung, berbagi pengalaman, dan secara kolektif mengadvokasi hak anak-anak mereka.',
        tag:'DPO & Komunitas'
      },
    ]
  }
};

// Helper global
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
function getScnData(scnId) { return DATA[scnId] || DATA['manggarai']; }

// Outcome meta
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
