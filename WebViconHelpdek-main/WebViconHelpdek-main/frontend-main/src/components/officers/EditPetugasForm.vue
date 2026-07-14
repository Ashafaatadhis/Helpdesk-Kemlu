<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HelpDeskPustikKPButton from "@/components/HelpDeskPustikKPButton.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import AlertDialog from "./AlertDialog.vue";
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const route = useRoute();
const router = useRouter();
const showConfirm = ref(false);
const confirmMessage = ref("");
const isLoading = ref(true);

// Alert state
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');
const alertTitle = ref('');

const formData = ref({
  name: "",
  position: "",
  email: "",
  phone: "",
  personalInfo: {
    birthDate: ""
  },
  address: {
    city: ""
  },
  status: "active"
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
    console.log('Fetching officer with ID:', route.params.id); // Debug log
    const response = await fetch(`http://localhost:3001/petugas/${route.params.id}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData); // Debug log
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data); // Debug log
    
    if (!data) {
      throw new Error('No data received from server');
    }
    
    // Map backend data to frontend format
    // Format birthDate for input type="date"
    let birthDate = '';
    if (data.tanggal_lahir) {
      const d = new Date(data.tanggal_lahir);
      if (!isNaN(d.getTime())) {
        birthDate = d.toISOString().split('T')[0];
      } else {
        birthDate = data.tanggal_lahir;
      }
    }
    formData.value = {
      id: data.id,
      name: data.nama || '',
      position: data.jabatan || '',
      email: data.email || '',
      phone: data.kontak || '',
      status: data.status || 'active',
      personalInfo: {
        birthDate: birthDate
      },
      address: {
        city: data.domisili || ''
      }
    };
    // Log the received data for debugging
    console.log('Birth date received:', birthDate);
    console.log('Domisili received:', data.domisili);
  } catch (err) {
    console.error('Error fetching officer data:', err);
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'Gagal mengambil data petugas. ' + err.message;
    showAlert.value = true;
    // Hapus redirect otomatis saat error
  } finally {
    isLoading.value = false;
  }
};

const showSaveConfirmation = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'Mohon lengkapi data yang diperlukan!';
    showAlert.value = true;
    return;
  }

  confirmMessage.value = "Apakah Anda yakin ingin menyimpan perubahan data petugas ini?";
  showConfirm.value = true;
};

const saveOfficer = async () => {
  showConfirm.value = false;
  
  try {
    // Validate required fields
    if (!formData.value.name || !formData.value.email || !formData.value.phone) {
      throw new Error('Data belum lengkap. Mohon isi semua field yang diperlukan.');
    }

    // Map frontend data back to backend format
    const backendData = {
      nama: formData.value.name,
      jabatan: formData.value.position,
      email: formData.value.email,
      kontak: formData.value.phone,
      status: formData.value.status,
      tanggal_lahir: formData.value.personalInfo.birthDate,
      domisili: formData.value.address.city // Update key name to match backend
    };

    console.log('Sending data:', backendData); // Debug log

    const response = await fetch(`http://localhost:3001/petugas/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData); // Debug log
      throw new Error(`Gagal memperbarui data petugas: ${response.statusText}`);
    }

    alertType.value = 'success';
    alertTitle.value = 'Sukses';
    alertMessage.value = 'Data petugas berhasil diperbarui!';
    showAlert.value = true;
    
    // Redirect after successful update
    setTimeout(() => {
      router.push('/petugas');
    }, 1500);
  } catch (err) {
    console.error('Error updating officer:', err);
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = err.message || 'Gagal memperbarui data petugas';
    showAlert.value = true;
  }
};

const handleAlertClose = () => {
  showAlert.value = false;
  if (alertType.value === 'success') {
    router.push('/petugas');
  }
};

onMounted(() => {
  // Debug log untuk melihat ID yang diterima
  console.log('Route params:', route.params);
  fetchOfficerData();
});
</script>

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
            <h4 class="header-title">Edit Petugas</h4>
            <p class="header-subtitle">Perbarui informasi petugas</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="card-body">
        <form @submit.prevent="showSaveConfirmation" class="form-container">
          <!-- Basic Information -->
          <div class="form-section">
            <h5 class="section-title">
              <i class="fas fa-user-tie me-2"></i>
              Informasi Dasar
            </h5>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Nama Lengkap <span class="text-danger">*</span></label>
                  <input 
                    v-model="formData.name"
                    type="text"
                    class="form-control"
                    placeholder="Masukkan nama lengkap"
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Jabatan <span class="text-danger">*</span></label>
                  <select v-model="formData.position" class="form-select" required>
                    <option value="">Pilih jabatan</option>
                    <option value="Operator">Operator</option>
                    <option value="IT Support">IT Support</option>
                    <option value="ASN">ASN</option>
                    <option value="Magang">Magang</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="form-section">
            <h5 class="section-title">
              <i class="fas fa-address-card me-2"></i>
              Informasi Kontak
            </h5>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input 
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="contoh@email.com"
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Nomor Telepon <span class="text-danger">*</span></label>
                  <input 
                    v-model="formData.phone"
                    type="tel"
                    class="form-control"
                    placeholder="08xxxxxxxxxx"
                    required
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="form-section">
            <h5 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Informasi Pribadi
            </h5>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Tanggal Lahir</label>
                  <input 
                    v-model="formData.personalInfo.birthDate"
                    type="date"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Domisili</label>
                  <input 
                    v-model="formData.address.city"
                    type="text"
                    class="form-control"
                    placeholder="Masukkan kota domisili"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="form-actions">
            <HelpDeskPustikKPButton
              type="button"
              variant="secondary"
              class="me-2"
              @click="router.push('/petugas')"
            >
              Batal
            </HelpDeskPustikKPButton>
            <HelpDeskPustikKPButton
              type="submit"
              variant="primary"
            >
              Simpan Perubahan
            </HelpDeskPustikKPButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-if="showConfirm"
      :message="confirmMessage"
      @confirm="saveOfficer"
      @cancel="showConfirm = false"
    />

    <!-- Alert Dialog -->
    <AlertDialog
      :show="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      @close="handleAlertClose"
    />
  </div>
</template>

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

.card-body {
  padding: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.form-section {
  background: #f8fafe;
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid rgba(94,114,228,0.1);
}

.section-title {
  color: #5e72e4;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.form-label {
  font-weight: 500;
  color: #344767;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 2px rgba(94,114,228,0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
  
  .form-section {
    padding: 1.25rem;
  }
}
</style>
