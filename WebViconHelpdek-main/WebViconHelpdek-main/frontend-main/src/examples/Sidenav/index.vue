<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :style="darkMode ? 'background: transparent;' : 'background: linear-gradient(135deg, rgba(94,114,228,0.85) 0%, rgba(130,94,228,0.85) 100%);'"
  ></div>

  <aside
    class="my-3 overflow-auto sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :style="{ background: darkMode ? '#232b3b' : '#fff' }"
    :class="[
      isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3',
      layout === 'landing' ? 'bg-transparent shadow-none' : ''
    ]"
    id="sidenav-main"
  >
    <div class="sidenav-header d-flex align-items-center">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>

      <router-link class="navbar-brand d-flex align-items-center brand-link" to="/">
        <img :src="logo" alt="Helpdesk Logo" class="me-2" style="height: 35px;" />
        <span class="font-weight-bold">DUKNIS VICON</span>
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />

    <!-- List menu -->
    <SidenavList />
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/Helpdesk-Logo.png";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const darkMode = computed(() => store.state.darkMode);
</script>

<style scoped>
.sidenav-header {
  padding: 0.8rem 1rem 0.8rem 0.5rem; /* padding kiri diperkecil */
}

.brand-link {
  margin-left: -5px; 
}

.sidenav {
  box-shadow: 0 0 24px 0 rgba(44, 62, 80, 0.07);
}
</style>
