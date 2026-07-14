# DUKNIS VICON Project

Sistem ini terdiri dari dua bagian utama: Backend (Node.js/Express) dan Frontend (Vue.js). Project ini dirancang untuk kebutuhan perusahaan dalam pengelolaan jadwal dinas, pengaduan, petugas, dan struktur organisasi.

---

Login
Username : vicon
Password : viconkemlu@

## 1. Backend (`/backend`)

### Teknologi
- Node.js
- Express.js
- PostgreSQL (via `pg`)
- dotenv
- CORS

### Instalasi & Menjalankan
```bash
cd backend
npm install
npm run dev   # Untuk development
npm start     # Untuk production
```

### Struktur Folder
- `index.js` : Entry point server Express
- `kegiatan.js` : API untuk data kegiatan, rekap, pengaduan, dan export Excel
- `strukturOrganisasi.js` : API untuk struktur organisasi
- `exportExcel.js` : Utility export data ke Excel
- `setupDatabase.js` : Setup dan migrasi database
- `migrations/` : File migrasi SQL
- `.env` : Konfigurasi environment (database, port, dsb)

### API Utama
#### Kegiatan
- `GET /api/kegiatan-per-tahun?year=YYYY`  
  Rekap jumlah kegiatan per bulan pada tahun tertentu.
- `GET /api/kegiatan-terkini`  
  Ambil 5 data kegiatan terbaru.
- `GET /api/pengaduan-per-satker-bulan-ini`  
  Rekap pengaduan/kegiatan per satker bulan ini.

#### Struktur Organisasi
- `GET /struktur-organisasi`  
  Ambil seluruh data struktur organisasi.
- `GET /struktur-organisasi/:id`  
  Ambil detail unit organisasi berdasarkan ID.
- `POST /struktur-organisasi`  
  Tambah unit organisasi baru.
- `PUT /struktur-organisasi/:id`  
  Update unit organisasi.
- `DELETE /struktur-organisasi/:id`  
  Hapus unit organisasi.

#### Lainnya
- `GET /`  
  Cek status server.

### Database
- PostgreSQL, dengan tabel utama: `kegiatan`, `struktur_organisasi`
- Koneksi diatur via environment variable `.env`

---

## 2. Frontend (`/frontend-main`)

### Teknologi
- Vue.js 3
- Vue Router
- Vuex
- Argon Dashboard (Creative Tim)
- SweetAlert2
- FullCalendar
- Axios
- SCSS

### Instalasi & Menjalankan
```bash
cd frontend-main
npm install
npm run serve   # Untuk development
npm run build   # Untuk production
```

### Struktur Folder
- `src/` : Source code utama
  - `assets/` : CSS, font, gambar, JS, SCSS
  - `components/` : Komponen UI
  - `examples/` : Komponen contoh (Chart, Table, Sidenav)
  - `router/` : Routing aplikasi
  - `store/` : State management (Vuex)
  - `views/` : Halaman utama (Dashboard, Kalender Dinas, Profile, dsb)
- `public/` : Static files
- `babel.config.js`, `vue.config.js` : Konfigurasi build
- `package.json` : Dependency dan script

### Fitur Utama
- Dashboard: Statistik, chart kegiatan per tahun, tabel aktivitas terbaru
- Kalender Dinas: Jadwal dinas petugas, warna lokasi, detail kegiatan
- Profile: Data user
- Pengelolaan Petugas: CRUD petugas
- Struktur Organisasi: Manajemen unit organisasi
- Laporan: Rekap kegiatan dan pengaduan

### Integrasi API
- Semua data dinamis (jadwal, rekap, struktur organisasi) diambil dari backend via Axios.
- Contoh pemanggilan API:
  - `GET /api/kegiatan-per-tahun?year=2025`
  - `GET /struktur-organisasi`
  - `GET /api/kegiatan-terkini`

### Routing Utama
- `/dashboard-default` : Dashboard utama
- `/kalender-dinas` : Kalender dinas petugas
- `/laporan` : Laporan kegiatan
- `/petugas` : Manajemen petugas
- `/profile` : Profil user
- `/kegiatan-form` : Form tambah/edit kegiatan
- `/kegiatan-detail/:id` : Detail kegiatan

---

## 3. Deployment
- Backend dan frontend dapat dijalankan secara terpisah.
- Pastikan environment variable dan koneksi database sudah benar.
- Untuk production, build frontend dan deploy hasil build (`dist/`).

---

## 4. Dokumentasi API
Setiap endpoint API sudah dijelaskan di atas. Untuk detail payload dan response, silakan cek file `kegiatan.js` dan `strukturOrganisasi.js` di backend.

---

## 5. Kontribusi & Pengembangan
- Ikuti struktur folder dan coding style yang sudah ada.
- Tambahkan dokumentasi pada setiap fungsi/komponen baru.
- Gunakan branch dan pull request untuk pengembangan fitur.

---

## 6. Kontak & Support
Untuk pertanyaan, bug, atau permintaan fitur, silakan hubungi tim pengembang atau buat issue di repository.

---

*Project ini adalah bagian dari E-Helpdesk Final Project. Lihat README backend dan frontend untuk detail lebih lanjut.*
