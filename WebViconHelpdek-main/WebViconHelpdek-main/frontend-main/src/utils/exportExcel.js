// import * as XLSX from 'xlsx';

// // Fungsi exportExcel untuk format sesuai permintaan
// export function exportExcel(data) {
//   // Data harus berupa array of object dengan key sesuai header baru
//   // Header: tanggal, waktu, kegiatan, nomor nodin, satker permohonan, lokasi, cp satker dan no kontak, petugas peralatan dan akun, keterangan
//   const formatted = data.map(item => ({
//     'tanggal': item.tanggal || item.TANGGAL || '',
//     'waktu': item.waktu || item.WAKTU || '',
//     'kegiatan': item.kegiatan || item.KEGIATAN || '',
//     'nomor nodin': item['nomor nodin'] || item['NOMOR NODIN'] || '',
//     'satker permohonan': item['satker permohonan'] || item['SATKER PEMOHON'] || '',
//     'lokasi': item.lokasi || item.LOKASI || '',
//     'cp satker dan no kontak': item['cp satker dan no kontak'] || item['CP Satker & No'] || item['CP Satker & No Kontak'] || '',
//     'petugas peralatan dan akun': item['petugas peralatan dan akun'] || item['Petugas, Peralatan dan Akun'] || '',
//     'keterangan': item.keterangan || item.KETERANGAN || '',
//   }));
//   const ws = XLSX.utils.json_to_sheet(formatted, {header: [
//     'tanggal',
//     'waktu',
//     'kegiatan',
//     'nomor nodin',
//     'satker permohonan',
//     'lokasi',
//     'cp satker dan no kontak',
//     'petugas peralatan dan akun',
//     'keterangan',
//   ]});
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Kegiatan');
//   XLSX.writeFile(wb, 'Daftar_Kegiatan.xlsx');
// }
