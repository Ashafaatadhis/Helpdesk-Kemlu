-- Migration: Add warna_lokasi to kegiatan table
ALTER TABLE kegiatan ADD COLUMN warna_lokasi VARCHAR(32);