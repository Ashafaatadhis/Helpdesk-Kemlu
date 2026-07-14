import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Dashboard from "../views/Dashboard.vue";
import TabelDinas from "../views/components/tabeldinas.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/petugas.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import KegiatanForm from "../views/components/KegiatanForm.vue";
import KegiatanDetail from "../views/KegiatanDetail.vue";
import KegiatanEdit from "../views/KegiatanEdit.vue";
import PetugasDetailView from "../views/components/petugasdetail.vue";
import NewPetugas from "../views/newpetugas.vue";
import EditPetugasForm from "../components/officers/EditPetugasForm.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/kalender-dinas",
    name: "Kalender-Dinas",
    component: TabelDinas,
    meta: { requiresAuth: true },
  },
  {
    path: "/laporan",
    name: "Laporan",
    component: Tables,
    meta: { requiresAuth: true },
  },
  {
    path: "/petugas",
    name: "petugas",
    component: Billing,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/kegiatan-form",
    name: "KegiatanForm",
    component: KegiatanForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/kegiatan-edit/:id",
    name: "KegiatanEdit",
    component: KegiatanEdit,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "Signin",
    redirect: "/login",
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { requiresAuth: true },
  },
  {
    path: "/kegiatan-detail/:id",
    name: "KegiatanDetail",
    component: KegiatanDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/petugas-detail/:id",
    name: "PetugasDetail",
    component: PetugasDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/petugas-form",
    name: "NewPetugas",
    component: NewPetugas,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-officer/:id",
    name: "EditPetugas",
    component: EditPetugasForm,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Inisialisasi auth dari localStorage
  store.dispatch("initAuth");

  const isAuthenticated = store.getters.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Jika route memerlukan auth dan user belum login
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Jika route untuk guest dan user sudah login
    next("/dashboard-default");
  } else {
    next();
  }
});

export default router;