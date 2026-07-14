// setupDatabase.js
// Jalankan: node setupDatabase.js
// Script ini akan membuat database, tabel, dan relasi jika belum ada.

const { Client } = require('pg');

const dbName = process.env.PGDATABASE || 'helpdeskpustik';
const dbUser = process.env.PGUSER || 'postgres';
const dbPass = process.env.PGPASSWORD || '';
const dbHost = process.env.PGHOST || 'localhost';
const dbPort = process.env.PGPORT || 5432;

async function createDatabaseIfNotExists() {
  const client = new Client({
    user: dbUser,
    host: dbHost,
    password: dbPass,
    port: dbPort,
    database: 'postgres',
  });
  await client.connect();
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log('Database created:', dbName);
  } else {
    console.log('Database already exists:', dbName);
  }
  await client.end();
}

async function setupTables() {
  const client = new Client({
    user: dbUser,
    host: dbHost,
    password: dbPass,
    port: dbPort,
    database: dbName,
  });
  await client.connect();
  // Struktur organisasi
  await client.query(`CREATE TABLE IF NOT EXISTS struktur_organisasi (
    id SERIAL PRIMARY KEY,
    nama_unit VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    level_unit INTEGER,
    parent_id INTEGER REFERENCES struktur_organisasi(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  // Kegiatan
  await client.query(`CREATE TABLE IF NOT EXISTS kegiatan (
    id SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tgl_dari DATE NOT NULL,
    tgl_sampai DATE,
    waktu_mulai TIME,
    waktu_selesai TIME,
    nomor_nodin VARCHAR(255),
    satker_permohonan VARCHAR(255),
    eselon VARCHAR(255),
    lokasi VARCHAR(255),
    warna_lokasi VARCHAR(32),
    cp_satker VARCHAR(255),
    petugas TEXT,
    peralatan_akun TEXT,
    status VARCHAR(32) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  // Function & trigger update_updated_at_column
  await client.query(`CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';`);
  await client.query(`DROP TRIGGER IF EXISTS set_updated_at_struktur_organisasi ON struktur_organisasi;`);
  await client.query(`CREATE TRIGGER set_updated_at_struktur_organisasi
BEFORE UPDATE ON struktur_organisasi
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();`);
  await client.query(`DROP TRIGGER IF EXISTS set_updated_at_kegiatan ON kegiatan;`);
  await client.query(`CREATE TRIGGER set_updated_at_kegiatan
BEFORE UPDATE ON kegiatan
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();`);
  await client.end();
  console.log('Tabel dan relasi sudah siap.');
}

(async () => {
  await createDatabaseIfNotExists();
  await setupTables();
  console.log('Setup database selesai.');
})();
