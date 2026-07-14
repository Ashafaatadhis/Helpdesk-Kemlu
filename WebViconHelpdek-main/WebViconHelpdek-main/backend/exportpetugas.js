// exportpetugas.js (versi ExcelJS, siap-tempel)
const ExcelJS = require('exceljs');

// mapping warna default (HEX tanpa #, sesuai kebutuhan ExcelJS argb)
const lokasiColors = {
  'Kemlu': '00FFFF',
  'Jakarta': '00B050',
  'Bodetabek': 'FFFF00',
  'Luar Kota': 'FF0000',
  'BOGOR': 'FBBF24',
  'DIP': '06B6D4',
  'Bandung': 'F87171',
  'PSJ UI': '34D399',
  'DPK': 'A78BFA',
  'MKAA Bandung': 'FB7185',
  'eL Hotel Bandung': 'FCD34D',
  'BRIN BOGOR': '60A5FA',
  'HTL GRAND HYATT': 'C084FC',
  'Htl Ashley': '4ADE80',
  'SANTIKA-BOGOR': 'FACC15',
  'UI': 'F472B6'
};

function toRGBHex(color) {
  if (!color) return '9F7AEA';
  if (typeof color !== 'string') return '9F7AEA';
  const m = color.match(/^#?([0-9a-fA-F]{6})$/);
  if (m) return m[1].toUpperCase();
  const m2 = color.match(/#([0-9a-fA-F]{6})/);
  if (m2) return m2[1].toUpperCase();
  if (lokasiColors[color]) return lokasiColors[color];
  // fallback
  return '9F7AEA';
}

function pad(n) { return n.toString().padStart(2, '0'); }

async function exportExcelPetugas(pool, month, year, fileName = 'Daftar_Petugas.xlsx') {
  const m = parseInt(month,10) || (new Date()).getMonth()+1;
  const y = parseInt(year,10) || (new Date()).getFullYear();
  const daysInMonth = new Date(y, m, 0).getDate();
  const start = `${y}-${pad(m)}-01`;
  const end = `${y}-${pad(m)}-${pad(daysInMonth)}`;

  // Ambil petugas & kegiatan (sama seperti sebelumnya)
  const petRes = await pool.query(`SELECT * FROM petugas ORDER BY id ASC`);
  const petugas = petRes.rows || [];

  const kegiatanRes = await pool.query(`
    SELECT * FROM kegiatan
    WHERE (tgl_dari <= $1) AND (COALESCE(tgl_sampai, tgl_dari) >= $2)
    ORDER BY tgl_dari ASC
  `, [end, start]);
  const kegiatan = kegiatanRes.rows || [];

  // Build scheduleMap seperti kode kamu dulu
  const scheduleMap = {}; // key: `${nama}::YYYY-MM-DD` => { lokasi, warna_lokasi }
  kegiatan.forEach(k => {
    const petugasField = k.petugas || '';
    let names = [];
    if (Array.isArray(petugasField)) names = petugasField;
    else names = String(petugasField).split(',').map(s => s.trim()).filter(Boolean);

    const startDate = new Date(k.tgl_dari);
    const endDate = new Date(k.tgl_sampai || k.tgl_dari);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate()+1)) {
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth()+1);
      const dd = pad(d.getDate());
      if (parseInt(mm,10) !== m || parseInt(yyyy,10) !== y) continue;
      const dateKey = `${yyyy}-${mm}-${dd}`;
      names.forEach(n => {
        const key = `${n}::${dateKey}`;
        scheduleMap[key] = {
          lokasi: k.lokasi || '',
          warna_lokasi: k.warna_lokasi || k.color || ''
        };
      });
    }
  });

  // Siapkan workbook & worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Petugas', { views: [{state: 'frozen', ySplit: 1}] });
  worksheet.addRow(['Nama', 'Lokasi', '']);

  // Header
  const header = ['No', 'Nama'];
  for (let d = 1; d <= daysInMonth; d++) header.push(String(d));
  const headerRow = worksheet.addRow(header);

  // Header style
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Arial' };
    cell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb: '4472C4' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style:'thin' }, left: { style:'thin' }, bottom: { style:'thin' }, right: { style:'thin' }
    };
  });
  worksheet.getRow(1).height = 22;

  // Tambah data baris per petugas
  petugas.forEach((p, idx) => {
    const rowVals = [];
    rowVals.push(idx + 1);
    rowVals.push(p.nama || '');
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${pad(m)}-${pad(d)}`;
      const key = `${p.nama}::${dateStr}`;
      const item = scheduleMap[key];
      if (item) {
        // isi dengan nama lokasi (atau warna saja jika memang itu yang disimpan)
        rowVals.push(item.lokasi || item.warna_lokasi || '');
      } else {
        rowVals.push('');
      }
    }
    const r = worksheet.addRow(rowVals);

    // gaya untuk No & Nama
    const cellNo = r.getCell(1);
    cellNo.alignment = { horizontal: 'center', vertical: 'middle' };
    cellNo.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

    const cellName = r.getCell(2);
    cellName.font = { bold: true, name: 'Arial' };
    cellName.alignment = { horizontal: 'left', vertical: 'middle' };
    cellName.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

    // warna tiap kolom hari (kolom index 3..)
    for (let c = 3; c <= 2 + daysInMonth; c++) {
      const cell = r.getCell(c);
      // compute date for this column
      const dayIndex = c - 2; // 1..daysInMonth
      const dateStr = `${y}-${pad(m)}-${pad(dayIndex)}`;
      const key = `${p.nama}::${dateStr}`;
      const item = scheduleMap[key];
      if (item) {
        // display the lokasi text but color using warna_lokasi if present
        const displayText = item.lokasi || item.warna_lokasi || '';
        cell.value = displayText;

        // prefer warna_lokasi for color; if empty fallback to interpreting lokasi
        const colorSource = (item.warna_lokasi && String(item.warna_lokasi).trim()) ? item.warna_lokasi : item.lokasi;
        const hex = toRGBHex(colorSource); // hasil tanpa '#', e.g. '00B050'
        const argb = (hex.length === 6 ? 'FF' + hex : 'FF9F7AEA');
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };

        // set font color berdasarkan brightness (biar kontras)
        try {
          const r0 = parseInt(hex.slice(0,2),16);
          const g0 = parseInt(hex.slice(2,4),16);
          const b0 = parseInt(hex.slice(4,6),16);
          const lum = (0.299*r0 + 0.587*g0 + 0.114*b0)/255;
          const fontColor = lum > 0.6 ? 'FF000000' : 'FFFFFFFF';
          cell.font = { bold: true, color: { argb: fontColor } };
        } catch (e) {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        }

        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      } else {
        // kosong -> tetap border & alignment
        cell.value = cell.value || '';
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      }
    }
  });

  // Lebar kolom
  worksheet.getColumn(1).width = 5;  // No
  worksheet.getColumn(2).width = 30; // Nama
  for (let c = 3; c <= 2 + daysInMonth; c++) worksheet.getColumn(c).width = 6;

  // Opsi: zebra striping (alternating row color) agar lebih mudah dibaca
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 1) return;
    if (rowNumber % 2 === 0) {
      // sedikit background putih kebiruan untuk baris genap (alpha FF + hex)
      row.eachCell(cell => {
        // jangan override cell yang sudah diwarnai (lokasi)
        if (!cell.fill || !cell.fill.fgColor || !cell.fill.fgColor.argb || cell.fill.fgColor.argb === 'FF9F7AEA') {
          // set very light fill for whole row cells that are empty
          // kita apply hanya jika cell.value kosong supaya tidak override lokasi colors
          if (!cell.value || String(cell.value).trim() === '') {
            cell.fill = { type:'pattern', pattern:'solid', fgColor: { argb: 'FFF7FBFF' } };
          }
        }
      });
    }
  });

  // Save file
  await workbook.xlsx.writeFile(fileName);
  console.log('✅ Excel berhasil dibuat:', fileName);
}

module.exports = { exportExcelPetugas };
