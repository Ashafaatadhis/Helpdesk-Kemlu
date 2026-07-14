`<template>
  <div v-if="isOpen" class="alert-overlay">
    <div class="alert-dialog success">
      <div class="alert-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2 class="alert-title">{{ title }}</h2>
      <p class="alert-message">{{ message }}</p>
      <div class="alert-buttons">
        <button @click="onClose" class="btn-ok">
          OK
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
  },
  title: {
    type: String,
    default: 'Sukses'
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const onClose = () => {
  emit('close');
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
  background: #F0FDF4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.alert-icon i {
  font-size: 1.5rem;
  color: #22C55E;
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

.btn-ok {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  background: #22C55E;
  color: white;
}

.btn-ok:hover {
  background: #16A34A;
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