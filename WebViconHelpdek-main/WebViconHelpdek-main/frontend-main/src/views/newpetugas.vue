<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HelpDeskPustikKPButton from "@/components/HelpDeskPustikKPButton.vue";
import ConfirmDialog from "@/components/officers/ConfirmDialog.vue";
import AlertDialog from "@/components/officers/AlertDialog.vue";

const router = useRouter();
const showConfirm = ref(false);
const confirmMessage = ref("");

// Alert state
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');
const alertTitle = ref('');

// Animation states
const isLoaded = ref(false);
const currentStep = ref(1);
const totalSteps = 3;

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

// Progress calculation
const formProgress = ref(0);

const calculateProgress = () => {
  const requiredFields = [
    formData.value.name,
    formData.value.position,
    formData.value.email,
    formData.value.phone
  ];
  
  const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
  formProgress.value = (filledFields / requiredFields.length) * 100;
};

const showSaveConfirmation = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'Mohon lengkapi data yang diperlukan!';
    showAlert.value = true;
    return;
  }

  confirmMessage.value = "Apakah Anda yakin ingin menyimpan data petugas ini?";
  showConfirm.value = true;
};

const submitForm = async () => {
  showConfirm.value = false;
  try {
    const response = await fetch('http://localhost:3001/petugas-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: formData.value.name,
        jabatan: formData.value.position,
        kontak: formData.value.phone,
        email: formData.value.email,
        tanggal_lahir: formData.value.personalInfo.birthDate,
        domisili: formData.value.address.city
      })
    });
    if (!response.ok) throw new Error('Gagal menyimpan data petugas');
    alertType.value = 'success';
    alertTitle.value = 'Sukses';
    alertMessage.value = 'Data petugas berhasil disimpan!';
    showAlert.value = true;
    setTimeout(() => {
      router.push('/petugas');
    }, 1500);
  } catch (err) {
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = err.message || 'Gagal menyimpan data petugas!';
    showAlert.value = true;
  }
};

const handleAlertClose = () => {
  showAlert.value = false;
  if (alertType.value === 'success') {
    router.push('/petugas');
  }
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  
  // Watch form changes for progress
  const watchForm = () => {
    calculateProgress();
  };
  
  // Set up watchers for form fields
  setInterval(watchForm, 500);
});
</script>

