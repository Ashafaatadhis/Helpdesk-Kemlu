const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool();

// Get all struktur organisasi
router.get('/struktur-organisasi', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM struktur_organisasi'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching struktur organisasi:', err);
    res.status(500).json({ error: err.message });
  }
});


// Get struktur organisasi by ID
router.get('/struktur-organisasi/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM struktur_organisasi WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching struktur organisasi by id:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new struktur organisasi
router.post('/struktur-organisasi', async (req, res) => {
    const { nama_unit, deskripsi, level_unit, parent_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO struktur_organisasi (nama_unit, deskripsi, parent_id) VALUES ($1, $2, $3) RETURNING *',
[nama_unit, deskripsi, parent_id]

        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding struktur organisasi:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update struktur organisasi
router.put('/struktur-organisasi/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_unit, deskripsi, level_unit, parent_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE struktur_organisasi SET nama_unit = $1, deskripsi = $2, parent_id = $3 WHERE id = $4 RETURNING *',
[nama_unit, deskripsi, parent_id, id]

        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating struktur organisasi:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete struktur organisasi
router.delete('/struktur-organisasi/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check if there are any child units
        const children = await pool.query(
            'SELECT id FROM struktur_organisasi WHERE parent_id = $1',
            [id]
        );
        if (children.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Tidak dapat menghapus unit yang memiliki sub-unit' 
            });
        }

        const result = await pool.query(
            'DELETE FROM struktur_organisasi WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit tidak ditemukan' });
        }
        res.json({ 
            message: 'Unit berhasil dihapus', 
            deletedUnit: result.rows[0] 
        });
    } catch (err) {
        console.error('Error deleting struktur organisasi:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;