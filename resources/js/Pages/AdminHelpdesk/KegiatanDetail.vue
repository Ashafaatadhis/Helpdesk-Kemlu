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
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Detail Kegiatan</h1>
              <p class="text-gray-500 text-sm">Informasi lengkap kegiatan</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="goBack" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">
              <ArrowLeftIcon class="w-5 h-5" />
              Kembali
            </button>
            <button @click="goToEdit" class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition shadow-sm">
              <PencilSquareIcon class="w-5 h-5" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <!-- Status Badge -->
        <div class="mb-6">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold" :class="statusBadgeClass(kegiatan.status)">
            <span class="w-2 h-2 rounded-full bg-current"></span>
            {{ kegiatan.status || 'Pending' }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-5">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-1">{{ kegiatan.nama_kegiatan }}</h2>
              <p class="text-gray-500 text-sm" v-if="kegiatan.deskripsi">{{ kegiatan.deskripsi }}</p>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Waktu</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <CalendarDaysIcon class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-700">{{ formatDate(kegiatan.tgl_dari) }} - {{ formatDate(kegiatan.tgl_sampai) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <ClockIcon class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-700">{{ kegiatan.waktu_mulai }} - {{ kegiatan.waktu_selesai }}</span>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <DocumentTextIcon class="w-4 h-4 text-gray-400" />
                  <div>
                    <span class="text-xs text-gray-400">Nota Dinas</span>
                    <p class="text-sm font-semibold text-gray-700">{{ kegiatan.nomor_nodin || '-' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <BuildingOfficeIcon class="w-4 h-4 text-gray-400" />
                  <div>
                    <span class="text-xs text-gray-400">Satuan Kerja</span>
                    <p class="text-sm font-semibold text-gray-700">{{ kegiatan.satker_permohonan || '-' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Square3Stack3DIcon class="w-4 h-4 text-gray-400" />
                  <div>
                    <span class="text-xs text-gray-400">Eselon</span>
                    <p class="text-sm font-semibold text-gray-700">{{ kegiatan.eselon || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-5">
            <div class="border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lokasi & Kontak</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <MapPinIcon class="w-4 h-4 text-rose-500" />
                  <span class="text-sm font-semibold text-gray-700">{{ kegiatan.lokasi || '-' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <PhoneIcon class="w-4 h-4 text-emerald-500" />
                  <span class="text-sm font-semibold text-gray-700">{{ kegiatan.cp_satker || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Petugas</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="petugas in parsePetugas(kegiatan.teknisi)"
                  :key="petugas"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg"
                >
                  <UserCircleIcon class="w-4 h-4" />
                  {{ petugas }}
                </span>
                <span v-if="!kegiatan.teknisi?.length" class="text-sm text-gray-400">-</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4" v-if="kegiatan.peralatan_akun">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Peralatan & Akun</h3>
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ kegiatan.peralatan_akun }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import {
  CalendarDaysIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  Square3Stack3DIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({ kegiatan: Object });

function goBack() { router.visit('/admin/kegiatan'); }
function goToEdit() { router.visit(`/admin/kegiatan/${props.kegiatan.id}/edit`); }

function parsePetugas(teknisi) {
  if (!teknisi) return [];
  if (Array.isArray(teknisi)) return teknisi.map(t => t.name ?? t);
  return String(teknisi).split(',').map(s => s.trim()).filter(Boolean);
}

function formatDate(d) {
  if (!d) return '-';
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
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
