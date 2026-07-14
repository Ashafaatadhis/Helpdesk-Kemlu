<template>
  <div class="form-center wide-form">
    <!-- Header Card -->
    <div class="header-card-white mb-4 header-card-enhanced header-spaced">
      <div class="d-flex justify-content-between align-items-center">
        <div class="header-left">
          <h3 class="form-title mb-1">Edit Kegiatan</h3>
          <p class="form-desc">Update data kegiatan yang sudah ada</p>
        </div>
        <div class="header-right">
          <i class="fas fa-edit header-icon"></i>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Memuat data kegiatan...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchKegiatanData">Coba Lagi</button>
      </div>
    </div>

    <!-- Success Popup -->
    <SuccessPopup 
      :show="showSuccessPopup"
      @close="showSuccessPopup = false"
      @view-data="viewUpdatedData"
    />

    <!-- Form Edit -->
    <form v-if="!loading && !error" @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <!-- Waktu Kegiatan Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Waktu Kegiatan</h5>
          <div class="row g-3 waktu-row">
            <div class="col-md-3 waktu-item">
              <label for="tglDari" class="modern-time-label"><i class="fas fa-calendar-alt"></i> Dari Tanggal</label>
              <div class="custom-date-wrapper">
                <input 
                  type="date" 
                  v-model="form.tgl_dari" 
                  class="form-control custom-date-input" 
                  id="tglDari" 
                  required 
                  placeholder="dd/mm/yyyy"
                />
                <small class="input-hint">Klik untuk pilih tanggal</small>
              </div>
            </div>
            <div class="col-md-3 waktu-item">
              <label for="tglSampai" class="modern-time-label"><i class="fas fa-calendar-check"></i> Sampai Tanggal</label>
              <div class="custom-date-wrapper">
                <input 
                  type="date" 
                  v-model="form.tgl_sampai" 
                  class="form-control custom-date-input" 
                  id="tglSampai" 
                  required 
                  placeholder="dd/mm/yyyy"
                />
                <small class="input-hint">Klik untuk pilih tanggal</small>
              </div>
            </div>
            <div class="col-md-3 waktu-item">
              <label for="waktuMulai" class="modern-time-label"><i class="fas fa-clock"></i> Waktu Mulai</label>
              <div class="custom-time-wrapper">
                <input 
                  type="time" 
                  v-model="form.waktuMulai" 
                  class="form-control custom-time-input" 
                  id="waktuMulai" 
                  required 
                />
                <small class="input-hint">Klik untuk set waktu</small>
              </div>
            </div>
            <div class="col-md-3 waktu-item">
              <label for="waktuSelesai" class="modern-time-label"><i class="fas fa-clock"></i> Waktu Selesai</label>
              <div class="custom-time-wrapper">
                <input 
                  type="time" 
                  v-model="form.waktuSelesai" 
                  class="form-control custom-time-input" 
                  id="waktuSelesai" 
                  required 
                />
                <small class="input-hint">Klik untuk set waktu</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Informasi Kegiatan Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Informasi Kegiatan</h5>
          <div class="row g-3">
            <div class="col-md-6">
              <label for="namaKegiatan" class="modern-time-label"><i class="fas fa-tasks"></i> Nama Kegiatan</label>
              <input type="text" v-model="form.nama_kegiatan" class="form-control modern-date-input" id="namaKegiatan" required />
            </div>
            <div class="col-md-6">
              <label for="nomorNodin" class="modern-time-label"><i class="fas fa-file-alt"></i> Nomor Nodin</label>
              <input type="text" v-model="form.nomor_nodin" class="form-control modern-date-input" id="nomorNodin" required />
            </div>
          </div>
        </div>

        <!-- Satuan Kerja dan Lokasi Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Unit dan Lokasi</h5>
          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <label for="satkerPermohonan" class="modern-time-label">
                <i class="fas fa-sitemap"></i> Satuan Kerja Permohonan
              </label>
              <select v-model="form.satker_permohonan" class="form-control modern-date-input" id="satkerPermohonan" required>
                <option value="">Pilih kolom satuan kerja</option>
                <option v-for="col in satuanKerjaList" :key="col" :value="col">{{ col }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="eselon" class="modern-time-label">
                <i class="fas fa-layer-group"></i> Eselon
              </label>
              <select 
                v-model="form.eselon" 
                class="form-control modern-date-input" 
                id="eselon" 
                required
                :disabled="!form.satker_permohonan"
              >
                <option value="">Pilih isi dari kolom</option>
                <option 
                  v-for="eselon in eselonList" 
                  :key="eselon" 
                  :value="eselon"
                >
                  {{ eselon }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label for="lokasi" class="modern-time-label mb-0">
                  <i class="fas fa-map-marker-alt"></i> Lokasi
                </label>
                <div class="location-flags">
                  <div
                    v-for="type in locationTypes"
                    :key="type.id"
                    class="flag-item"
                    :class="{ 'flag-selected': form.lokasi_type === type.id }"
                    :data-tooltip="type.label"
                    :style="{ background: `linear-gradient(135deg, ${type.gradientStart} 0%, ${type.gradientEnd} 100%)` }"
                    @click="selectLocationType(type.id)"
                  ></div>
                </div>
              </div>
              <input
                type="text" 
                v-model="form.lokasi" 
                class="form-control modern-date-input" 
                id="lokasi" 
                required 
              />
            </div>
          </div>
        </div>

        <!-- Kontak dan Petugas Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Kontak dan Petugas</h5>
          <div class="row g-3">
            <div class="col-md-6">
              <label for="cpSatker" class="modern-time-label"><i class="fas fa-phone-alt"></i> CP Satker & No HP</label>
              <input type="text" v-model="form.cp_satker" class="form-control modern-date-input" id="cpSatker" pattern="[A-Za-z\s]+ - [0-9]{10,13}" placeholder="Nama - No HP" required />
              <small class="form-text text-muted">Format: Nama - No HP (contoh: John Doe - 0812345678)</small>
            </div>
            <div class="col-md-6">
              <label class="modern-time-label"><i class="fas fa-user-circle"></i> Petugas (bisa pilih lebih dari satu)</label>
              <VueMultiselect
                v-model="form.petugas"
                :options="petugasList"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Pilih Petugas"
                label=""
                track-by=""
                :custom-label="customTechnicianLabel"
                :show-labels="false"
                class="mb-2"
              >
                <template #option="{ option }">
                  <div class="d-flex align-items-center">
                    <span class="technician-avatar">{{ option.charAt(0) }}</span>
                    <span class="technician-name">{{ option }}</span>
                  </div>
                </template>
                <template #tag="{ option, remove }">
                  <div class="technician-tag">
                    <span class="technician-avatar">{{ option.charAt(0) }}</span>
                    <span class="technician-name">{{ option }}</span>
                    <button type="button" class="remove-technician" @click="remove(option)">×</button>
                  </div>
                </template>
              </VueMultiselect>
            </div>
          </div>
        </div>

        <!-- Peralatan Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Peralatan dan Akun</h5>
          <div class="row g-3">
            <div class="col-12">
              <label for="peralatanAkun" class="modern-time-label"><i class="fas fa-laptop"></i> Peralatan dan Akun yang Dibutuhkan</label>
              <textarea v-model="form.peralatan_akun" class="form-control modern-date-input" id="peralatanAkun" style="height: 100px" required></textarea>
            </div>
          </div>
        </div>

        <!-- Deskripsi Kegiatan Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Deskripsi Kegiatan</h5>
          <div class="row g-3">
            <div class="col-12">
              <label for="deskripsiKegiatan" class="modern-time-label"><i class="fas fa-align-left"></i> Deskripsi</label>
              <textarea v-model="form.deskripsi" class="form-control modern-date-input" id="deskripsiKegiatan" style="height: 120px" placeholder="Masukkan deskripsi detail kegiatan..." required></textarea>
              <small class="input-hint">Berikan penjelasan lengkap mengenai kegiatan yang akan dilaksanakan</small>
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="section-card kegiatan-section mb-3">
          <h5 class="section-title">Status Kegiatan</h5>
          <div class="row g-3">
            <div class="col-md-6">
              <label for="status" class="modern-time-label"><i class="fas fa-flag"></i> Status</label>
              <select v-model="form.status" class="form-control modern-date-input" id="status" required>
                <option value="Pending">Pending</option>
                <option value="Done">Done</option>
                <option value="Mandiri">Mandiri</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-end gap-3 mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="goBack">
            <i class="fas fa-times me-2"></i>Batal
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid()">
            <i class="fas fa-save me-2"></i>Update
          </button>
        </div>
      </form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import SuccessPopup from '../components/SuccessPopup.vue';

const router = useRouter();
const route = useRoute();

// State declarations
const showSuccessPopup = ref(false);
const loading = ref(true);
const error = ref(null);
const originalData = ref({});

// Data untuk dropdown
const petugasList = ref([]);
const satuanKerjaList = ref([]);
const strukturOrganisasiData = ref([]);
const eselonList = ref([]);

// Form reactive object
const form = reactive({
  tgl_dari: '',
  tgl_sampai: '',
  waktuMulai: '',
  waktuSelesai: '',
  nama_kegiatan: '',
  nomor_nodin: '',
  satker_permohonan: '',
  eselon: '',
  lokasi: '',
  lokasi_type: '',
  cp_satker: '',
  petugas: [],
  warna_lokasi: '',
  peralatan_akun: '',
  deskripsi: '',
  status: 'Pending'
});

// Location types data
const locationTypes = [
  { 
    id: 'Kemlu',
    label: 'Kemlu',
    gradientStart: '#2193b0',
    gradientEnd: '#6dd5ed'
  },
  {
    id: 'Jakarta',
    label: 'Jakarta',
    gradientStart: '#11998e',
    gradientEnd: '#38ef7d'
  },
  {
    id: 'Bodetabek',
    label: 'Bodetabek',
    gradientStart: '#f12711',
    gradientEnd: '#f5af19'
  },
  {
    id: 'Luar Kota',
    label: 'Luar Kota',
    gradientStart: '#e52d27',
    gradientEnd: '#b31217'
  }
];

// Fetch functions
async function fetchPetugas() {
  try {
    const res = await fetch('http://localhost:3001/petugas');
    const data = await res.json();
    petugasList.value = Array.isArray(data) ? data.map(p => p.nama) : [];
  } catch (e) {
    console.error('Error fetching petugas:', e);
    petugasList.value = [];
  }
}

async function fetchSatuanKerja() {
  try {
    const res = await fetch('http://localhost:3001/struktur-organisasi');
    const data = await res.json();
    strukturOrganisasiData.value = data;
    if (Array.isArray(data) && data.length > 0) {
      satuanKerjaList.value = Object.keys(data[0]).filter(
        k => k !== 'id' && typeof data[0][k] === 'string' || (data.some(row => typeof row[k] === 'string'))
      );
    } else {
      satuanKerjaList.value = [];
    }
  } catch (e) {
    console.error('Error fetching struktur organisasi:', e);
    satuanKerjaList.value = [];
  }
}

// Helper function to format date for input fields
function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Helper function to format time for input fields
function formatTimeForInput(timeString) {
  if (!timeString) return '';
  
  // If it's already in HH:MM format, return as is
  if (timeString.match(/^\d{2}:\d{2}$/)) return timeString;
  
  // If it includes seconds, take only HH:MM
  if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString.split(':').slice(0, 2).join(':');
  }
  
  return timeString;
}

// Fetch kegiatan data untuk edit
async function fetchKegiatanData() {
  const kegiatanId = route.params.id;
  if (!kegiatanId) {
    error.value = 'ID kegiatan tidak ditemukan';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(`http://localhost:3001/kegiatan/${kegiatanId}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data kegiatan');
    }
    
    const data = await response.json();
    originalData.value = { ...data };
    
    // Fill form with existing data - Format dates properly
    form.tgl_dari = data.tgl_dari ? formatDateForInput(data.tgl_dari) : '';
    form.tgl_sampai = data.tgl_sampai ? formatDateForInput(data.tgl_sampai) : '';
    form.waktuMulai = data.waktu_mulai ? formatTimeForInput(data.waktu_mulai) : '';
    form.waktuSelesai = data.waktu_selesai ? formatTimeForInput(data.waktu_selesai) : '';
    form.nama_kegiatan = data.nama_kegiatan || '';
    form.nomor_nodin = data.nomor_nodin || '';
    form.satker_permohonan = data.satker_permohonan || '';
    form.eselon = data.eselon || '';
    form.lokasi = data.lokasi || '';
    form.lokasi_type = data.lokasi_type || '';
    form.cp_satker = data.cp_satker || '';
    form.peralatan_akun = data.peralatan_akun || '';
    form.deskripsi = data.deskripsi || '';
    form.status = data.status || 'Pending';
    form.warna_lokasi = data.warna_lokasi || '';
    
    // Handle petugas array
    if (Array.isArray(data.petugas)) {
      form.petugas = [...data.petugas];
    } else if (typeof data.petugas === 'string') {
      form.petugas = data.petugas.split(', ').filter(p => p.trim() !== '');
    } else {
      form.petugas = [];
    }
    
    loading.value = false;
  } catch (err) {
    console.error('Error fetching kegiatan data:', err);
    error.value = 'Gagal memuat data kegiatan. Silakan coba lagi.';
    loading.value = false;
  }
}

// Watch for satker_permohonan changes
watch(() => form.satker_permohonan, (selectedCol) => {
  if (!selectedCol || !strukturOrganisasiData.value.length) {
    eselonList.value = [];
    form.eselon = '';
    return;
  }
  
  const values = strukturOrganisasiData.value
    .map(row => row[selectedCol])
    .filter(val => val && typeof val === 'string' && val.trim() !== '');
  eselonList.value = Array.from(new Set(values));
  
  if (!eselonList.value.includes(form.eselon)) {
    form.eselon = '';
  }
});

// Form validation
function isFormValid() {
  return form.tgl_dari &&
         form.tgl_sampai &&
         form.waktuMulai &&
         form.waktuSelesai &&
         form.nama_kegiatan &&
         form.nomor_nodin &&
         form.satker_permohonan &&
         form.lokasi &&
         form.cp_satker &&
         form.eselon &&
         form.petugas.length > 0 &&
         form.peralatan_akun &&
         form.deskripsi &&
         form.status;
}

// Form functions
const goBack = () => {
  router.push('/laporan');
}

const selectLocationType = (typeId) => {
  form.lokasi_type = typeId;
}

const customTechnicianLabel = (option) => {
  return option;
}

const viewUpdatedData = () => {
  router.push('/laporan');
}

// Submit form
async function handleSubmit() {
  const kegiatanId = route.params.id;
  
  document.querySelector('form').classList.add('was-validated');
  if (!isFormValid()) {
    console.log('Form tidak valid, tidak bisa update');
    return;
  }

  const formattedData = {
    nama_kegiatan: form.nama_kegiatan,
    deskripsi: form.deskripsi,
    tgl_dari: form.tgl_dari,
    tgl_sampai: form.tgl_sampai,
    waktu_mulai: form.waktuMulai,
    waktu_selesai: form.waktuSelesai,
    nomor_nodin: form.nomor_nodin,
    satker_permohonan: form.satker_permohonan,
    eselon: form.eselon,
    lokasi: form.lokasi,
    warna_lokasi: form.warna_lokasi,
    cp_satker: form.cp_satker,
    petugas: form.petugas,
    peralatan_akun: form.peralatan_akun,
    status: form.status
  };

  try {
    const response = await fetch(`http://localhost:3001/kegiatan/${kegiatanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      throw new Error('Gagal update data ke server');
    }
    
    showSuccessPopup.value = true;
    document.querySelector('form').classList.remove('was-validated');
  } catch (error) {
    console.error('Error saat update ke backend:', error);
    alert('Gagal mengupdate data ke server!');
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchPetugas(),
    fetchSatuanKerja(),
    fetchKegiatanData()
  ]);
});
</script>

