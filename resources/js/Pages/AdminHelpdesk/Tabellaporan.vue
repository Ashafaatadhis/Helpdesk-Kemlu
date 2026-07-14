<template>
  <AppLayout role="admin">
    <template #header>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDaysIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ t('adminHelpdesk.kegiatan.title') }}</h1>
              <p class="text-gray-500 text-sm">{{ t('adminHelpdesk.kegiatan.description') }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="filters.search"
                type="text"
                class="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-72"
                :placeholder="t('adminHelpdesk.kegiatan.searchPlaceholder')"
                @input="debouncedSearch"
              />
            </div>

            <!-- Tambah -->
            <button
              @click="goToTambah"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              <PlusIcon class="w-5 h-5" />
              {{ t('adminHelpdesk.kegiatan.add') }}
            </button>

            <!-- Export -->
            <button
              @click="exportExcel"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm"
            >
              <DocumentArrowDownIcon class="w-5 h-5" />
              {{ t('adminHelpdesk.kegiatan.exportExcel') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Table Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Table Top -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-gray-100">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <ListBulletIcon class="w-5 h-5" />
              Total: {{ kegiatan.total || 0 }} kegiatan
            </div>
            <div class="flex items-center gap-2">
              <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-100 text-indigo-600 transition">
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <span class="text-sm font-bold text-gray-600 min-w-[140px] text-center">{{ monthLabel }}</span>
              <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 text-indigo-600 transition">
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Status Filters -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="f in statusFilters"
              :key="f.key"
              @click="setStatusFilter(f.key)"
              class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition"
              :class="activeFilter === f.key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : f.colorClass"
            >
              {{ f.label }} ({{ f.count }})
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th class="text-left px-5 py-3 font-semibold">Kegiatan</th>
                <th class="text-left px-5 py-3 font-semibold">Informasi Umum</th>
                <th class="text-left px-5 py-3 font-semibold">Lokasi & Kontak</th>
                <th class="text-left px-5 py-3 font-semibold">Pelaksana</th>
                <th class="text-center px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="item in kegiatan.data"
                :key="item.id"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <!-- Kegiatan -->
                <td class="px-5 py-4">
                  <button @click="goToDetail(item.id)" class="text-left">
                    <p class="font-bold text-indigo-600 hover:underline">{{ item.nama_kegiatan }}</p>
                    <div class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                      <CalendarDaysIcon class="w-3.5 h-3.5" />
                      {{ formatDate(item.tgl_dari) }} - {{ formatDate(item.tgl_sampai) }}
                    </div>
                    <div class="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                      <ClockIcon class="w-3.5 h-3.5" />
                      {{ item.waktu_mulai }} - {{ item.waktu_selesai }}
                    </div>
                  </button>
                </td>

                <!-- Informasi -->
                <td class="px-5 py-4">
                  <p class="text-xs text-gray-400 mb-0.5">Nota Dinas</p>
                  <p class="font-semibold text-gray-700 text-sm">{{ item.nomor_nodin || '-' }}</p>
                  <p class="text-xs text-gray-400 mt-2 mb-0.5">Satuan Kerja</p>
                  <p class="font-semibold text-gray-700 text-sm">{{ item.satker_permohonan || '-' }}</p>
                </td>

                <!-- Lokasi -->
                <td class="px-5 py-4">
                  <p class="text-xs text-gray-400 mb-0.5">Lokasi</p>
                  <div class="flex items-center gap-1.5">
                    <MapPinIcon class="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span class="font-semibold text-gray-700 text-sm">{{ item.lokasi || '-' }}</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-2 mb-0.5">Contact Person</p>
                  <div class="flex items-center gap-1.5">
                    <PhoneIcon class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span class="font-semibold text-gray-700 text-sm">{{ item.cp_satker || '-' }}</span>
                  </div>
                </td>

                <!-- Pelaksana -->
                <td class="px-5 py-4">
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="petugas in parsePetugas(item.petugas)"
                      :key="petugas"
                      class="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg"
                    >
                      <UserCircleIcon class="w-3.5 h-3.5" />
                      {{ petugas }}
                    </span>
                  </div>
                </td>

                <!-- Aksi -->
                <td class="px-5 py-4">
                  <div class="flex flex-col items-center gap-2">
                    <button
                      @click="cycleStatus(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 active:scale-95"
                      :class="statusBgClass(item.status)"
                    >
                      <span class="w-1.5 h-1.5 bg-white rounded-full"></span>
                      {{ item.status || 'Pending' }}
                    </button>
                    <div class="flex items-center gap-1.5">
                      <button
                        @click="goToDetail(item.id)"
                        class="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                        title="Detail"
                      >
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="goToEdit(item.id)"
                        class="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                        title="Edit"
                      >
                        <PencilSquareIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="confirmDelete(item)"
                        class="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Hapus"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!kegiatan.data || kegiatan.data.length === 0">
                <td colspan="5" class="px-5 py-16 text-center">
                  <InboxIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-400 text-sm">Tidak ada kegiatan ditemukan</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="kegiatan.last_page > 1" class="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <button
            @click="goToPage(kegiatan.current_page - 1)"
            :disabled="!kegiatan.prev_page_url"
            class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            Prev
          </button>
          <span class="text-sm font-semibold text-gray-500">
            Halaman {{ kegiatan.current_page }} dari {{ kegiatan.last_page }}
          </span>
          <button
            @click="goToPage(kegiatan.current_page + 1)"
            :disabled="!kegiatan.next_page_url"
            class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import AppLayout from '@/Layouts/AppLayout.vue';
import { debounce } from 'lodash';

const { t } = useI18n();
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  InboxIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  kegiatan: Object,
  filters: Object,
  statusCounts: Object,
});

const filters = ref({
  search: props.filters?.search || '',
  status: props.filters?.status || '',
  month: props.filters?.month || new Date().getMonth() + 1,
  year: props.filters?.year || new Date().getFullYear(),
});

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const monthLabel = computed(() => `${months[filters.value.month - 1]} ${filters.value.year}`);

const activeFilter = computed(() => filters.value.status || 'Semua');

const statusFilters = computed(() => [
  { key: 'Semua', label: 'Semua', count: Object.values(props.statusCounts || {}).reduce((a, b) => a + b, 0), colorClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
  { key: 'Done', label: 'Done', count: props.statusCounts?.Done || 0, colorClass: 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50' },
  { key: 'Pending', label: 'Pending', count: props.statusCounts?.Pending || 0, colorClass: 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50' },
  { key: 'Mandiri', label: 'Mandiri', count: props.statusCounts?.Mandiri || 0, colorClass: 'bg-white text-cyan-600 border-cyan-200 hover:bg-cyan-50' },
  { key: 'Batal', label: 'Batal', count: props.statusCounts?.Batal || 0, colorClass: 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50' },
]);

const debouncedSearch = debounce(() => applyFilters(), 300);

function applyFilters() {
  router.get('/admin/kegiatan', filters.value, { preserveScroll: true, preserveState: true });
}

function prevMonth() {
  if (filters.value.month === 1) { filters.value.month = 12; filters.value.year--; }
  else { filters.value.month--; }
  applyFilters();
}

function nextMonth() {
  if (filters.value.month === 12) { filters.value.month = 1; filters.value.year++; }
  else { filters.value.month++; }
  applyFilters();
}

function setStatusFilter(status) {
  filters.value.status = status === 'Semua' ? '' : status;
  applyFilters();
}

function goToPage(page) {
  router.get('/admin/kegiatan', { ...filters.value, page }, { preserveScroll: true });
}

function goToTambah() { router.visit('/admin/kegiatan/create'); }
function goToDetail(id) { router.visit(`/admin/kegiatan/${id}`); }
function goToEdit(id) { router.visit(`/admin/kegiatan/${id}/edit`); }

function confirmDelete(item) {
  if (confirm(`Hapus kegiatan "${item.nama_kegiatan}"?`)) {
    router.delete(`/admin/kegiatan/${item.id}`, { preserveScroll: true });
  }
}

function cycleStatus(item) {
  const statuses = ['Pending', 'Done', 'Mandiri', 'Batal'];
  const idx = statuses.indexOf(item.status || 'Pending');
  const next = statuses[(idx + 1) % statuses.length];
  const prev = item.status;

  // Optimistic update — langsung berubah
  item.status = next;

  fetch(`/admin/kegiatan/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ status: next }),
  }).then(res => {
    if (!res.ok) throw new Error();
    // Sync statusCounts tanpa reload penuh
    router.reload({ only: ['statusCounts'] });
  }).catch(() => {
    // Gagal — revert
    item.status = prev;
  });
}

function statusBgClass(status) {
  const map = {
    Done: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Mandiri: 'bg-cyan-500',
    Batal: 'bg-rose-500',
  };
  return map[status] || 'bg-amber-500';
}

function parsePetugas(p) {
  if (!p) return [];
  return p.split(',').map(s => s.trim()).filter(Boolean);
}

function formatDate(d) {
  if (!d) return '-';
  const [y, m, day] = d.split('T')[0].split('-');
  return `${day}-${m}-${y}`;
}

function exportExcel() {
  const params = new URLSearchParams(filters.value).toString();
  window.open(`/admin/kegiatan-export?${params}`, '_blank');
}
</script>
