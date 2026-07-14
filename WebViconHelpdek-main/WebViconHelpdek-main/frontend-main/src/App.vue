<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import Sidenav from "./examples/Sidenav";
import Navbar from "./components/FixedNavbar.vue";
// import AppFooter from "./examples/Footer.vue";
import Configurator from "./examples/Configurator.vue";

const store = useStore();
const route = useRoute();

onMounted(() => {
  // Restore auth state from localStorage when app mounts
  if (store && store.dispatch) store.dispatch('initAuth');
});

const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const showFooter = computed(() => store.state.showFooter);
const showNavbar = computed(() => store.state.showNavbar);
const navClasses = computed(() => store.state.navClasses);
// toggleConfigurator should be an action that commits the mutation to toggle the configurator
const toggleConfigurator = () => store.commit('toggleConfigurator');
const showConfig = computed(() => store.state.showConfig);
const hideConfigButton = computed(() => store.state.hideConfigButton);

// 🔹 Cek apakah halaman sekarang adalah halaman login
const isLoginPage = computed(() => {
  return route.path === "/login" || route.name === "Login";
});
</script>

<template>
  <div id="app">
    <!-- Layout utama jika bukan halaman login -->
    <template v-if="!isLoginPage">
      <div
        v-show="layout === 'landing'"
        class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
      ></div>

      <sidenav v-if="showSidenav" />

      <main
        class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
      >
        <navbar :class="[navClasses]" v-if="showNavbar" />

        <router-view />

        <app-footer v-show="showFooter" />

        <configurator
          :toggle="toggleConfigurator"
          :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
        />
      </main>
    </template>

    <!-- Halaman login (tanpa layout) -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
