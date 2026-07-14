# E-Helpdesk Frontend

Frontend aplikasi E-Helpdesk ini dibangun menggunakan Vue.js 3 dan Argon Dashboard. Sistem ini terintegrasi dengan backend Express.js dan PostgreSQL untuk pengelolaan jadwal dinas, pengaduan, petugas, dan struktur organisasi.

---

## Teknologi
- Vue.js 3
- Vue Router
- Vuex
- Argon Dashboard (Creative Tim)
- SweetAlert2
- FullCalendar
- Axios
- SCSS

## Instalasi & Menjalankan
```bash
cd frontend-main
npm install
npm run serve   # Development
npm run build   # Production
```

## Struktur Folder
- `src/`
  - `assets/` : CSS, font, gambar, JS, SCSS
  - `components/` : Komponen UI (CustomDropdown, Alert, SuccessPopup, dsb)
  - `examples/` : Komponen contoh (Charts, Sidenav, Table)
  - `router/` : Routing aplikasi
  - `store/` : State management (Vuex)
  - `views/` : Halaman utama (Dashboard, Kalender Dinas, Profile, dsb)
- `public/` : Static files (favicon, logo, index.html)
- `babel.config.js`, `vue.config.js` : Konfigurasi build
- `package.json` : Dependency dan script

## Fitur Utama
- **Dashboard**: Statistik, chart kegiatan per tahun, tabel aktivitas terbaru
- **Kalender Dinas**: Jadwal dinas petugas, warna lokasi, detail kegiatan, export Excel
- **Profile**: Data user
- **Manajemen Petugas**: CRUD petugas
- **Struktur Organisasi**: Manajemen unit organisasi
- **Laporan**: Rekap kegiatan dan pengaduan

## Integrasi API
Aplikasi frontend mengambil data dinamis dari backend melalui Axios. Contoh endpoint yang digunakan:
- `GET /api/kegiatan-per-tahun?year=YYYY` : Data chart kegiatan per tahun
- `GET /api/kegiatan-terkini` : Tabel aktivitas terbaru
- `GET /struktur-organisasi` : Struktur organisasi
- `GET /api/pengaduan-per-satker-bulan-ini` : Rekap pengaduan

## Routing Utama
- `/dashboard-default` : Dashboard utama
- `/kalender-dinas` : Kalender dinas petugas
- `/laporan` : Laporan kegiatan
- `/petugas` : Manajemen petugas
- `/profile` : Profil user
- `/kegiatan-form` : Form tambah/edit kegiatan
- `/kegiatan-detail/:id` : Detail kegiatan
- `/petugas-detail/:id` : Detail petugas
- `/signup` dan `/signin` : Registrasi dan login

## Komponen Penting
- `BarChartWidget.vue` : Chart kegiatan per tahun
- `PieChartWidget.vue` : Chart rekap pengaduan
- `RecentActivityTable.vue` : Tabel aktivitas terbaru
- `TabelDinas.vue` : Kalender dinas petugas
- `CustomDropdown.vue`, `SuccessAlert.vue`, dsb : Komponen UI

## Konfigurasi
- Konfigurasi API endpoint dapat diubah pada file axios atau environment frontend jika diperlukan.
- SCSS dan CSS dapat dimodifikasi di folder `src/assets/`.

## Deployment
- Build aplikasi dengan `npm run build`, hasilnya ada di folder `dist/`.
- Deploy folder `dist/` ke server web (Nginx, Apache, dsb).

## Pengembangan
- Ikuti struktur folder dan coding style yang sudah ada.
- Tambahkan dokumentasi pada setiap komponen/fungsi baru.
- Gunakan branch dan pull request untuk pengembangan fitur.

## Kontak & Support
Untuk pertanyaan, bug, atau permintaan fitur, silakan hubungi tim pengembang atau buat issue di repository.

---

*Frontend ini adalah bagian dari DUKNIS VICON Project. Lihat README backend untuk detail API dan integrasi server.*
