<template>
  <AppLayout role="admin">
    <template #header>
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <CalendarDaysIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ t('adminHelpdesk.kegiatan.calendarTitle') }}</h1>
              <p class="text-white/70 text-sm">{{ t('adminHelpdesk.kegiatan.calendarDescription') }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 px-4 py-2.5 bg-white/20 rounded-xl backdrop-blur-sm text-white text-sm font-bold">
              <CalendarDaysIcon class="w-5 h-5" />
              <span class="text-lg">{{ hariTerjadwal }}</span>
              {{ t('adminHelpdesk.kegiatan.scheduledDays') }} {{ headerLabel }}
            </div>

            <div class="relative">
              <MagnifyingGlassIcon class="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                class="pl-10 pr-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none w-60"
                :placeholder="t('adminHelpdesk.kegiatan.searchPetugas')"
              />
            </div>

            <button @click="exportExcel" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition shadow-sm">
              <DocumentArrowDownIcon class="w-5 h-5" />
              {{ t('adminHelpdesk.kegiatan.exportExcel') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Calendar Nav -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <button @click="prev" class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition">
              <ChevronLeftIcon class="w-4 h-4" />
            </button>
            <button @click="next" class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition">
              <ChevronRightIcon class="w-4 h-4" />
            </button>
            <button @click="goToToday" class="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition">
              {{ t('adminHelpdesk.kegiatan.today') }}
            </button>
          </div>

          <h3 class="text-lg font-bold text-gray-900 text-center">{{ headerLabel }}</h3>

          <div class="flex border border-gray-200 rounded-lg overflow-hidden">
            <button @click="currentView = 'month'" class="px-4 py-2 text-xs font-bold transition" :class="currentView === 'month' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'">
              {{ t('adminHelpdesk.kegiatan.month') }}
            </button>
            <button @click="currentView = 'week'" class="px-4 py-2 text-xs font-bold transition" :class="currentView === 'week' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'">
              {{ t('adminHelpdesk.kegiatan.week') }}
            </button>
          </div>
        </div>

        <!-- Day Names Header -->
        <div class="grid grid-cols-7">
          <div v-for="day in dayNames" :key="day" class="text-center py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            {{ day }}
          </div>
        </div>

        <!-- Month View -->
        <div v-if="currentView === 'month'" class="grid grid-cols-7">
          <div
            v-for="(cell, idx) in monthCells"
            :key="idx"
            class="min-h-[100px] border-b border-r border-gray-50 p-2 cursor-pointer hover:bg-gray-50/50 transition-colors"
            :class="{
              'bg-gray-50/80': !cell.isCurrentMonth,
              'bg-amber-50/50': cell.isToday,
            }"
          >
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-1"
              :class="cell.isToday ? 'bg-amber-500 text-white' : cell.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'"
            >
              {{ cell.day }}
            </span>
            <div class="space-y-0.5">
              <div
                v-for="event in cell.events.slice(0, 3)"
                :key="event.id"
                class="px-1.5 py-0.5 rounded text-[10px] font-bold text-white truncate cursor-pointer hover:opacity-80 transition"
                :style="{ background: event.color }"
                @click.stop="showEventDetail(event)"
                @mouseenter="onEventMouseEnter(event, $event)"
                @mouseleave="onEventMouseLeave"
              >
                {{ event.petugas }}
              </div>
              <div
                v-if="cell.events.length > 3"
                class="text-[10px] text-gray-400 font-semibold pl-1 cursor-pointer hover:text-indigo-500 transition relative"
                @mouseenter="onMoreMouseEnter(cell.events.slice(3), $event)"
                @mouseleave="onEventMouseLeave"
              >
                +{{ cell.events.length - 3 }} lainnya
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else class="grid grid-cols-7">
          <div
            v-for="(cell, idx) in weekCells"
            :key="idx"
            class="min-h-[400px] border-b border-r border-gray-50 p-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
            :class="{ 'bg-amber-50/50': cell.isToday }"
          >
            <div class="flex items-center gap-2 mb-3">
              <span
                class="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold"
                :class="cell.isToday ? 'bg-amber-500 text-white' : 'text-gray-700'"
              >
                {{ cell.day }}
              </span>
              <div>
                <p class="text-xs font-bold text-gray-500">{{ cell.dayName }}</p>
                <p class="text-[10px] text-gray-400">{{ cell.dateStr }}</p>
              </div>
            </div>
            <div class="space-y-1">
              <div
                v-for="event in cell.events"
                :key="event.id"
                class="px-2 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer hover:opacity-80 transition"
                :style="{ background: event.color }"
                @click.stop="showEventDetail(event)"
                @mouseenter="onEventMouseEnter(event, $event)"
                @mouseleave="onEventMouseLeave"
              >
                <p class="truncate">{{ event.petugas }}</p>
                <p class="text-[10px] opacity-80 truncate">{{ event.nama_kegiatan }}</p>
                <p class="text-[10px] opacity-70">{{ event.waktu }}</p>
              </div>
              <p v-if="cell.events.length === 0" class="text-[10px] text-gray-300 text-center mt-4">{{ t('common.noData') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="hoveredEvent"
          class="fixed z-[9998] pointer-events-none"
          :style="{ left: tooltipPos.x + 'px', top: (tooltipPos.y - 8) + 'px', transform: 'translate(-50%, -100%)' }"
        >
          <div class="bg-gray-900 text-white rounded-xl shadow-xl p-3 w-56 text-xs space-y-1.5">
            <div class="font-bold text-sm truncate">{{ hoveredEvent.nama_kegiatan }}</div>
            <div class="flex items-center gap-1.5 text-gray-300">
              <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: hoveredEvent.color }"></span>
              {{ hoveredEvent.petugas }}
            </div>
            <div class="text-gray-400">📍 {{ hoveredEvent.lokasi || '-' }}</div>
            <div class="text-gray-400">🕐 {{ hoveredEvent.waktu }}</div>
            <div class="flex items-center justify-between mt-1 pt-1.5 border-t border-white/10">
              <span class="text-gray-400">{{ hoveredEvent.date }}</span>
              <span class="px-2 py-0.5 rounded-full font-bold text-[10px]" :class="statusBadgeClass(hoveredEvent.status)">
                {{ hoveredEvent.status || 'Pending' }}
              </span>
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- More Events Tooltip -->
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="hoveredMoreEvents"
          class="fixed z-[9998] pointer-events-none"
          :style="{ left: tooltipPos.x + 'px', top: (tooltipPos.y - 8) + 'px', transform: 'translate(-50%, -100%)' }"
        >
          <div class="bg-gray-900 text-white rounded-xl shadow-xl p-3 w-52 space-y-1.5">
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kegiatan lainnya</div>
            <div
              v-for="ev in hoveredMoreEvents"
              :key="ev.id"
              class="flex items-center gap-2 text-xs"
            >
              <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: ev.color }"></span>
              <span class="truncate text-gray-200">{{ ev.petugas }}</span>
              <span class="text-gray-500 text-[10px] flex-shrink-0">{{ ev.waktu.split(' - ')[0] }}</span>
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedEvent" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" @click.self="selectedEvent = null">
          <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div class="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">Detail Kegiatan</h3>
              <button @click="selectedEvent = null" class="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <XMarkIcon class="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-500">Kegiatan</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedEvent.nama_kegiatan }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-500">Petugas</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedEvent.petugas }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-500">Lokasi</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedEvent.lokasi || '-' }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-500">Tanggal</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedEvent.date }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-500">Waktu</span>
                <span class="text-sm font-bold text-gray-900">{{ selectedEvent.waktu }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-500">Status</span>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="statusBadgeClass(selectedEvent.status)">
                  {{ selectedEvent.status || 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import AppLayout from '@/Layouts/AppLayout.vue';

const { t } = useI18n();
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  kegiatan: Array,
  hariTerjadwal: Number,
  filters: Object,
});

const today = new Date();
const currentMonth = ref(Number(props.filters?.month) || today.getMonth() + 1);
const currentYear = ref(Number(props.filters?.year) || today.getFullYear());
const currentWeekStart = ref(getWeekStart(today));
const currentView = ref('month');
const searchQuery = ref('');
const selectedEvent = ref(null);
const hoveredEvent = ref(null);
const hoveredMoreEvents = ref(null);
const tooltipPos = ref({ x: 0, y: 0 });

function onEventMouseEnter(event, e) {
  hoveredMoreEvents.value = null;
  hoveredEvent.value = event;
  const rect = e.currentTarget.getBoundingClientRect();
  tooltipPos.value = { x: rect.left + rect.width / 2, y: rect.top };
}
function onMoreMouseEnter(events, e) {
  hoveredEvent.value = null;
  hoveredMoreEvents.value = events;
  const rect = e.currentTarget.getBoundingClientRect();
  tooltipPos.value = { x: rect.left + rect.width / 2, y: rect.top };
}
function onEventMouseLeave() {
  hoveredEvent.value = null;
  hoveredMoreEvents.value = null;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateShort(d) {
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const headerLabel = computed(() => {
  if (currentView.value === 'week') {
    const end = new Date(currentWeekStart.value);
    end.setDate(end.getDate() + 6);
    return `${formatDateShort(currentWeekStart.value)} - ${formatDateShort(end)}`;
  }
  return `${months[currentMonth.value - 1]} ${currentYear.value}`;
});

const locationColors = {
  'Kemlu': '#8b5cf6', 'Kemlu Jakarta': '#8b5cf6',
  'Jakarta': '#3b82f6', 'Bodetabek': '#f59e0b', 'Luar Kota': '#10b981',
};

function getColor(k) {
  if (k.warna_lokasi) return k.warna_lokasi;
  if (k.lokasi && locationColors[k.lokasi]) return locationColors[k.lokasi];
  return '#6366f1';
}

const filteredKegiatan = computed(() => {
  if (!searchQuery.value) return props.kegiatan || [];
  const q = searchQuery.value.toLowerCase();
  return (props.kegiatan || []).filter(k =>
    (k.nama_kegiatan || '').toLowerCase().includes(q) ||
    (Array.isArray(k.teknisi) && k.teknisi.some(t => t.name.toLowerCase().includes(q)))
  );
});

function getEventsForDate(date) {
  const events = [];
  filteredKegiatan.value.forEach(k => {
    const [sy, sm, sd] = k.tgl_dari.split('-').map(Number);
    const [ey, em, ed] = k.tgl_sampai.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    if (date >= start && date <= end) {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const petugasList = Array.isArray(k.teknisi) ? k.teknisi.map(t => t.name) : [];
      petugasList.forEach(p => {
        events.push({
          id: `${k.id}-${p}-${dateStr}`, petugas: p, nama_kegiatan: k.nama_kegiatan,
          lokasi: k.lokasi, color: getColor(k), date: dateStr,
          waktu: `${k.waktu_mulai || ''} - ${k.waktu_selesai || ''}`, status: k.status,
        });
      });
    }
  });
  return events;
}

// Month cells
const monthCells = computed(() => {
  const cells = [];
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0);
  const startOffset = firstDay.getDay();

  const prevLast = new Date(currentYear.value, currentMonth.value - 1, 0);
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevLast.getDate() - i;
    cells.push({ day: d, isCurrentMonth: false, isToday: false, events: [] });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value - 1, d);
    const isToday = date.toDateString() === today.toDateString();
    cells.push({ day: d, isCurrentMonth: true, isToday, events: getEventsForDate(date) });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, isToday: false, events: [] });
  }
  return cells;
});

