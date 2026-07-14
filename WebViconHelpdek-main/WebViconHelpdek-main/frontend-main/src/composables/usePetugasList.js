// Ambil data petugas dari backend
import { ref, onMounted } from 'vue';

export function usePetugasList() {
  const petugasList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPetugas() {
    loading.value = true;
    try {
      const res = await fetch('http://localhost:3001/petugas');
      const data = await res.json();
      // Ambil hanya nama petugas
      petugasList.value = Array.isArray(data) ? data.map(p => p.nama) : [];
      error.value = null;
    } catch (e) {
      error.value = e;
      petugasList.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchPetugas);

  return { petugasList, loading, error, fetchPetugas };
}
