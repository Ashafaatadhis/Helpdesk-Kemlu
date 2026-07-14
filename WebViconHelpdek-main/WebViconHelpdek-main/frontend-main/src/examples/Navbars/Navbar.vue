<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";


const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const isAuthenticated = computed(() => store.state.isAuthenticated);
const user = computed(() => store.state.user);




const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");
const handleLogout = () => {
  store.dispatch('logout');
};

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
```vue
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const isAuthenticated = computed(() => store.state.isAuthenticated);
const user = computed(() => store.state.user);

const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");
const handleLogout = () => {
  store.dispatch("logout");
};

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};

</script>