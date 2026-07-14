const express = require('express');
require('dotenv').config(); // Wajib di paling atas
const { Pool } = require('pg');
const { exportExcelPetugas } = require('./exportpetugas'); // Import fungsi export
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// === KONFIGURASI DATABASE ===
const pool = new Pool();

// === DEBUG ENVIRONMENT VARIABLE ===
console.log('=== ENV VARIABLES FROM INDEX.JS ===');
console.log('PGUSER:', process.env.PGUSER || 'NOT SET');
console.log('PGHOST:', process.env.PGHOST || 'NOT SET');
console.log('PGDATABASE:', process.env.PGDATABASE || 'NOT SET');
console.log('PGPORT:', process.env.PGPORT || 'NOT SET');
console.log('===================================');

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === ROUTER ===
const kegiatanRouter = require('./kegiatan');
const strukturOrganisasiRouter = require('./strukturOrganisasi');
const petugasRouter = require('./petugas');

app.use('/', kegiatanRouter);
app.use('/', strukturOrganisasiRouter);
app.use('/', petugasRouter);

// === ROUTE EXPORT EXCEL (JADWAL PETUGAS) ===
app.get('/export/petugas/:year/:month', async (req, res) => {
  try {
    const { month, year } = req.params;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and Year are required' });
    }

    // Generate nama file sementara
    const fileName = `temp_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, fileName);

    // Buat file Excel
    await exportExcelPetugas(pool, month, year, filePath);

    // Kirim file ke client
    res.download(filePath, `Jadwal_Petugas_${month}_${year}.xlsx`, (err) => {
      // Hapus file setelah dikirim
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });

      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export Excel file' });
  }
});

// === LOGIN ROUTE (Simple One-User Auth) ===
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // username & password tetap seperti permintaanmu
  if (username === "vicon" && password === "viconkemlu@") {
    // generate token sederhana (tanpa JWT dulu)
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: { username },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Username atau password salah",
  });
});


// === DEFAULT ROUTE ===
app.get('/', (req, res) => {
  res.send('Backend Express.js server is running!');
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
