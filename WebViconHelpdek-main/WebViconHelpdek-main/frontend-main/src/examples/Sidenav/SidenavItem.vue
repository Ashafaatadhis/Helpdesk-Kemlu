<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const sidebarMinimize = () => store.commit("sidebarMinimize");

const minimizeSidebar = () => {
  if (window.innerWidth < 1200) {
    sidebarMinimize();
  }
};

defineProps({
  to: {
    type: String,
    required: true,
  },
  navText: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <router-link :to="to" class="nav-link" :class="$attrs.class" @click="minimizeSidebar">
    <div
      class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
    >
      <slot name="icon"></slot>
    </div>
    <span class="nav-link-text" :class="isRTL ? ' me-1' : 'ms-1'">{{
      navText
    }}</span>
  </router-link>
</template>

<style scoped>
.nav-link.active {
  background: linear-gradient(90deg, #5e72e4 0%, #825ee4 100%);
  color: #fff !important;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(94, 114, 228, 0.10);
  font-weight: 600;
}
.nav-link.active .icon,
.nav-link.active .nav-link-text {
  color: #fff !important;
}
.nav-link {
  transition: background 0.2s, color 0.2s;
}
</style>
