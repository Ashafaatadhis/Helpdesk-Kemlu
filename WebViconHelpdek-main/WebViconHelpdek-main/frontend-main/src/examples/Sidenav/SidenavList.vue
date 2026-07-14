<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";


const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
import { useRouter } from 'vue-router';
const router = useRouter();
const handleLogout = () => {
  store.dispatch('logout');
  router.push('/login');
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard' ? 'active' : ''"
          :navText="isRTL ? '' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="fas fa-desktop text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/laporan"
          :class="getRoute() === 'Laporan' ? 'active' : ''"
          :navText="isRTL ? '' : 'Laporan'"
        >
          <template v-slot:icon>
            <i class="fas fa-file-alt text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/petugas"
          :class="getRoute() === 'pertugas' ? 'active' : ''"
          :navText="isRTL ? '' : 'Petugas'"
        >
          <template v-slot:icon>
            <i class="fas fa-user-cog text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/kalender-dinas"
          :class="getRoute() === 'kalender-dinas' ? 'active' : ''"
          :navText="isRTL ? '' : 'Kalender Dinas'"
        >
          <template v-slot:icon>
            <i class="fas fa-calendar-alt text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

   

      <li class="mt-3 nav-item">
        <h6
          v-if="isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
       
        </h6>

        <!-- <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          OTHERS
        </h6> -->
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? '' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="isRTL ? ' ' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? '' : 'About Us'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
    <!-- Logout Button -->
    <li class="nav-item mt-3">
      <a href="#" @click.prevent="handleLogout" class="nav-link d-flex align-items-center px-3 py-2" style="font-size: 1rem;">
        <!-- use a larger FontAwesome icon (fa-lg) so the logout size matches other items -->
        <i class="fas fa-sign-out-alt fa-lg me-2 text-danger"></i>
        <span class="nav-link-text ms-1" style="color: #e74c3c; font-weight: 500;">Logout</span>
      </a>
    </li>
    </ul>
  </div>


</template>