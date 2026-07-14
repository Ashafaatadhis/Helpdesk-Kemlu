<script setup>
import { ref } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps({
  officerId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['deleted']);

const showConfirm = ref(false);

const confirmDelete = () => {
  // Here you would typically make an API call to delete the officer
  emit('deleted', props.officerId);
  showConfirm.value = false;
};
</script>

<template>
  <div>
    <button @click="showConfirm = true" class="btn btn-danger btn-sm">
      <i class="fas fa-trash"></i>
    </button>

    <ConfirmDialog
      v-if="showConfirm"
      title="Hapus Petugas"
      message="Apakah Anda yakin ingin menghapus petugas ini?"
      @confirm="confirmDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<style scoped>
.btn-danger {
  background: linear-gradient(45deg, #f5365c, #f5367c);
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(245, 54, 92, 0.2);
}

.btn-danger::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.btn-danger:hover::after {
  width: 150%;
  height: 150%;
}
</style>
