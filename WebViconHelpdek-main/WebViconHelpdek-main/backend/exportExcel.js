const ExcelJS = require('exceljs');

async function exportExcelKegiatan(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Kegiatan');

  // ====== HEADER ======
  const header = [
    'NO', 'TGL', 'WAKTU', 'KEGIATAN', 'NOMOR NODIN',
    'SATKER PEMOHON', 'LOKASI', 'CP Satker & No HP',
    'Petugas, Peralatan dan Akun', 'Keterangan', '', 
  ];
  const subHeader = [
    '', '', '', '', '', '', '', '', '', '', '', 
  ];

  sheet.addRow(header);
  sheet.addRow(subHeader);

  // ====== STYLE HEADER ======
  for (let rowIndex = 1; rowIndex <= 2; rowIndex++) {
    const row = sheet.getRow(rowIndex);
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' } // kuning
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // ====== DATA ======
  data.forEach((item, idx) => {
    // Format date range: show start date, and "start - end" if end exists and differs
    const formatDate = (d) => {
      if (!d) return '';
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('id-ID');
    };
    const tglStart = formatDate(item.tgl_dari);
    const tglEnd = formatDate(item.tgl_sampai);
    const tglDisplay = (tglEnd && tglEnd !== tglStart) ? `${tglStart} - ${tglEnd}` : tglStart;
    // Combine Petugas and Peralatan/Akun into a single cell (column 9)
    const formatList = (v) => {
      if (v === undefined || v === null) return '';
      if (Array.isArray(v)) return v.join(', ');
      return String(v);
    };

    const petugasText = formatList(item.petugas);
    const peralatanText = formatList(item.peralatan_akun);
    const combinedPetugasPeralatan = [petugasText, peralatanText].filter(Boolean).join('\n');

    const row = sheet.addRow([
      idx + 1,
      tglDisplay,
      item.waktu_mulai || '',
      item.nama_kegiatan || '',
      item.nomor_nodin || '',
      item.satker_permohonan || '',
      item.lokasi || '',
      item.cp_satker || '',
      combinedPetugasPeralatan || '',
      item.keterangan || '',
      '',
     
    ]);

    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Kolom 9: Petugas (pink)
    row.getCell(9).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0CB' }
    };

    // Kolom 7: Lokasi (warna dari DB)
    if (item.warna_lokasi) {
      const hex = item.warna_lokasi.replace('#', '').toUpperCase();
      row.getCell(7).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: hex }
      };
    }
  });

  // ====== UKURAN KOLOM ======
  // Adjusted for removed last column (Permintaan ST)
  const colWidths = [4, 12, 12, 40, 20, 18, 20, 25, 30, 18, 8, 8];
  colWidths.forEach((width, i) => {
    sheet.getColumn(i + 1).width = width;
  });

  // ====== KEMBALIKAN BUFFER (bukan writeFile) ======
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { exportExcelKegiatan };
