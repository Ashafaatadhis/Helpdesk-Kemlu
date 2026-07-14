<template>
  <div class="page-container">
    <div class="card">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Memuat data petugas...</p>
      </div>

      <!-- Header -->
      <div v-else class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="header-title">Detail Petugas</h4>
            <p class="header-subtitle">Informasi lengkap petugas</p>
          </div>
          <div class="header-actions">
            <RouterLink :to="`/edit-officer/${route.params.id}`">
              <HelpDeskPustikKPButton
                type="button"
                variant="outline-light"
                class="me-2"
              >
                <i class="fas fa-edit me-1"></i>
                Edit
              </HelpDeskPustikKPButton>
            </RouterLink>
            <HelpDeskPustikKPButton
              type="button"
              variant="light"
              @click="router.push('/petugas')"
            >
              <i class="fas fa-arrow-left me-1"></i>
              Kembali
            </HelpDeskPustikKPButton>
          </div>
        </div>
      </div>

      <!-- Detail Content -->
      <div v-if="!isLoading" class="card-body">
        <div class="profile-layout">
          <!-- Profile Section -->
          <div class="profile-section">
            <div class="profile-header">
              <div class="profile-avatar">
                <img src="@/assets/img/Helpdesk-Logo.png" alt="Profile Avatar" class="avatar-image" />
              </div>
              <div class="profile-info">
                <h2 class="profile-name">{{ officerData.name || '-' }}</h2>
                <div class="profile-badges">
                  <span class="badge-position" :class="getPositionClass(officerData.position)">
                    <i class="fas fa-briefcase me-1"></i>
                    {{ officerData.position || '-' }}
                  </span>
                  <span class="badge-status ms-2" :class="getStatusClass(officerData.status)">
                    <i class="fas fa-circle me-1"></i>
                    {{ getStatusText(officerData.status) }}
                  </span>
                </div>
                <div class="profile-department mt-2">
                  <span class="department-badge">
                    <i class="fas fa-building me-1"></i>
                    Kementrian Luar Negri
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Combined Information Section -->
          <div class="info-section">
            <div class="detail-section">
              <h5 class="section-title">
                <i class="fas fa-user me-2"></i>
                Informasi Petugas
              </h5>
              <div class="info-grid">
                <!-- Contact Information -->
                <div class="info-card">
                  <div class="info-card-header">
                    <i class="fas fa-envelope-open-text"></i>
                    <h6>EMAIL</h6>
                  </div>
                  <div class="info-card-content">
                    <a v-if="officerData.email" :href="`mailto:${officerData.email}`" class="info-link">
                      {{ officerData.email }}
                    </a>
                    <span v-else class="info-placeholder">-</span>
                  </div>
                </div>

                <div class="info-card">
                  <div class="info-card-header">
                    <i class="fas fa-phone-alt"></i>
                    <h6>NOMOR TELEPON</h6>
                  </div>
                  <div class="info-card-content">
                    <a v-if="officerData.phone" :href="`tel:${officerData.phone}`" class="info-link">
                      {{ formatPhoneNumber(officerData.phone) }}
                    </a>
                    <span v-else class="info-placeholder">-</span>
                  </div>
                </div>

                <div class="info-card">
                  <div class="info-card-header">
                    <i class="fas fa-calendar-alt"></i>
                    <h6>TANGGAL LAHIR</h6>
                  </div>
                  <div class="info-card-content">
                    <span :class="{'info-placeholder': !officerData.personalInfo?.birthDate}">
                      {{ formatDate(officerData.personalInfo?.birthDate) || '-' }}
                    </span>
                  </div>
                </div>

                <div class="info-card">
                  <div class="info-card-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <h6>DOMISILI</h6>
                  </div>
                  <div class="info-card-content">
                    <span :class="{'info-placeholder': !officerData.address?.city}">
                      {{ officerData.address?.city || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Dialog -->
    <AlertDialog
      :show="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      @close="showAlert = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import HelpDeskPustikKPButton from "@/components/HelpDeskPustikKPButton.vue";
import AlertDialog from "./AlertDialog.vue";

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

// Alert state
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');
const alertTitle = ref('');

const officerData = ref({
  id: "",
  name: "",
  position: "",
  email: "",
  phone: "",
  status: "active",
  personalInfo: {
    birthDate: ""
  },
  address: {
    city: ""
  },
  createdAt: "",
  updatedAt: ""
});

// Fetch officer data based on ID
const fetchOfficerData = async () => {
  if (!route.params.id) {
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'ID Petugas tidak ditemukan';
    showAlert.value = true;
    return;
  }

  isLoading.value = true;
  try {
    console.log('Fetching officer with ID:', route.params.id);
    const response = await fetch(`http://localhost:3001/petugas/${route.params.id}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    if (!data) {
      throw new Error('No data received from server');
    }
    
    // Map backend data to frontend format
    officerData.value = {
      id: data.id,
      name: data.nama || '',
      position: data.jabatan || '',
      email: data.email || '',
      phone: data.kontak || '',
      status: data.status || 'active',
      personalInfo: {
        birthDate: data.tanggal_lahir || ''
      },
      address: {
        city: data.kota || data.domisili || ''
      },
      createdAt: data.created_at || data.createdAt || '',
      updatedAt: data.updated_at || data.updatedAt || ''
    };
  } catch (err) {
    console.error('Error fetching officer data:', err);
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'Gagal mengambil data petugas. ' + err.message;
    showAlert.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Utility functions
const getPositionClass = (position) => {
  const classes = {
    'Operator': 'bg-primary',
    'IT Support': 'bg-info',
    'ASN': 'bg-success',
    'Magang': 'bg-warning'
  };
  return classes[position] || 'bg-secondary';
};

const getStatusClass = (status) => {
  return status === 'active' ? 'bg-success' : 'bg-danger';
};

const getStatusText = (status) => {
  return status === 'active' ? 'Aktif' : 'Tidak Aktif';
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format phone number: 08123456789 -> 0812-3456-789
  return phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
};

onMounted(() => {
  console.log('Route params:', route.params);
  fetchOfficerData();
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

.profile-header {
  background: linear-gradient(165deg, #5e72e4 8%, #825ee4 92%);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 12px 24px -8px rgba(94,114,228,0.3),
    0 8px 16px -6px rgba(130,94,228,0.2);
  border: 1px solid rgba(255,255,255,0.1);
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at top right,
    rgba(255,255,255,0.12) 0%,
    rgba(255,255,255,0.05) 25%,
    transparent 50%
  );
  pointer-events: none;
}

.profile-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(120deg, 
      rgba(255,255,255,0.2) -20%,
      transparent 20%,
      transparent 100%
    );
  pointer-events: none;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e72e4;
  font-size: 3.5rem;
  box-shadow: 
    0 8px 32px -8px rgba(0,0,0,0.3),
    0 0 0 8px rgba(255,255,255,0.2);
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin: 0.5rem 0;
}

.profile-avatar:hover {
  transform: scale(1.08) rotate(8deg);
  box-shadow: 
    0 12px 40px -8px rgba(0,0,0,0.4),
    0 0 0 12px rgba(255,255,255,0.3);
}

.profile-avatar .avatar-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.profile-info {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 0.5rem;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.5px;
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.2),
    0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  padding: 0.5rem 0;
}

.profile-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: rgba(255,255,255,0.5);
  border-radius: 3px;
}

.profile-badges {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: -0.5rem;
  white-space: nowrap;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.card-body {
  padding: 2rem;
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-section {
  position: relative;
}

.info-section {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(94,114,228,0.1);
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(94,114,228,0.08);
  border-color: rgba(94,114,228,0.2);
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-card-header i {
  font-size: 1.25rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(94,114,228,0.1), rgba(130,94,228,0.1));
  color: #5e72e4;
  transition: all 0.3s ease;
}

.info-card:hover .info-card-header i {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  transform: scale(1.05);
}

.info-card-header h6 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8392ab;
  letter-spacing: 0.5px;
}

.info-card-content {
  font-size: 1rem;
  font-weight: 500;
  color: #344767;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.info-link {
  color: #5e72e4;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.info-link:hover {
  color: #4c63d2;
  text-decoration: underline;
}

.info-placeholder {
  color: #8392ab;
  font-style: italic;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.detail-section {
  background: linear-gradient(145deg, #ffffff, #f8fafe);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(94,114,228,0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(94,114,228,0.1);
}

.detail-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #5e72e4, #825ee4);
  border-radius: 4px;
}

.section-title {
  color: #5e72e4;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.section-title i {
  background: linear-gradient(45deg, #5e72e4, #825ee4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.4rem;
}

.detail-item {
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: rgba(94,114,228,0.03);
}

.detail-label {
  font-weight: 600;
  color: #8392ab;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 0.75rem;
  display: block;
  transition: color 0.2s ease;
}

.detail-item:hover .detail-label {
  color: #5e72e4;
}

.detail-value {
  color: #344767;
  font-size: 1.05rem;
  font-weight: 500;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
}

.badge-position, .badge-status {
  padding: 0.35rem 0.875rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;
  color: white;
}

.badge-position:hover, .badge-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.badge-position i, .badge-status i {
  font-size: 1.1rem;
  color: white;
}

.badge-status {
  min-width: 100px;
}

.badge-position.bg-primary {
  background: #5e72e4;
  color: white;
}

.badge-position.bg-info {
  background: #11cdef;
  color: white;
}

.badge-position.bg-success {
  background: #2dce89;
  color: white;
}

.badge-position.bg-warning {
  background: #fb6340;
  color: white;
}

.badge-position.bg-secondary {
  background: #8392ab;
  color: white;
}

.badge-status.bg-success {
  background: rgba(45, 206, 137, 0.9);
}

.badge-status.bg-danger {
  background: rgba(245, 54, 92, 0.9);
}

.profile-department {
  width: 100%;
  display: flex;
  justify-content: center;
}

.department-badge {
  padding: 0.35rem 1rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  color: white;
}

.department-badge i {
  font-size: 0.875rem;
}

.email-link, .phone-link {
  color: #5e72e4;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  background: rgba(94,114,228,0.05);
}

.email-link:hover, .phone-link:hover {
  color: #4c63d2;
  background: rgba(94,114,228,0.1);
  transform: translateY(-1px);
}

.email-link i, .phone-link i {
  font-size: 1.1rem;
  background: linear-gradient(45deg, #5e72e4, #825ee4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 0.5rem;
}

.bg-primary { background-color: #5e72e4 !important; }
.bg-info { background-color: #11cdef !important; }
.bg-success { background-color: #2dce89 !important; }
.bg-warning { background-color: #fb6340 !important; }
.bg-secondary { background-color: #8392ab !important; }
.bg-danger { background-color: #f5365c !important; }

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .card-header {
    padding: 1.5rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .detail-section {
    padding: 1.25rem;
  }

  .profile-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .info-card-header {
    gap: 0.5rem;
  }

  .info-card-header i {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.1rem;
  }

  .info-card-content {
    font-size: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
    gap: 1.5rem;
  }

  .profile-info {
    width: 100%;
  }

  .profile-badges {
    justify-content: center;
  }

  .profile-name {
    font-size: 1.75rem;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }

  .badge-position, .badge-status {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>