<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Konfirmasi'
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="modal-backdrop" @click="emit('cancel')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" @click="emit('cancel')"></button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="emit('cancel')">
          Batal
        </button>
        <button type="button" class="btn btn-primary" @click="emit('confirm')">
          Ya, Lanjutkan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: modal-in 0.3s ease-out;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #344767;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #8392ab;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #344767;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: #e9ecef;
  color: #344767;
}

.btn-secondary:hover {
  background: #dee2e6;
}

.btn-primary {
  background: #5e72e4;
  color: white;
}

.btn-primary:hover {
  background: #485fe0;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
