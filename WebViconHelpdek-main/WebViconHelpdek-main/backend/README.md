# Backend (Express.js)

This is the backend server for the final project, built with Express.js.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server in development mode:
   ```bash
   npm run dev
   ```
3. Run the server in production mode:
   ```bash
   npm start
   ```

The server will start on port 3001 by default.

---

## Project Structure

- `index.js` : Main Express server
- `kegiatan.js` : API routes for activities, reports, and Excel export
- `strukturOrganisasi.js` : API routes for organization structure
- `exportExcel.js` : Utility for exporting Excel
- `setupDatabase.js` : Database setup and migration
- `migrations/` : SQL migration files
- `.env` : Environment configuration (DB, port, etc)

## Environment Variables (`.env`)

- `PGUSER` : Database user
- `PGHOST` : Database host
- `PGDATABASE` : Database name
- `PGPASSWORD` : Database password
- `PGPORT` : Database port
- `PORT` : Express server port (default: 3001)

## Database

- PostgreSQL
- Main tables: `kegiatan`, `struktur_organisasi`
- Migration files in `migrations/`

## API Endpoints

### Kegiatan
- `GET /api/kegiatan-per-tahun?year=YYYY` : Get monthly activity count for a year
- `GET /api/kegiatan-terkini` : Get 5 latest activities
- `GET /api/pengaduan-per-satker-bulan-ini` : Get complaints/activity recap per satker for current month

### Struktur Organisasi
- `GET /struktur-organisasi` : Get all organization units
- `GET /struktur-organisasi/:id` : Get organization unit by ID
- `POST /struktur-organisasi` : Add new organization unit
- `PUT /struktur-organisasi/:id` : Update organization unit
- `DELETE /struktur-organisasi/:id` : Delete organization unit

### Other
- `GET /` : Health check (server status)

## How to Use

- Make sure PostgreSQL is running and `.env` is configured
- Run migrations in `migrations/` if needed
- Start server as described above
- Access API endpoints via HTTP (see above)

## Deployment

- For production, use `npm run build` (if applicable) and `npm start`
- Use process manager (PM2, Docker, etc) for reliability
- Secure `.env` and database credentials

## Contact & Support

For issues, bugs, or feature requests, contact the development team or open an issue in the repository.

---

*This backend is part of the DUKNIS VICON Project. See frontend README for UI and integration details.*
