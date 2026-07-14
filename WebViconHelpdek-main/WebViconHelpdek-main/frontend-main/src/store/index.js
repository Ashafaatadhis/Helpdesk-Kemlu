import { createStore } from "vuex";

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    // Tambahkan state untuk autentikasi
    isAuthenticated: false,
    user: null,
    token: null,
  },
  mutations: {
    setShowSidenav(state, value) {
      state.showSidenav = value;
    },
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    sidebarMinimize(state) {
      let sidenav_show = document.querySelector("#app");
      if (state.isPinned) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    // Mutations untuk autentikasi
    SET_AUTH(state, { token, user }) {
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      // Do not persist mock token used for frontend-only testing
     if (token) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}


    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    INIT_AUTH(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      // Only restore auth from localStorage for real tokens (ignore mock-token)
      if (token && user) {
  state.isAuthenticated = true;
  state.token = token;
  state.user = JSON.parse(user);
}

    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    login({ commit }, payload) {
      commit("SET_AUTH", payload);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    initAuth({ commit }) {
      commit("INIT_AUTH");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
});