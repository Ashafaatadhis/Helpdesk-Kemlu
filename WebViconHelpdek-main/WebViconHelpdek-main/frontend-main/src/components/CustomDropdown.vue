<template>
  <div class="dropdown-container">
    <label class="form-label" :for="id">
      <i :class="['fas', icon]"></i>
      {{ label }}
    </label>
    <select
      :id="id"
      class="dropdown-field"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="item in options"
        :key="item.id || item"
        :value="item.id || item"
      >
        {{ item.name || item }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  id: String,
  options: {
    type: Array,
    default: () => []
  },
  icon: {
    type: String,
    default: "fa-list"
  },
  placeholder: {
    type: String,
    default: "Pilih salah satu..."
  },
  modelValue: {
    type: [String, Number],
    default: ""
  }
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.dropdown-container {
  position: relative;
  width: 100%;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #8392ab;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: #5e72e4;
  font-size: 0.9rem;
}

.dropdown-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #344767;
  font-size: 0.95rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238392ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.dropdown-field:hover {
  border-color: #818cf8;
}

.dropdown-field:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

.dropdown-field option {
  padding: 0.5rem;
}
</style>
