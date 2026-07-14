<template>
  <div class="form-center wide-form">
    <!-- Header Card -->
    <div class="header-card-white mb-4 header-card-enhanced header-spaced">
      <div class="d-flex justify-content-between align-items-center">
        <div class="header-left">
          <h3 class="form-title mb-1">Form Input Kegiatan</h3>
          <p class="form-desc">Silakan isi data kegiatan dengan lengkap</p>
        </div>
        <div class="header-right">
          <i class="fas fa-calendar-check header-icon"></i>
        </div>
      </div>
    </div>
    <SuccessPopup 
  :show="showSuccessPopup"
  @close="showSuccessPopup = false"
  @view-data="viewSavedData"
/>
    <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
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

        <!-- Buttons -->
        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="resetForm">
            <i class="fas fa-undo me-2"></i>Reset
          </button>
          <button type="submit" class="btn btn-success" :disabled="!isFormValid()">
            <i class="fas fa-save me-2"></i>Simpan
          </button>
        </div>
      </form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import SuccessPopup from '../../components/SuccessPopup.vue';

// Props and emits definition
// const props = defineProps({
//   technicians: {
//     type: Array,
//     default: () => [
//       'Ahmad Rizki',
//       'Budi Santoso',
//       'Clara Dewi',
//       'David Pratama',
//       'Eva Kusuma',
//       'Fajar Ramadhan'
//     ]
//   }
// });

const petugasList = ref([]);
async function fetchPetugas() {
  try {
    const res = await fetch('http://localhost:3001/petugas');
    const data = await res.json();
    petugasList.value = Array.isArray(data) ? data.map(p => p.nama) : [];
  } catch (e) {
    petugasList.value = [];
  }
}
onMounted(() => { 
  fetchPetugas();
  fetchSatuanKerja();
});

// State declarations - DIPERBAIKI: gunakan ref() agar reactive
const showSuccessPopup = ref(false);

// Data untuk dropdown satuan kerja dari database
const satuanKerjaList = ref([]); // Nama kolom
const strukturOrganisasiData = ref([]); // Data mentah
const eselonList = ref([]); // Data isi kolom terpilih

async function fetchSatuanKerja() {
  try {
    const res = await fetch('http://localhost:3001/struktur-organisasi');
    const data = await res.json();
    strukturOrganisasiData.value = data;
    // Ambil nama kolom string saja, kecuali id
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
  warna_lokasi: '', // warna flag
  peralatan_akun: '',
  deskripsi: '', // Field deskripsi yang baru ditambahkan
});

watch(() => form.satker_permohonan, (selectedCol) => {
  if (!selectedCol || !strukturOrganisasiData.value.length) {
    eselonList.value = [];
    form.eselon = '';
    return;
  }
  // Ambil semua isi kolom yang dipilih, filter unik dan tidak kosong
  const flagColorMap = {
    Kemlu: '#2193b0',
    Jakarta: '#11998e',
    Bodetabek: '#f12711',
    'Luar Kota': '#e52d27',
  };
  const values = strukturOrganisasiData.value
    .map(row => row[selectedCol])
    .filter(val => val && typeof val === 'string' && val.trim() !== '');
  eselonList.value = Array.from(new Set(values));
  // Reset pilihan eselon jika tidak ada di list baru
  if (!eselonList.value.includes(form.eselon)) {
    form.eselon = '';
  }
});

// Data untuk location flags
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



// Custom label for VueMultiselect
function customTechnicianLabel(option) {
  return option;
}

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
         form.deskripsi; // Validasi untuk field deskripsi
}

function resetForm() {
  Object.keys(form).forEach(key => {
    if (Array.isArray(form[key])) {
      form[key] = [];
    } else {
      form[key] = '';
    }
  });
}

// TAMBAHAN: Fungsi untuk melihat data yang tersimpan
function viewSavedData() {
  console.log('Melihat data yang tersimpan...');
  const savedData = localStorage.getItem('kegiatanData');
  if (savedData) {
    const data = JSON.parse(savedData);
    console.log('Data tersimpan:', data);
    
    // Anda bisa tambahkan logika sesuai kebutuhan:
    // - Redirect ke halaman data
    // - Emit event ke parent component
    // - Tampilkan modal dengan data
    alert('Data berhasil disimpan! Cek console untuk melihat data.');
  }
}

// DIPERBAIKI: Fungsi handleSubmit dengan error handling dan .value untuk ref
async function handleSubmit() {
  document.querySelector('form').classList.add('was-validated');
  if (!isFormValid()) {
    console.log('Form tidak valid, tidak bisa simpan');
    return;
  }

  // Format data sesuai field backend
  const formattedData = {
    nama_kegiatan: form.nama_kegiatan,
    deskripsi: form.deskripsi, // Field deskripsi yang baru ditambahkan
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
    status: form.status || 'Pending'
  };

  try {
    const response = await fetch('http://localhost:3001/kegiatan-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });
    if (!response.ok) {
      throw new Error('Gagal simpan ke server');
    }
    showSuccessPopup.value = true;
    resetForm();
    document.querySelector('form').classList.remove('was-validated');
    // Redirect ke halaman kalender/tabel dinas setelah submit sukses
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/kalender-dinas';
        // Paksa reload penuh agar data terbaru pasti muncul
        setTimeout(() => { window.location.reload(); }, 300);
      }
    }, 1000); // beri jeda 1 detik agar popup sempat tampil
  } catch (error) {
    console.error('Error saat simpan ke backend:', error);
    alert('Gagal menyimpan data ke server!');
  }
}

// Tambahkan metode untuk memilih tipe lokasi

// Mapping warna untuk setiap tipe lokasi
const locationColorMap = {
  Kemlu: '#00ffff',
  Jakarta: '#00b050',
  Bodetabek: '#ffff00',
  'Luar Kota': '#ff0000'
};

function selectLocationType(typeId) {
  form.lokasi_type = typeId;
  form.warna_lokasi = locationColorMap[typeId] || '';
}

// Properti untuk menyimpan tipe lokasi
form.lokasi_type = null;
</script>

<style scoped>
/* SOLUSI 1: Input dengan ikon FontAwesome dan hint text */
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

/* CSS yang sudah ada sebelumnya */
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
}

.form-desc {
  font-size: 1rem;
  color: #6c757d;
}

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

/* Styling khusus untuk textarea */
.modern-date-input[type="textarea"],
textarea.modern-date-input {
  resize: vertical;
  min-height: 100px;
}

textarea.modern-date-input:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
  outline: none;
}

.wide-form {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding-top: 2rem;
}

/* Styling untuk menghilangkan ikon native tapi tetap bisa diklik */
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

/* Custom Styling untuk VueMultiselect - Lebih Menarik */
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

/* Styling untuk dropdown content */
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

/* Kembalikan template styling yang bekerja */
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

/* Hide default multiselect select arrow */
:deep(.multiselect__select) {
  display: none !important;
}

/* Tambahkan styling untuk location flags */
/* Location Flags Styling */
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
  content: attr(data-tooltip);
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

.flag-item {
  position: relative;
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
</style>