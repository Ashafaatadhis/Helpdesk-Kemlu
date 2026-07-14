<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const viewOfficerDetail = (officer) => {
  router.push(`/petugas-detail/${officer.id}`);
};
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import HelpDeskPustikKPButton from "@/components/HelpDeskPustikKPButton.vue";
import DeletePetugasAlert from "@/components/DeletePetugasAlert.vue";
import SuccessAlert from "@/components/SuccessAlert.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";


// Data petugas dari database
import { onMounted } from 'vue';
const officers = ref([]);

const fetchPetugas = async () => {
  try {
    const response = await fetch('http://localhost:3001/petugas');
    if (!response.ok) throw new Error('Gagal mengambil data petugas');
    const data = await response.json();
    // Mapping agar field backend cocok dengan frontend dan pastikan ID tersedia
    officers.value = Array.isArray(data)
      ? data.map(item => {
          if (!item.id) {
            console.error('Petugas tidak memiliki ID:', item);
          }
          return {
            ...item,
            id: item.id, // Pastikan ID tersedia
            name: item.nama,
            position: item.jabatan,
            phone: item.kontak,
            avatar: getInitials(item.nama)
          };
        })
      : [];
    console.log('Fetched officers:', officers.value); // Debug log
  } catch (err) {
    officers.value = [];
    console.error('Error fetching officers:', err);
  }
};

onMounted(() => {
  fetchPetugas();
});

const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const selectedStatus = ref("all");
const viewMode = ref("table"); // 'table' or 'cards'

// Computed properties
const filteredOfficers = computed(() => {
  let filtered = officers.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(officer => 
      officer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      officer.position.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(officer => officer.status === selectedStatus.value);
  }
  
  return filtered;
});

const activeOfficersCount = computed(() => 
  officers.value.filter(officer => officer.status === 'active').length
);

const totalOfficersCount = computed(() => officers.value.length);

