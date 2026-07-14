<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="alert-overlay" @click="emit('close')">
      <div class="alert-dialog" :class="type" @click.stop>
        <div class="alert-icon">
          <i class="fas" :class="{
            'fa-check-circle': type === 'success',
            'fa-exclamation-circle': type === 'error',
            'fa-info-circle': type === 'info',
            'fa-exclamation-triangle': type === 'warning'
          }"></i>
        </div>
        <div class="alert-content">
          <h3 v-if="title" class="alert-title">{{ title }}</h3>
          <p class="alert-message">{{ message }}</p>
        </div>
        <button class="alert-close" @click="emit('close')">OK</button>
      </div>
    </div>
  </Transition>
</template>

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
  z-index: 9999;
}

.alert-dialog {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.alert-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.alert-content {
  margin-bottom: 1.5rem;
}

.alert-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.alert-message {
  color: #666;
  margin: 0;
}

.alert-close {
  background: #5e72e4;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.alert-close:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.2);
}

/* Alert Types */
.success .alert-icon {
  color: #2dce89;
}

.error .alert-icon {
  color: #f5365c;
}

.info .alert-icon {
  color: #11cdef;
}

.warning .alert-icon {
  color: #fb6340;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
</style>
