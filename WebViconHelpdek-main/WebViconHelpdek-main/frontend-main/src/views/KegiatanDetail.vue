<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="header-title">Detail Kegiatan</h4>
            <p class="header-subtitle">Detail informasi kegiatan yang tersimpan</p>
          </div>
          <button class="btn-modern" @click="$router.push('/kegiatan-form')">
            <i class="fas fa-plus"></i>
            <span>Tambah Baru</span>
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
          <button class="btn-retry" @click="loadData">
            <i class="fas fa-redo"></i>
            Retry
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="isDataEmpty" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No activity data found</p>
          <button class="btn-modern" @click="$router.push('/kegiatan-form')">
            <i class="fas fa-plus"></i>
            Create New Activity
          </button>
        </div>
        
        <!-- Content -->
        <div v-else class="detail-section">
          <!-- Waktu Kegiatan Section -->
          <div class="section-header">
            <i class="fas fa-clock"></i>
            <h6>Waktu Kegiatan</h6>
          </div>
          <div class="section-card time-section">
            <div class="row g-4">
              <div class="col-md-4">
                <div class="field-header">
                  <i class="fas fa-calendar-day"></i>
                  <span>Dari Tanggal</span>
                </div>
                <div class="field-content">
                  <p>{{ formatDate(data.tgl_dari) }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-header">
                  <i class="fas fa-calendar-check"></i>
                  <span>Sampai Tanggal</span>
                </div>
                <div class="field-content">
                  <p>{{ formatDate(data.tgl_sampai) }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-header">
                  <i class="fas fa-hourglass-half"></i>
                  <span>Waktu</span>
                </div>
                <div class="field-content">
                  <p>{{ data.waktu }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Kegiatan Section -->
          <div class="section-header">
            <i class="fas fa-info-circle"></i>
            <h6>Informasi Kegiatan</h6>
          </div>
          <div class="section-card info-section">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="field-header">
                  <i class="fas fa-tasks"></i>
                  <span>Nama Kegiatan</span>
                </div>
                <div class="field-content">
                  <p>{{ data.nama_kegiatan }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-header">
                  <i class="fas fa-file-alt"></i>
                  <span>Nomor Nodin</span>
                </div>
                <div class="field-content">
                  <p>{{ data.nomor_nodin }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Unit dan Lokasi Section -->
          <div class="section-header">
            <i class="fas fa-building"></i>
            <h6>Unit dan Lokasi</h6>
          </div>
          <div class="section-card location-section">
            <div class="row g-4">
               <div class="col-md-6">
                 <div class="field-header">
                   <i class="fas fa-sitemap"></i>
                   <span>Satuan Kerja</span>
                 </div>
                 <div class="field-content">
                   <p>{{ data.satker_permohonan }}</p>
                 </div>
               </div>
              <div class="col-md-6">
                <div class="field-header">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Lokasi</span>
                </div>
                <div class="field-content">
                  <input 
                    type="text"
                    class="form-input"
                    v-model="data.lokasi"
                    placeholder="Masukkan lokasi..."
                    readonly
                    disabled
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Kontak dan Petugas Section -->
          <div class="section-header">
            <i class="fas fa-address-card"></i>
            <h6>Kontak dan Petugas</h6>
          </div>
          <div class="section-card contact-section">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="field-header">
                  <i class="fas fa-phone-alt"></i>
                  <span>CP Satker & No HP</span>
                </div>
                <div class="field-content">
                  <p>{{ data.cp_satker }}</p>
                </div>
              </div>
               <div class="col-md-6">
                 <div class="field-header">
                   <i class="fas fa-user-circle"></i>
                   <span>Petugas</span>
                 </div>
                 <div class="field-content">
                   <p>
                     <span v-if="Array.isArray(data.petugas)">
                       {{ data.petugas.join(', ') }}
                     </span>
                     <span v-else>
                       {{ data.petugas }}
                     </span>
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <!-- Peralatan dan Akun Section -->
          <div class="section-header">
            <i class="fas fa-tools"></i>
            <h6>Peralatan dan Akun</h6>
          </div>
          <div class="section-card equipment-section">
            <div class="field-header">
              <i class="fas fa-laptop"></i>
              <span>Peralatan dan Akun yang Dibutuhkan</span>
            </div>
            <div class="field-content">
              <p>{{ data.peralatan_akun }}</p>
            </div>
          </div>

          <!-- Deskripsi Kegiatan Section -->
          <div class="section-header">
            <i class="fas fa-align-left"></i>
            <h6>Deskripsi Kegiatan</h6>
          </div>
          <div class="section-card description-section">
            <div class="field-header">
              <i class="fas fa-info-circle"></i>
              <span>Deskripsi</span>
            </div>
            <div class="field-content">
              <p>{{ data.deskripsi }}</p>
            </div>
          </div>

          <!-- Status Kegiatan Section -->
          <div class="section-header">
            <i class="fas fa-flag"></i>
            <h6>Status Kegiatan</h6>
          </div>
          <div class="section-card status-section">
            <div class="field-header">
              <i class="fas" :class="getStatusIcon(data.status)"></i>
              <span>Status</span>
            </div>
            <div class="field-content">
              <div class="status-badge" :class="getStatusClass(data.status)">
                {{ data.status || 'Pending' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import CustomDropdown from '@/components/CustomDropdown.vue';

const isLoading = ref(true);
const error = ref(null);

// Lists for dropdowns
const satuanKerjaList = [
  'Divisi TI',
  'Divisi SDM',
  'Divisi Keuangan',
  'Divisi Operasional',
  'Divisi Pemasaran',
  'Divisi Umum'
];

const petugasList = [
  'Ahmad Rizki',
  'Budi Santoso',
  'Clara Dewi',
  'David Pratama',
  'Eva Kusuma',
  'Fajar Ramadhan'
];

const data = ref({
  tgl_dari: '',
  tgl_sampai: '',
  waktu: '',
  nama_kegiatan: '',
  nomor_nodin: '',
  satker_permohonan: '',
  lokasi: '',
  cp_satker: '',
  petugas: '',
  peralatan_akun: ''
});

const isDataEmpty = computed(() => {
  return !data.value.nama_kegiatan && !data.value.nomor_nodin;
});

const getStatusClass = (status) => {
  const classes = {
    'Done': 'status-done',
    'Mandiri': 'status-mandiri',
    'Pending': 'status-pending',
    'Batal': 'status-batal'
  };
  return classes[status] || 'status-pending';
};

const getStatusIcon = (status) => {
  const icons = {
    'Done': 'fa-check-circle',
    'Mandiri': 'fa-user-check',
    'Pending': 'fa-clock',
    'Batal': 'fa-times-circle'
  };
  return icons[status] || 'fa-clock';
};

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return '-';
  }
}

const route = useRoute();

const loadData = async () => {
  try {
    const id = route.params.id;
    if (!id) {
      throw new Error('ID kegiatan tidak ditemukan');
    }

    const response = await fetch(`http://localhost:3001/kegiatan/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const responseData = await response.json();
    data.value = {
      ...responseData,
      waktu: `${responseData.waktu_mulai || ''} - ${responseData.waktu_selesai || ''}`,
      tgl_dari: responseData.tgl_dari,
      tgl_sampai: responseData.tgl_sampai,
      nama_kegiatan: responseData.nama_kegiatan,
      nomor_nodin: responseData.nomor_nodin,
      satker_permohonan: responseData.satker_permohonan,
      lokasi: responseData.lokasi,
      cp_satker: responseData.cp_satker,
      petugas: Array.isArray(responseData.petugas) 
        ? responseData.petugas 
        : (responseData.petugas ? responseData.petugas.split(', ') : []),
      peralatan_akun: responseData.peralatan_akun,
      deskripsi: responseData.deskripsi,
      status: responseData.status
    };
  } catch (e) {
    error.value = 'Error loading data: ' + (e instanceof Error ? e.message : 'Unknown error');
    console.error('Error loading data:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  border: none;
}

.card-header {
  background: linear-gradient(45deg, #5e72e4, #825ee4);
  padding: 2rem;
  border: none;
}

.header-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-subtitle {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
}

.btn-modern {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-modern:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-1px);
}

.btn-modern i {
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

/* Section Header - Simple header above section-card */
.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0.75rem 0;
  padding: 0;
}

.section-header:first-child {
  margin-top: 0;
}

.section-header i {
  font-size: 1.1rem;
  color: #5e72e4;
}

.section-header h6 {
  color: #344767;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.section-card {
  background: #f8fafe;
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(94,114,228,0.1);
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 12px rgba(94,114,228,0.08);
  transform: translateY(-2px);
}

/* Field Header - Label yang dikeluarkan dari kotak */
.field-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #8392ab;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.field-header i {
  color: #5e72e4;
  font-size: 0.9rem;
}

.field-content {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(94,114,228,0.08);
}

.field-content p {
  font-size: 1rem;
  color: #344767;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

.detail-item {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  height: 100%;
  border: 1px solid rgba(94,114,228,0.08);
}

.detail-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #8392ab;
  margin-bottom: 0.5rem;
}

.detail-item label i {
  color: #5e72e4;
  font-size: 0.9rem;
}

.detail-item p {
  font-size: 1rem;
  color: #344767;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

/* Loading, Error and Empty States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(94,114,228,0.1);
  border-top-color: #5e72e4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state i {
  color: #fb6340;
}

.empty-state i {
  color: #8392ab;
}

.error-state p,
.empty-state p,
.loading-state p {
  color: #8392ab;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.btn-retry {
  background: #fff;
  border: 1px solid #e9ecef;
  color: #5e72e4;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-retry:hover {
  background: #f8f9fa;
  border-color: #5e72e4;
  transform: translateY(-1px);
}

.btn-retry i {
  font-size: 0.8rem;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.status-done {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.status-mandiri {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.status-pending {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
}

.status-batal {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

/* Form Input Styles */
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s;
  color: #344767;
  font-size: 0.95rem;
}

.form-input:hover {
  border-color: #818cf8;
}

.form-input:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

/* Dropdown Styles */
.dropdown-container {
  position: relative;
  width: 100%;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #8392ab;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: #5e72e4;
  font-size: 0.9rem;
}

.dropdown-field {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-field:hover {
  border-color: #818cf8;
}

.dropdown-field.active {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

.dropdown-field i {
  transition: transform 0.2s;
  color: #94a3b8;
  font-size: 0.8rem;
}

.dropdown-field i.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem;
  z-index: 50;
}

.dropdown-content {
  max-height: 250px;
  overflow-y: auto;
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item i {
  color: #5e72e4;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .card-header {
    padding: 1.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .section-card {
    padding: 1.25rem;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .section-header {
    margin: 1rem 0 0.5rem 0;
  }
  
  .section-header h6 {
    font-size: 0.95rem;
  }
  
  .section-title-wrapper {
    padding: 0.75rem 1rem;
    margin: 1.5rem 0 0.75rem 0;
  }
  
  .detail-item {
    margin-bottom: 1rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem 1rem;
  }
}
</style>