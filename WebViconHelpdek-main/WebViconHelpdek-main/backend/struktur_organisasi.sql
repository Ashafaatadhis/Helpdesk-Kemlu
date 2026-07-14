-- Create struktur_organisasi table
CREATE TABLE IF NOT EXISTS struktur_organisasi (
    id SERIAL PRIMARY KEY,
    nama_unit VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    level_unit INTEGER,
    parent_id INTEGER REFERENCES struktur_organisasi(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO struktur_organisasi (nama_unit, deskripsi, level_unit) VALUES
('Sekretariat Jenderal', 'Sekretariat Jenderal Kementerian', 1),
('Direktorat Jenderal Amerika dan Eropa', 'Direktorat Jenderal Amerika dan Eropa', 1),
('Direktorat Jenderal Asia Pasifik dan Afrika', 'Direktorat Jenderal Asia Pasifik dan Afrika', 1),
('Direktorat Jenderal ASEAN', 'Direktorat Jenderal ASEAN', 1),
('Direktorat Jenderal Multilateral', 'Direktorat Jenderal Multilateral', 1),
('Direktorat Jenderal Protokol dan Konsuler', 'Direktorat Jenderal Protokol dan Konsuler', 1),
('Direktorat Jenderal Informasi dan Diplomasi Publik', 'Direktorat Jenderal Informasi dan Diplomasi Publik', 1),
('Inspektorat Jenderal', 'Inspektorat Jenderal', 1),
('Badan Pengkajian dan Pengembangan Kebijakan', 'Badan Pengkajian dan Pengembangan Kebijakan', 1),
('Pusat Teknologi Informasi dan Komunikasi Kementerian', 'Pusat Teknologi Informasi dan Komunikasi Kementerian', 2),
('Pusat Pendidikan dan Pelatihan', 'Pusat Pendidikan dan Pelatihan', 2),
('Pusat Kesehatan', 'Pusat Kesehatan', 2),
('Biro Perencanaan', 'Biro Perencanaan', 2),
('Biro Organisasi dan Tata Laksana', 'Biro Organisasi dan Tata Laksana', 2),
('Biro Kepegawaian', 'Biro Kepegawaian', 2),
('Biro Keuangan', 'Biro Keuangan', 2),
('Biro Perlengkapan', 'Biro Perlengkapan', 2),
('Biro Umum', 'Biro Umum', 2);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_struktur_organisasi_updated_at
    BEFORE UPDATE ON struktur_organisasi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();