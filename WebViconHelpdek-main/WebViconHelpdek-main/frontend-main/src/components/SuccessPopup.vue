`<template>
  <div class="popup-overlay" v-if="show" @click.self="$emit('close')">
    <div class="popup-content">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="button-group">
        <button class="btn btn-success" @click="goToLaporan">
          <i class="fas fa-eye me-2"></i>Lihat Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Berhasil!'
  },
  message: {
    type: String,
    default: 'Data telah berhasil disimpan'
  }
});

function goToLaporan() {
  router.push('/laporan');
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.success-icon {
  font-size: 4rem;
  color: #2dce89;
  margin-bottom: 1rem;
}

.success-icon i {
  animation: scaleIn 0.5s ease-out;
}

h3 {
  color: #344767;
  margin-bottom: 0.5rem;
}

p {
  color: #67748e;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 5px;
  transition: all 0.2s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>`
