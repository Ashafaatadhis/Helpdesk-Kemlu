const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { exportExcelKegiatan } = require('./exportExcel');
const { exportExcelPetugas } = require('./exportpetugas');

// ========== KONEKSI DATABASE ==========
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'helpdeskpustik',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Successfully connected to PostgreSQL database');
    release();
  }
});

// ========== ROUTES ==========

// --- KEGIATAN PER TAHUN ---
router.get('/api/kegiatan-per-tahun', async (req, res) => {
    try {
        let year = parseInt(req.query.year, 10);
        if (!year || isNaN(year)) {
            year = new Date().getFullYear();
        }
        // Query: hitung jumlah kegiatan per bulan (1-12) untuk tahun tertentu
        const result = await pool.query(
            `SELECT EXTRACT(MONTH FROM tgl_dari) AS bulan, COUNT(*) AS jumlah
             FROM kegiatan
             WHERE EXTRACT(YEAR FROM tgl_dari) = $1
             GROUP BY bulan
             ORDER BY bulan ASC`,
            [year]
        );
        // Buat array 12 bulan, default 0
        const data = Array(12).fill(0);
        result.rows.forEach(row => {
            const bulan = parseInt(row.bulan, 10);
            if (bulan >= 1 && bulan <= 12) {
                data[bulan - 1] = parseInt(row.jumlah, 10);
            }
        });
        res.json({ year, data });
    } catch (err) {
        console.error('Gagal rekap kegiatan per tahun:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/pengaduan-per-satker-bulan-ini: Rekap jumlah pengaduan/kegiatan per satker bulan ini
router.get('/api/pengaduan-per-satker-bulan-ini', async (req, res) => {
    try {
        // Mapping key satker sesuai frontend
        const keyMap = {
            staffAhli: ['staff ahli', 'staff_ahli'],
            inspektoratJenderal: ['inspektorat jenderal'],
            sekretariatJenderal: ['sekjen', 'sekretariat jenderal'],
            dirjenAsiaPasifikAfrika: ['ditjen_asiapasifikafrika', 'asia pasifik afrika'],
            dirjenAmerikaEropa: ['ditjen_amerikaeropa', 'amerika eropa'],
            dirjenKerjasamaASEAN: ['ditjen_asean', 'kerjasama asean', 'asean'],
            dirjenKerjasamaMultilateral: ['ditjen_multilateral', 'multilateral'],
            dirjenHukumPerjanjian: ['ditjen_hukumperjanjian', 'hukum perjanjian'],
            dirjenHubunganEkonomi: ['ditjen_hubunganekonomikerjasamapembangunan', 'hubunganekonomikerjasamapembangunan'],
            dirjenInformasiDiplomasi: ['ditjen_informasidiplomasipublik', 'informasi diplomasi', 'informasidiplomasipublik'],
            dirjenProtokolKonsuler: ['ditjen_protokolkonsuler', 'protokolkonsuler'],
            badanStrategiKebijakan: ['badan strategi kebijakan', 'psk multilateral']
        };

        // Ambil bulan dan tahun sekarang
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Query rekap per satker_permohonan bulan ini
        const result = await pool.query(
            `SELECT satker_permohonan, COUNT(*) as jumlah
             FROM kegiatan
             WHERE EXTRACT(MONTH FROM tgl_dari) = $1 AND EXTRACT(YEAR FROM tgl_dari) = $2
             GROUP BY satker_permohonan`,
            [month, year]
        );

        // Inisialisasi hasil sesuai key frontend
        const data = {};
        Object.keys(keyMap).forEach(key => { data[key] = 0; });

        // Rekap hasil query ke key frontend
        result.rows.forEach(row => {
            const satker = row.satker_permohonan;
            const jumlah = parseInt(row.jumlah, 10);
            for (const key in keyMap) {
                if (keyMap[key].some(label => (satker||'').toLowerCase().includes(label.toLowerCase()))) {
                    data[key] += jumlah;
                    break;
                }
            }
        });

        res.json(data);
    } catch (err) {
        console.error('Gagal rekap pengaduan per satker:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- KEGIATAN TERKINI ---
// GET /api/kegiatan-terkini: Ambil 5 data kegiatan terbaru
router.get('/api/kegiatan-terkini', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM kegiatan ORDER BY tgl_dari DESC LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/export-petugas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kegiatan ORDER BY id ASC');
    const buffer = await exportExcelPetugas(result.rows);

    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      'attachment; filename=Daftar_Petugas.xlsx');

    res.send(buffer);
  } catch (err) {
    console.error('Error exporting Petugas Excel:', err);
    res.status(500).json({ error: 'Gagal export Petugas Excel' });
  }
});


// --- GET DAFTAR SATUAN KERJA ---
router.get('/api/satuan-kerja', async (req, res) => {
  try {
    const satkerList = [
      "Staff Ahli",
      "Itjen",
      "Sekjen",
      "Ditjen Asia Pasifik Afrika",
      "Ditjen Amerika Eropa",
      "Ditjen ASEAN",
      "Ditjen Multilateral",
      "Ditjen Hukum Perjanjian Internasional",
      "Ditjen Hubungan Ekonomi Kerjasama Pembangunan",
      "Ditjen Informasi Diplomasi Publik",
      "Ditjen Protokol Konsuler",
      "Badan Strategi Kebijakan Luar Negeri"
    ];
    res.json(satkerList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// --- EXPORT EXCEL ---
// --- EXPORT EXCEL (PER MINGGU) ---
router.get('/export-excel-week', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing required query params: start and end (YYYY-MM-DD)' });
    }

    // Basic date validation
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for start or end. Use YYYY-MM-DD' });
    }

    // Select kegiatan that overlap the provided inclusive date range.
    // We include any kegiatan where tgl_dari <= end AND tgl_sampai >= start (overlap test).
    const result = await pool.query(
      `SELECT * FROM kegiatan WHERE (COALESCE(tgl_dari::date, tgl_sampai::date) IS NOT NULL) AND (tgl_dari::date <= $2::date AND tgl_sampai::date >= $1::date) ORDER BY id ASC`,
      [start, end]
    );

    const buffer = await exportExcelKegiatan(result.rows);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Daftar_Kegiatan_${start}_to_${end}.xlsx`);

    res.send(buffer);
  } catch (err) {
    console.error('Error exporting weekly Excel:', err);
    res.status(500).json({ error: 'Gagal export Excel per minggu' });
  }
});

// --- EXPORT EXCEL (PER BULAN / ALL) ---
router.get('/export-excel', async (req, res) => {
  try {
    const { month, year } = req.query;

    let result;
    let filename = 'Daftar_Kegiatan.xlsx';

    if (month && year) {
      // Validate month/year
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
        return res.status(400).json({ error: 'Invalid month or year' });
      }

      // Compute first and last day of the month
      const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
      const lastDate = new Date(y, m, 0).getDate();
      const lastDay = `${y}-${String(m).padStart(2, '0')}-${String(lastDate).padStart(2, '0')}`;

      // Select kegiatan that overlap the month (tgl_dari <= lastDay AND tgl_sampai >= firstDay)
      result = await pool.query(
        `SELECT * FROM kegiatan WHERE (COALESCE(tgl_dari::date, tgl_sampai::date) IS NOT NULL) AND (tgl_dari::date <= $2::date AND tgl_sampai::date >= $1::date) ORDER BY id ASC`,
        [firstDay, lastDay]
      );

  // Use Indonesian month name for filename, e.g. Daftar_Kegiatan_Oktober_2025.xlsx
  const monthName = new Date(y, m - 1, 1).toLocaleString('id-ID', { month: 'long' });
  // Remove spaces just in case, and capitalize first letter
  const safeMonth = monthName.replace(/\s+/g, '_');
  filename = `Daftar_Kegiatan_${safeMonth}_${y}.xlsx`;
    } else {
      // default: export all
      result = await pool.query('SELECT * FROM kegiatan ORDER BY id ASC');
    }

    const buffer = await exportExcelKegiatan(result.rows);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    res.send(buffer);
  } catch (err) {
    console.error('Error exporting Excel:', err);
    res.status(500).json({ error: 'Gagal export Excel' });
  }
});

// --- CRUD KEGIATAN ---
router.post('/kegiatan-form', async (req, res) => {
  const {
    nama_kegiatan, deskripsi, tgl_dari, tgl_sampai, waktu_mulai, waktu_selesai,
    nomor_nodin, satker_permohonan, eselon, lokasi, warna_lokasi,
    cp_satker, petugas, peralatan_akun, status
  } = req.body;

  const safeValue = v =>
    (v === undefined || v === null || v === '') ? null :
      (Array.isArray(v) ? v.join(', ') : String(v));

  const values = [
    safeValue(nama_kegiatan),
    safeValue(deskripsi),
    safeValue(tgl_dari),
    safeValue(tgl_sampai),
    safeValue(waktu_mulai),
    safeValue(waktu_selesai),
    safeValue(nomor_nodin),
    safeValue(satker_permohonan),
    safeValue(eselon),
    safeValue(lokasi),
    safeValue(warna_lokasi),
    safeValue(cp_satker),
    safeValue(petugas),
    safeValue(peralatan_akun),
    safeValue(status)
  ];

  try {
    const result = await pool.query(
      `INSERT INTO kegiatan (nama_kegiatan, deskripsi, tgl_dari, tgl_sampai, waktu_mulai, waktu_selesai,
        nomor_nodin, satker_permohonan, eselon, lokasi, warna_lokasi, cp_satker, petugas, peralatan_akun, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/laporan', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kegiatan ORDER BY tgl_dari DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/laporan/hapus-semua', async (req, res) => {
  try {
    await pool.query('DELETE FROM kegiatan');
    res.json({ message: 'Semua data kegiatan berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/kegiatan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/kegiatan/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nama_kegiatan, deskripsi, tgl_dari, tgl_sampai, waktu_mulai, waktu_selesai,
    nomor_nodin, satker_permohonan, lokasi, cp_satker, petugas, peralatan_akun, status
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE kegiatan SET nama_kegiatan = $1, deskripsi = $2, tgl_dari = $3, tgl_sampai = $4,
       waktu_mulai = $5, waktu_selesai = $6, nomor_nodin = $7, satker_permohonan = $8, lokasi = $9,
       cp_satker = $10, petugas = $11, peralatan_akun = $12, status = $13 WHERE id = $14 RETURNING *`,
      [nama_kegiatan, deskripsi, tgl_dari, tgl_sampai, waktu_mulai, waktu_selesai,
       nomor_nodin, satker_permohonan, lokasi, cp_satker,
       Array.isArray(petugas) ? petugas.join(', ') : petugas, peralatan_akun, status, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/kegiatan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM kegiatan WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    res.json({ message: 'Kegiatan berhasil dihapus', deletedKegiatan: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
