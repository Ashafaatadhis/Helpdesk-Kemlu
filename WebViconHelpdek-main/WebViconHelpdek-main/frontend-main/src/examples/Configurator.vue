<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  toggle: Function,
  class: [String, Array, Object]
});

const doToggle = () => {
  if (props.toggle && typeof props.toggle === 'function') props.toggle();
};
</script>

<template>
  <!-- Simple placeholder configurator: small button that toggles config -->
  <div :class="props.class">
    <!-- <button class="btn btn-sm btn-light" @click="doToggle"></button> -->
  </div>
</template>
