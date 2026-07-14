<template>
  <Transition name="fade">
    <div v-if="show" class="alert-dialog-backdrop" @click="$emit('close')">
      <div class="alert-dialog" @click.stop>
        <div :class="['alert-icon', type]">
          <i :class="getIcon"></i>
        </div>
        <h3 class="alert-title">{{ title }}</h3>
        <p class="alert-message">{{ message }}</p>
        <button class="alert-close" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'AlertDialog',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    getIcon() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      return icons[this.type] || icons.info;
    }
  }
};
</script>

<style scoped>
.alert-dialog-backdrop {
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
  backdrop-filter: blur(4px);
}

.alert-dialog {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  position: relative;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

.alert-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.alert-icon.success {
  background: rgba(45, 206, 137, 0.1);
  color: #2dce89;
}

.alert-icon.error {
  background: rgba(245, 54, 92, 0.1);
  color: #f5365c;
}

.alert-icon.warning {
  background: rgba(251, 99, 64, 0.1);
  color: #fb6340;
}

.alert-icon.info {
  background: rgba(17, 205, 239, 0.1);
  color: #11cdef;
}

.alert-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #344767;
  margin: 0 0 0.75rem;
}

.alert-message {
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.alert-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-close:hover {
  background: #e9ecef;
  color: #343a40;
}

/* Transitions */
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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .alert-dialog {
    width: 85%;
    padding: 1.5rem;
  }
  
  .alert-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .alert-title {
    font-size: 1.1rem;
  }
  
  .alert-message {
    font-size: 0.9rem;
  }
}
</style>