const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Create a dedicated pool for this router with sensible defaults
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'helpdeskpustik',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || 5432,
});

// Ensure petugas table exists (safe to run on every request start)
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS petugas (
      id SERIAL PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      jabatan VARCHAR(255),
      kontak VARCHAR(255),
      email VARCHAR(255),
      tanggal_lahir DATE,
      domisili VARCHAR(255),
      status VARCHAR(32) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // create trigger function for updated_at if not exists
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
  await pool.query(`
    CREATE TRIGGER IF NOT EXISTS set_updated_at_petugas
    BEFORE UPDATE ON petugas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `).catch(() => {});
}

// List all petugas
router.get('/petugas', async (req, res) => {
  try {
    await ensureTable();
    const result = await pool.query('SELECT * FROM petugas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching petugas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new petugas (form submit)
router.post('/petugas-form', async (req, res) => {
  try {
    await ensureTable();
    const { nama, jabatan, kontak, email, tanggal_lahir, domisili, status } = req.body;

    const result = await pool.query(
      `INSERT INTO petugas (nama, jabatan, kontak, email, tanggal_lahir, domisili, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [nama, jabatan, kontak, email, tanggal_lahir || null, domisili, status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting petugas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single petugas by id
router.get('/petugas/:id', async (req, res) => {
  try {
    await ensureTable();
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM petugas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Petugas tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching petugas by id:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update petugas status (PATCH /petugas/:id/status)
router.patch('/petugas/:id/status', async (req, res) => {
  try {
    await ensureTable();
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE petugas SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Petugas tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating petugas status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete petugas
router.delete('/petugas/:id', async (req, res) => {
  try {
    await ensureTable();
    const { id } = req.params;
    const result = await pool.query('DELETE FROM petugas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Petugas tidak ditemukan' });
    res.json({ message: 'Petugas berhasil dihapus', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting petugas:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
