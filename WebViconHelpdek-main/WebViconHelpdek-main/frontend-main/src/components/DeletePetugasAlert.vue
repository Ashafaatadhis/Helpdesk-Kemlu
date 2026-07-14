`<template>
  <div v-if="isOpen" class="alert-overlay">
    <div class="alert-dialog">
      <div class="alert-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 class="alert-title">Konfirmasi Hapus</h2>
      <p class="alert-message">Apakah Anda ingin menghapus data ini?</p>
      <div class="alert-buttons">
        <button @click="onCancel" class="btn-cancel">
          <i class="fas fa-times"></i>
          Batal
        </button>
        <button @click="onConfirm" class="btn-delete">
          <i class="fas fa-trash"></i>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
  emit('confirm');
};

const onCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.alert-dialog {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

.alert-icon {
  width: 60px;
  height: 60px;
  background: #FEF2F2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.alert-icon i {
  font-size: 1.5rem;
  color: #EF4444;
}

.alert-title {
  color: #1F2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.alert-message {
  color: #6B7280;
  margin-bottom: 2rem;
}

.alert-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel, .btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: #F3F4F6;
  color: #6B7280;
}

.btn-cancel:hover {
  background: #E5E7EB;
}

.btn-delete {
  background: #EF4444;
  color: white;
}

.btn-delete:hover {
  background: #DC2626;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>`