// Week cells
const weekCells = computed(() => {
  const cells = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + i);
    const isToday = date.toDateString() === today.toDateString();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    cells.push({
      day: date.getDate(),
      dayName: dayNamesFull[date.getDay()],
      dateStr,
      isToday,
      events: getEventsForDate(date),
    });
  }
  return cells;
});

// Navigation
function prev() {
  if (currentView.value === 'month') {
    if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value--; }
    else { currentMonth.value--; }
  } else {
    currentWeekStart.value.setDate(currentWeekStart.value.getDate() - 7);
    currentWeekStart.value = new Date(currentWeekStart.value);
  }
  loadKegiatan();
}

function next() {
  if (currentView.value === 'month') {
    if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++; }
    else { currentMonth.value++; }
  } else {
    currentWeekStart.value.setDate(currentWeekStart.value.getDate() + 7);
    currentWeekStart.value = new Date(currentWeekStart.value);
  }
  loadKegiatan();
}

function goToToday() {
  const now = new Date();
  currentMonth.value = now.getMonth() + 1;
  currentYear.value = now.getFullYear();
  currentWeekStart.value = getWeekStart(now);
  loadKegiatan();
}

function loadKegiatan() {
  router.get('/admin/kalender-dinas', {
    month: currentMonth.value,
    year: currentYear.value,
    search: searchQuery.value,
  }, { preserveScroll: true, preserveState: true });
}

function showEventDetail(event) { selectedEvent.value = event; }

function exportExcel() {
  const params = new URLSearchParams({ month: currentMonth.value, year: currentYear.value }).toString();
  window.open(`/admin/kegiatan-export?${params}`, '_blank');
}

function statusBadgeClass(status) {
  const map = {
    Done: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Mandiri: 'bg-cyan-100 text-cyan-700',
    Batal: 'bg-rose-100 text-rose-700',
  };
  return map[status] || 'bg-amber-100 text-amber-700';
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.tooltip-enter-active, .tooltip-leave-active { transition: opacity 0.15s, transform 0.15s; }
.tooltip-enter-from, .tooltip-leave-to { opacity: 0; transform: translate(-50%, calc(-100% + 4px)); }
</style>