<style scoped>
/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #5e72e4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  padding: 30px;
  color: #c53030;
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #e53e3e;
}

/* Custom Date/Time Input Styles */
.custom-date-wrapper,
.custom-time-wrapper {
  position: relative;
}

.custom-date-input,
.custom-time-input {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  cursor: pointer;
}

.custom-date-input:hover,
.custom-time-input:hover {
  border-color: #5e72e4;
  box-shadow: 0 2px 8px rgba(94, 114, 228, 0.1);
}

.custom-date-input:focus,
.custom-time-input:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
  outline: none;
}

.input-hint {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Header Card */
.header-card-white {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  color: #344767;
}

.form-title {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #5e72e4; /* Orange color for edit */
}

.form-desc {
  font-size: 1rem;
  color: #6c757d;
}

.header-icon {
  font-size: 2rem;
  color: #5e72e4;
}

/* Section Cards */
.kegiatan-section {
  background: #f8fafe;
  border-radius: 12px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(94,114,228,0.1);
  transition: all 0.3s ease;
}

.kegiatan-section:hover {
  box-shadow: 0 4px 12px rgba(94,114,228,0.08);
  transform: translateY(-2px);
}

.section-title {
  color: #344767;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* Labels and Inputs */
.modern-time-label {
  font-weight: 500;
  color: #5e72e4;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.modern-date-input {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.modern-date-input:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
  outline: none;
}

/* Form Layout */
.wide-form {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding-top: 2rem;
}

/* Date/Time Input Webkit Customization */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* VueMultiselect Styling */
:deep(.multiselect) {
  border: 2px solid #e9ecef !important;
  border-radius: 12px !important;
  font-size: 1rem !important;
  background: white !important;
  min-height: 50px !important;
}

:deep(.multiselect:hover) {
  border-color: #5e72e4 !important;
}

:deep(.multiselect.multiselect--active) {
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15) !important;
}

:deep(.multiselect__tags) {
  border: none !important;
  background: transparent !important;
  padding: 8px 12px !important;
  min-height: 46px !important;
}

:deep(.multiselect__placeholder) {
  color: #bdadad !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;
}

:deep(.multiselect__input) {
  border: none !important;
  background: transparent !important;
  font-size: 1rem !important;
  padding: 0 !important;
  margin-bottom: 0 !important;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #e9ecef !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  background: white !important;
  margin-top: 2px !important;
  z-index: 9999 !important;
  bottom: 100% !important; 
  position: absolute !important;
}

:deep(.multiselect__content) {
  background: rgb(109, 199, 248) !important;
  max-height: 200px !important;
  overflow-y: auto !important;
}

:deep(.multiselect__option) {
  padding: 12px 16px !important;
  font-size: 1rem !important;
  color: #673434f5 !important;
}

:deep(.multiselect__option--highlight) {
  background: #3c7bba !important;
  color: #344767 !important;
}

:deep(.multiselect__option--selected) {
  background: rgba(94, 114, 228, 0.1) !important;
  color: #5e72e4 !important;
  font-weight: 600 !important;
}

/* Technician Tags */
.technician-tag {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  background: #5e72e4 !important;
  color: white !important;
  padding: 4px 12px !important;
  border-radius: 16px !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  margin: 2px !important;
}

.technician-avatar {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 20px !important;
  height: 20px !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
}

.technician-name {
  font-weight: 500 !important;
  color: white !important;
}

.remove-technician {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 12px !important;
  font-weight: bold !important;
  cursor: pointer !important;
}

.remove-technician:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

/* Hide multiselect select arrow */
:deep(.multiselect__select) {
  display: none !important;
}

/* Location Flags */
.location-flags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.flag-item {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.flag-item:hover {
  transform: scale(1.2);
}

.flag-item::before {
  /* content: attr(data-tooltip); */
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  margin-bottom: 5px;
}

.flag-item:hover::before {
  opacity: 1;
  visibility: visible;
}

.flag-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border: 2px solid white;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.2s ease;
}

.flag-selected {
  transform: scale(1.2);
}

.flag-selected::after {
  opacity: 1;
  border-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}

/* Button Styles */
.btn-primary {
  /* background: linear-gradient(135deg, #e67e22 0%, #d35400 100%); */
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .wide-form {
    padding: 0 15px;
  }
  
  .header-card-white {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  .kegiatan-section {
    padding: 1.25rem 1.5rem;
  }
  
  .form-title {
    font-size: 1.4rem;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 15px;
  }
}
</style>