// Functions
const toggleStatus = async (officer) => {
  const newStatus = officer.status === 'active' ? 'inactive' : 'active';
  try {
    const response = await fetch(`http://localhost:3001/petugas/${officer.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) throw new Error('Gagal update status');
    const updated = await response.json();
    officer.status = updated.status;
  } catch (err) {
    alert('Gagal update status petugas!');
    console.error(err);
  }
};

// State for delete alert
const showDeleteAlert = ref(false);
const officerToDelete = ref(null);

const deleteOfficer = async (officerId) => {
  officerToDelete.value = officerId;
  showDeleteAlert.value = true;
};

const handleDeleteConfirm = async () => {
  try {
    const response = await fetch(`http://localhost:3001/petugas/${officerToDelete.value}`, {
      method: 'DELETE',
    });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete: ${errorData}`);
      }

      // Hanya hapus dari tampilan jika backend berhasil
      officers.value = officers.value.filter(officer => officer.id !== officerToDelete.value);
      showDeleteAlert.value = false;
      officerToDelete.value = null;
      
      // Show success notification
      showSuccessAlert.value = true;
      successMessage.value = 'Petugas berhasil dihapus';
    } catch (err) {
      console.error('Error deleting officer:', err);
      showErrorAlert.value = true;
      errorMessage.value = 'Gagal menghapus petugas: ' + err.message;
    } finally {
      showDeleteAlert.value = false;
      officerToDelete.value = null;
    }
};

const handleDeleteCancel = () => {
  showDeleteAlert.value = false;
  officerToDelete.value = null;
};

// Alert states
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const closeSuccessAlert = () => {
  showSuccessAlert.value = false;
  successMessage.value = '';
};

const closeErrorAlert = () => {
  showErrorAlert.value = false;
  errorMessage.value = '';
};


// Get icon based on officer position
const getPositionIcon = (position) => {
  const pos = position?.toLowerCase?.() || 'unknown';
  switch (pos) {
    case 'operator':
      return 'fas fa-user-cog';
    case 'it support':
      return 'fas fa-laptop-code';
    case 'asn':
      return 'fas fa-id-badge';
    case 'magang':
      return 'fas fa-user-graduate';
    default:
      return 'fas fa-user-tie';
  }
};

// Tambahkan fungsi untuk mengambil inisial dari nama
function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}


</script>

<template>
  <div class="">
    <!-- Header Section Kotak Putih -->
    <div class="header-petugas-container header-petugas-mini">
      <div class="header-petugas-flex">
        <div>
          <div style="margin-bottom: 1rem;">
            <h1 class="judul-petugas">
              <i class="fas fa-user-cog icon-petugas"></i>
              Manajemen Petugas
            </h1>
            <p class="subjudul-petugas">Kelola dan monitor tim help desk dengan mudah</p>
          </div>
          <!-- Quick Stats -->
          <div class="stats-mini-row">
            <div class="stats-mini-card active">
              <div class="stats-mini-icon active"><i class="fas fa-user-check"></i></div>
              <div>
                <div class="stats-mini-number">{{ activeOfficersCount }}</div>
                <div class="stats-mini-label">Petugas Aktif</div>
              </div>
            </div>
            <div class="stats-mini-card total">
              <div class="stats-mini-icon total"><i class="fas fa-users"></i></div>
              <div>
                <div class="stats-mini-number">{{ totalOfficersCount }}</div>
                <div class="stats-mini-label">Total Petugas</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <RouterLink to="/petugas-form">
            <HelpDeskPustikKPButton variant="primary" class="add-officer-btn custom-add-btn">
              <i class="fas fa-user-plus"></i>
              <span>Tambah Petugas</span>
            </HelpDeskPustikKPButton>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters Section -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama, email, atau jabatan..."
              class="search-input"
            />
            <div class="search-backdrop"></div>
          </div>
        </div>
        
        <div class="filter-controls">
          <div class="status-filter">
            <select v-model="selectedStatus" class="filter-select">
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          
          <div class="view-toggle">
            <button 
              @click="viewMode = 'table'"
              :class="['view-btn', { active: viewMode === 'table' }]"
            >
              <i class="fas fa-table"></i>
            </button>
            <button 
              @click="viewMode = 'cards'"
              :class="['view-btn', { active: viewMode === 'cards' }]"
            >
              <i class="fas fa-th-large"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p>Memuat data petugas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOfficers.length === 0" class="empty-state">
        <div class="empty-illustration">
          <i class="fas fa-user-slash"></i>
        </div>
        <h3>Tidak ada petugas ditemukan</h3>
        <p>Coba ubah filter pencarian atau tambah petugas baru</p>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'" class="table-container">
        <div class="enhanced-table-wrapper">
          <table class="enhanced-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Petugas</th>
                <th>Kontak</th>
                <th>Posisi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(officer, index) in filteredOfficers" 
                :key="officer.id"
             class="table-row" @click="viewOfficerDetail(officer)" style="cursor:pointer;"
              >
                  <td>
                    <div class="row-number">{{ index + 1 }}</div>
                  </td>
                  <td>
                    <div class="officer-info">
                      <div class="officer-avatar">
                        <span>{{ officer.avatar }}</span>
                      </div>
                      <div class="officer-details">
                        <RouterLink :to="`/petugas-detail/${officer.id}`" class="officer-name">
                          {{ officer.name }}
                        </RouterLink>
                        <div class="officer-position">HelpDesk</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>{{ officer.email }}</span>
                      </div>
                      <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>{{ officer.phone }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="department-info">
                      <div class="department-icon">
                        <i :class="getPositionIcon(officer.position)"></i>
                      </div>
                      <span>{{ officer.position }}</span>
                    </div>
                  </td>
                  <td>
                      <button 
                        @click.stop="toggleStatus(officer)"
                        :class="['simple-status-btn', officer.status]"
                        :aria-pressed="officer.status === 'active'"
                      >
                        <span v-if="officer.status === 'active'" class="simple-status-icon">
                          <i class="fas fa-check-circle"></i>
                        </span>
                        <span v-if="officer.status === 'active'" class="simple-status-text">Aktif</span>
                        <span v-else class="simple-status-text">Tidak Aktif</span>
                      </button>
                  </td>
                  <td>
                    <div class="button-group">
                      <RouterLink 
                        :to="`/edit-officer/${officer.id}`" 
                        class="btn btn-edit"
                        @click.stop
                      >
                        <i class="fas fa-edit"></i>
                        Edit
                      </RouterLink>
                      <button 
                        @click.stop="deleteOfficer(officer.id)"
                        class="btn btn-delete"
                      >
                        <i class="fas fa-trash"></i>
                        Hapus
                      </button>
                    </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cards View -->
      <div v-else class="cards-container">
        <div class="officers-grid">
          <div 
            v-for="officer in filteredOfficers"
            :key="officer.id"
            class="officer-card" @click="viewOfficerDetail(officer)" style="cursor:pointer;"
          >
            <div class="card-header">
              <div class="officer-avatar large">
                <span>{{ officer.avatar }}</span>
              </div>
              <div class="card-status" :class="officer.status">
                <div class="status-dot"></div>
              </div>
            </div>
            
            <div class="card-body">
              <h3 class="officer-name">{{ officer.name }}</h3>
              <p class="officer-position">Kementrian Luar Negri</p>
              
              <div class="card-info">
                <div class="info-item">
                  <i class="fas fa-headset"></i>
                  <span>Helpdesk</span>
                </div>
                <div class="info-item">
                  <i :class="getPositionIcon(officer.position)"></i>
                  <span>{{ officer.position }}</span>
                </div>
              </div>
              
              <div class="contact-details">
                <div class="contact-row">
                  <i class="fas fa-envelope"></i>
                  <span>{{ officer.email }}</span>
                </div>
                <div class="contact-row">
                  <i class="fas fa-phone"></i>
                  <span>{{ officer.phone }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                @click.stop="toggleStatus(officer)"
                :class="['status-btn', officer.status]"
              >
                <i :class="officer.status === 'active' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ officer.status === 'active' ? 'Aktif' : 'Nonaktif' }}
              </button>
              
              <div class="card-actions">
                <RouterLink :to="`/edit-officer/${officer.id}`" class="card-action-btn" @click.stop>
                  <i class="fas fa-edit"></i>
                </RouterLink>
                <button @click.stop="deleteOfficer(officer.id)" class="card-action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Alert -->
    <DeletePetugasAlert 
      :is-open="showDeleteAlert"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :is-open="showSuccessAlert"
      title="Berhasil"
      :message="successMessage"
      @close="closeSuccessAlert"
    />

    <!-- Error Alert -->
    <ErrorAlert
      :is-open="showErrorAlert"
      title="Error"
      :message="errorMessage"
      @close="closeErrorAlert"
    />
  </div>
</template>

<style scoped>
/* Header dan stats card versi kecil */
.header-petugas-mini {
  padding: 1.2rem 1.5rem;
}
.header-petugas-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.judul-petugas {
  font-size: 1.5rem;
}
.icon-petugas {
  font-size: 1.4rem;
}
.subjudul-petugas {
  font-size: 0.98rem;
}
.stats-mini-row {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.stats-mini-card {
  background: #10b981;
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 90px;
  border: none;
  font-size: 0.98rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  color: white;
}
.stats-mini-card.total {
  background: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}
.stats-mini-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.stats-mini-icon.active {
  background: #10b981;
  color: #fff;
}
.stats-mini-icon.total {
  background: #3b82f6;
  color: #fff;
}
.stats-mini-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
}
.stats-mini-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
}
/* Judul dan icon petugas seperti style gambar daftar kegiatan */
.judul-petugas {
  color: #6366f1;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.icon-petugas {
  font-size: 2.1rem;
  color: #6366f1;
  margin-right: 0.2rem;
}
.subjudul-petugas {
  color: #64748b;
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
}
/* Header kotak putih agar lebar sama dengan tabel list petugas */
.header-petugas-container {
 background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
border-radius: 20px;
padding: 25px 30px;
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
margin-bottom: 16px;
}
/* Custom style for Tambah Petugas button agar warna konsisten dan solid */
.custom-add-btn {
  background: #2563eb !important;
  color: #fff !important;
  border: none !important;
  border-radius: 14px !important;
  font-weight: 600 !important;
  padding: 1rem 2rem !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.10) !important;
  transition: background 0.2s, box-shadow 0.2s !important;
}
.custom-add-btn:hover {
  background: #1d4ed8 !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.18) !important;
}
/* Header-section putih modern seperti RequestsTable.vue */

* {
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.glass-section {
  position: relative;
  padding-top: 1rem; /* Comfortable spacing from top */
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Simple Status Button */
.simple-status-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: #dcfce7;
  color: #166534;
  transition: box-shadow 0.2s;
}
.simple-status-btn.inactive {
  background: #f3f4f6;
  color: #6b7280;
}
.simple-status-icon {
  font-size: 1.3em;
  color: #166534;
}
.simple-status-text {
  font-size: 1em;
  font-weight: 600;
}

/* Enhanced Header Section */
.header-section {
  position: relative;
  padding: 2rem 0 1rem 0;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.08)
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  margin: 1rem 2rem;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    0 4px 8px rgba(255, 255, 255, 0.1) inset,
    0 -4px 8px rgba(0, 0, 0, 0.05) inset;
  transition: all 0.3s ease;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.header-left {
  flex: 1;
}

.page-title h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 2rem;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 140px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.stat-card:hover {
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.15)
  );
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 8px 32px -1px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 255, 255, 0.15) inset;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card.active .stat-icon {
  background: linear-gradient(45deg, #10b981, #34d399);
  color: white;
}

.stat-card.total .stat-icon {
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  color: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.header-actions {
  display: flex;
  align-items: center;
}


/* Custom style for Tambah Petugas button agar warna konsisten dan solid */
.add-officer-btn {
  background: #2563eb !important;
  color: #fff !important;
  border: none !important;
  border-radius: 14px !important;
  font-weight: 600 !important;
  padding: 1rem 2rem !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.10) !important;
  transition: background 0.2s, box-shadow 0.2s !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}
.add-officer-btn:hover {
  background: #1d4ed8 !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.18) !important;
}

/* Background Decorations */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Enhanced Filters Section */
.filters-section {
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  min-width: 150px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.view-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
}

.view-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.3s ease;
  cursor: pointer;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Content Section */
.content-section {
  background: white;
  min-height: calc(100vh - 300px);
  padding: 0 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Loading, Error, and Empty States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.empty-illustration i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

/* Enhanced Table */
.table-container {
  margin-top: 1rem;
}

.enhanced-table-wrapper {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.enhanced-table {
  width: 100%;
  border-collapse: collapse;
}

.enhanced-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.enhanced-table th {
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.enhanced-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.enhanced-table tbody tr:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.enhanced-table td {
  padding: 1.5rem 1rem;
  vertical-align: middle;
}

/* Table Cell Styles */
.row-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.officer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.officer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.officer-avatar.large {
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
}

.officer-name {
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s ease;
}

.officer-name:hover {
  color: #667eea;
}

.officer-position {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.contact-item i {
  width: 16px;
  color: #9ca3af;
}

.department-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.department-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Enhanced Action Buttons */
.button-group {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: all 0.6s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn i {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.btn:hover i {
  transform: translateX(-3px);
}

.btn-edit {
  background: linear-gradient(135deg, #4318FF, #5B38FF);
  color: white;
  box-shadow: 0 4px 15px rgba(67, 24, 255, 0.2);
}

.btn-edit:hover {
  background: linear-gradient(135deg, #3311DB, #4318FF);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 24, 255, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #FF3B3B, #FF5C5C);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 59, 59, 0.2);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #DB3333, #FF3B3B);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 59, 59, 0.3);
}

/* Join Date Info Styling */
.join-date-info {
  display: flex;
  align-items: center;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #64748b;
}

.date-display i {
  color: #667eea;
}

/* Enhanced Card Actions */
.card-actions {
  display: flex;
  gap: 0.75rem;
}

.card-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  flex: 1;
  justify-content: center;
}

.card-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.card-action-btn:hover::before {
  left: 100%;
}

.card-action-btn.edit {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.card-action-btn.edit:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.card-action-btn.delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.card-action-btn.delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Cards View */
.cards-container {
  margin-top: 1rem;
}

.officers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.officer-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.officer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.officer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.card-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
}

.card-status.active {
  background: #10b981;
}

.card-status.inactive {
  background: #6b7280;
}

.card-status::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.1; }
}

.card-body {
  text-align: center;
  margin-bottom: 2rem;
}

.card-body .officer-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.card-body .officer-position {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.card-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-item i {
  color: #667eea;
  font-size: 1.2rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.875rem;
}

.contact-row i {
  width: 16px;
  color: #667eea;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-btn.active {
  background: #dcfce7;
  color: #166534;
}

.status-btn.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-btn:hover {
  transform: scale(1.05);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  background: #f3f4f6;
  color: #6b7280;
}

.card-action-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.card-action-btn.delete:hover {
  background: #ef4444;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
  
  .quick-stats {
    justify-content: center;
  }
  
  .filters-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-btn {
    min-width: 70px;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 0;
  }
  
  .header-content,
  .filters-container,
  .content-section {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .page-title h1 {
    font-size: 2rem;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-card {
    justify-content: center;
  }
  
  .officers-grid {
    grid-template-columns: 1fr;
  }
  
  .enhanced-table-wrapper {
    overflow-x: auto;
  }
  
  .enhanced-table {
    min-width: 800px;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .page-title h1 {
    font-size: 1.75rem;
  }
  
  .add-officer-btn {
    padding: 0.75rem 1.5rem !important;
    font-size: 0.875rem !important;
  }
  
  .officer-card {
    padding: 1.5rem;
  }
  
  .card-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .info-item {
    flex-direction: row;
    justify-content: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: unset;
  }
}

/* Animation Enhancements */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.officer-card {
  animation: slideInUp 0.6s ease-out;
}

.officer-card:nth-child(odd) {
  animation-delay: 0.1s;
}

.officer-card:nth-child(even) {
  animation-delay: 0.2s;
}

.table-row {
  animation: slideInUp 0.4s ease-out;
}

.table-row:nth-child(odd) {
  animation-delay: 0.05s;
}

.table-row:nth-child(even) {
  animation-delay: 0.1s;
}

/* Scrollbar Styling */
.enhanced-table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.enhanced-table-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.enhanced-table-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.enhanced-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus States for Accessibility */
.search-input:focus,
.filter-select:focus,
.view-btn:focus,
.action-btn:focus,
.status-toggle:focus,
.card-action-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .officer-card {
    border: 2px solid #374151;
  }
  
  .status-toggle.active {
    background: #16a34a;
    color: white;
  }
  
  .status-toggle.inactive {
    background: #6b7280;
    color: white;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .floating-shape {
    animation: none;
  }
  
  .card-status::before {
    animation: none;
  }
}
  </style>