<template>
  <div class="" :class="{ 'loaded': isLoaded }">
    <!-- Floating particles background -->
    <div class="particles-bg">
      <div class="particle" v-for="n in 20" :key="n" :style="{
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 20 + 's',
        animationDuration: (Math.random() * 10 + 10) + 's'
      }"></div>
    </div>

    <!-- Progress indicator -->
    <div class="progress-container">
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: formProgress + '%' }"></div>
        <div class="progress-text">{{ Math.round(formProgress) }}% Complete</div>
      </div>
    </div>

    <div class="main-card">
      <!-- Header with gradient and glassmorphism -->
      <div class="card-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="header-text">
            <h1 class="header-title">Tambah Petugas Baru</h1>
            <p class="header-subtitle">Lengkapi informasi petugas dengan data yang akurat</p>
          </div>
          <div class="header-decoration">
            <div class="decoration-circle"></div>
            <div class="decoration-circle"></div>
            <div class="decoration-circle"></div>
          </div>
        </div>
        
        <!-- Step indicators -->
        <div class="step-indicators">
          <div 
            v-for="step in totalSteps" 
            :key="step" 
            class="step-indicator"
            :class="{ 'active': currentStep >= step, 'completed': currentStep > step }"
          >
            <div class="step-number">
              <i v-if="currentStep > step" class="fas fa-check"></i>
              <span v-else>{{ step }}</span>
            </div>
            <div class="step-label">
              {{ step === 1 ? 'Basic' : step === 2 ? 'Contact' : 'Personal' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form with smooth transitions -->
      <div class="card-body">
        <form @submit.prevent="showSaveConfirmation" class="modern-form">
          
          <!-- Step 1: Basic Information -->
          <div class="form-section" v-show="currentStep === 1" :class="{ 'section-active': currentStep === 1 }">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-user-tie"></i>
              </div>
              <div>
                <h3 class="section-title">Informasi Dasar</h3>
                <p class="section-subtitle">Data utama petugas</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="input-group floating-label">
                <input 
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  id="name"
                  placeholder=" "
                  required
                  @input="calculateProgress"
                >
                <label for="name" class="floating-label-text">
                  <i class="fas fa-user me-2"></i>
                  Nama Lengkap <span class="required">*</span>
                </label>
                <div class="input-border"></div>
              </div>
              
              <div class="input-group floating-label">
                <select 
                  v-model="formData.position" 
                  class="form-input form-select"
                  id="position"
                  required
                  @change="calculateProgress"
                >
                  <option value="">Pilih jabatan</option>
                  <option value="Operator">Operator</option>
                  <option value="IT Support">IT Support</option>
                  <option value="ASN">ASN</option>
                  <option value="Magang">Magang</option>
                </select>
                <label for="position" class="floating-label-text">
                  <i class="fas fa-briefcase me-2"></i>
                  Jabatan <span class="required">*</span>
                </label>
                <div class="input-border"></div>
              </div>
            </div>
            
            <div class="step-navigation">
              <button type="button" class="nav-btn next-btn" @click="nextStep">
                Selanjutnya
                <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          <!-- Step 2: Contact Information -->
          <div class="form-section" v-show="currentStep === 2" :class="{ 'section-active': currentStep === 2 }">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-address-card"></i>
              </div>
              <div>
                <h3 class="section-title">Informasi Kontak</h3>
                <p class="section-subtitle">Data komunikasi petugas</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="input-group floating-label">
                <input 
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  id="email"
                  placeholder=" "
                  required
                  @input="calculateProgress"
                >
                <label for="email" class="floating-label-text">
                  <i class="fas fa-envelope me-2"></i>
                  Email Address <span class="required">*</span>
                </label>
                <div class="input-border"></div>
              </div>
              
              <div class="input-group floating-label">
                <input 
                  v-model="formData.phone"
                  type="tel"
                  class="form-input"
                  id="phone"
                  placeholder=" "
                  required
                  @input="calculateProgress"
                >
                <label for="phone" class="floating-label-text">
                  <i class="fas fa-phone me-2"></i>
                  Nomor Telepon <span class="required">*</span>
                </label>
                <div class="input-border"></div>
              </div>
            </div>
            
            <div class="step-navigation">
              <button type="button" class="nav-btn prev-btn" @click="prevStep">
                <i class="fas fa-arrow-left me-2"></i>
                Sebelumnya
              </button>
              <button type="button" class="nav-btn next-btn" @click="nextStep">
                Selanjutnya
                <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          <!-- Step 3: Personal Information -->
          <div class="form-section" v-show="currentStep === 3" :class="{ 'section-active': currentStep === 3 }">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-info-circle"></i>
              </div>
              <div>
                <h3 class="section-title">Informasi Pribadi</h3>
                <p class="section-subtitle">Data personal opsional</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="input-group floating-label">
                <input 
                  v-model="formData.personalInfo.birthDate"
                  type="date"
                  class="form-input"
                  id="birthDate"
                  placeholder=" "
                >
                <label for="birthDate" class="floating-label-text">
                  <i class="fas fa-calendar me-2"></i>
                  Tanggal Lahir
                </label>
                <div class="input-border"></div>
              </div>
              
              <div class="input-group floating-label">
                <input 
                  v-model="formData.address.city"
                  type="text"
                  class="form-input"
                  id="city"
                  placeholder=" "
                >
                <label for="city" class="floating-label-text">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  Domisili
                </label>
                <div class="input-border"></div>
              </div>
            </div>
            
            <div class="step-navigation">
              <button type="button" class="nav-btn prev-btn" @click="prevStep">
                <i class="fas fa-arrow-left me-2"></i>
                Sebelumnya
              </button>
            </div>
          </div>

          <!-- Final Actions -->
          <div class="final-actions" v-if="currentStep === 3">
            <HelpDeskPustikKPButton
              type="button"
              variant="secondary"
              class="cancel-btn"
              @click="router.push('/petugas')"
            >
              <i class="fas fa-times me-2"></i>
              Batal
            </HelpDeskPustikKPButton>
            <HelpDeskPustikKPButton
              type="submit"
              variant="primary"
              class="submit-btn"
            >
              <i class="fas fa-save me-2"></i>
              Simpan Petugas
            </HelpDeskPustikKPButton>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Confirmation Dialog -->
  <ConfirmDialog
    v-if="showConfirm"
    :message="confirmMessage"
    @confirm="submitForm"
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
</template>

<style scoped>
/* Animated background particles */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  animation: float linear infinite;
  opacity: 0.6;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-container.loaded {
  opacity: 1;
  transform: translateY(0);
}

.progress-container {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.progress-bar-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  height: 6px;
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.main-card {
  max-width: 800px;
  margin: 0 auto;
 
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem 2rem;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1.5" fill="white" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-text {
  flex: 1;
  margin-left: 1.5rem;
}

.header-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0.5rem 0 0;
  font-weight: 400;
}

.header-decoration {
  display: flex;
  gap: 0.5rem;
}

.decoration-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

.decoration-circle:nth-child(2) {
  animation-delay: 0.5s;
}

.decoration-circle:nth-child(3) {
  animation-delay: 1s;
}

.step-indicators {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
  z-index: 2;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.step-indicator.active .step-number {
  background: white;
  color: #667eea;
  border-color: white;
  transform: scale(1.1);
}

.step-indicator.completed .step-number {
  background: #00f2fe;
  border-color: #00f2fe;
}

.step-label {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
}

.step-indicator.active .step-label {
  color: white;
  font-weight: 600;
}

.card-body {
  padding: 3rem 2rem;
}

.modern-form {
  position: relative;
}

.form-section {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-section.section-active {
  opacity: 1;
  transform: translateX(0);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.section-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  margin-right: 1rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #718096;
  margin: 0.25rem 0 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.input-group {
  position: relative;
}

.floating-label {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1.2rem 1rem 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input:not(:placeholder-shown),
.form-input:focus {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.floating-label-text {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #718096;
  pointer-events: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.form-input:not(:placeholder-shown) + .floating-label-text,
.form-input:focus + .floating-label-text {
  top: 0.75rem;
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 600;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.form-input:focus ~ .input-border {
  width: 100%;
}

.required {
  color: #e53e3e;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.nav-btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.next-btn, .submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.next-btn:hover, .submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.prev-btn, .cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.prev-btn:hover, .cancel-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.final-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn, .submit-btn {
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .header-text {
    margin-left: 0;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .step-indicators {
    gap: 1rem;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .step-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .final-actions {
    flex-direction: column;
  }
  
  .card-body {
    padding: 2rem 1.5rem;
  }
  
  .card-header {
    padding: 2rem 1.5rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .progress-text {
    font-size: 0.75rem;
    top: -20px;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .header-subtitle {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
}
</style>