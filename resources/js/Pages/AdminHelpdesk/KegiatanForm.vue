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
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ isEdit ? t('adminHelpdesk.kegiatan.update') : t('adminHelpdesk.kegiatan.formTitle') }}</h1>
              <p class="text-gray-500 text-sm">{{ t('adminHelpdesk.kegiatan.formDescription') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="goBack" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">
              <ArrowLeftIcon class="w-5 h-5" />
              {{ t('adminHelpdesk.kegiatan.back') }}
            </button>
            <button @click="handleSubmit" :disabled="submitting || !isFormValid()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <CheckCircleIcon class="w-5 h-5" />
              {{ submitting ? t('common.saving') : t('adminHelpdesk.kegiatan.submit') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <!-- Waktu -->
        <div class="border border-indigo-50 rounded-2xl p-5 mb-5 bg-gradient-to-b from-white to-indigo-50/30">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ClockIcon class="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Waktu Kegiatan</h4>
              <p class="text-gray-500 text-xs">Atur tanggal dan waktu pelaksanaan</p>
            </div>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Dari Tanggal</label>
              <input type="date" v-model="form.tgl_dari" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Sampai Tanggal</label>
              <input type="date" v-model="form.tgl_sampai" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Waktu Mulai</label>
              <input type="time" v-model="form.waktu_mulai" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Waktu Selesai</label>
              <input type="time" v-model="form.waktu_selesai" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        <!-- Informasi -->
        <div class="border border-blue-50 rounded-2xl p-5 mb-5 bg-gradient-to-b from-white to-blue-50/30">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <DocumentTextIcon class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Informasi Kegiatan</h4>
              <p class="text-gray-500 text-xs">Isi informasi utama kegiatan</p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Kegiatan</label>
              <input type="text" v-model="form.nama_kegiatan" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Masukkan nama kegiatan" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Nodin</label>
              <input type="text" v-model="form.nomor_nodin" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Masukkan nomor nodin" />
            </div>
          </div>
        </div>

        <!-- Unit & Lokasi -->
        <div class="border border-emerald-50 rounded-2xl p-5 mb-5 bg-gradient-to-b from-white to-emerald-50/30">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <MapPinIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Unit dan Lokasi</h4>
              <p class="text-gray-500 text-xs">Atur satuan kerja dan lokasi kegiatan</p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Satuan Kerja</label>
              <select v-model="form.satker_permohonan" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                <option value="">Pilih Satker</option>
                <option v-for="item in satuanKerjaList" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Eselon</label>
              <select v-model="form.eselon" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                <option value="">Pilih Eselon</option>
                <option v-for="item in eselonList" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Lokasi</label>
              <input type="text" v-model="form.lokasi" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Masukkan lokasi" />
              <div class="flex gap-2 mt-2">
                <button
                  v-for="type in locationTypes"
                  :key="type.id"
                  type="button"
                  @click="form.warna_lokasi = type.color"
                  class="w-5 h-5 rounded-full border-2 transition-all"
                  :class="form.warna_lokasi === type.color ? 'border-gray-800 scale-125 shadow' : 'border-gray-200'"
                  :style="{ background: type.gradient }"
                  :title="type.id"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Kontak & Petugas -->
        <div class="border border-amber-50 rounded-2xl p-5 mb-5 bg-gradient-to-b from-white to-amber-50/30">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <UserGroupIcon class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Kontak dan Petugas</h4>
              <p class="text-gray-500 text-xs">Masukkan CP dan petugas pelaksana</p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">CP Satker</label>
              <input type="text" v-model="form.cp_satker" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Nama - 08123456789" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Petugas</label>
              <VueMultiselect
                v-model="selectedTeknisi"
                :options="teknisiList"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Pilih petugas..."
                label="name"
                track-by="nip"
                :show-labels="false"
                :searchable="true"
              />
            </div>
          </div>
        </div>

        <!-- Peralatan & Deskripsi -->
        <div class="border border-rose-50 rounded-2xl p-5 mb-5 bg-gradient-to-b from-white to-rose-50/30">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <ComputerDesktopIcon class="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Peralatan dan Deskripsi</h4>
              <p class="text-gray-500 text-xs">Lengkapi kebutuhan kegiatan</p>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Peralatan dan Akun</label>
              <textarea v-model="form.peralatan_akun" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y min-h-[80px]" placeholder="Masukkan peralatan dan akun yang dibutuhkan"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi Kegiatan</label>
              <textarea v-model="form.deskripsi" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y min-h-[80px]" placeholder="Masukkan deskripsi kegiatan"></textarea>
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="flex items-center justify-between pt-2">
          <button @click="isEdit ? goBack() : resetForm()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">
            <ArrowPathIcon class="w-5 h-5" />
            {{ isEdit ? 'Batal' : 'Reset' }}
          </button>
          <button @click="handleSubmit" :disabled="submitting || !isFormValid()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <CheckCircleIcon class="w-5 h-5" />
            {{ submitting ? 'Menyimpan...' : (isEdit ? 'Update Kegiatan' : 'Simpan Kegiatan') }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import AppLayout from '@/Layouts/AppLayout.vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const { t } = useI18n();
import {
  CalendarDaysIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  kegiatan: { type: Object, default: null },
  satuanKerjaList: { type: Array, default: () => [] },
  teknisiList: { type: Array, default: () => [] },
});

const isEdit = ref(!!props.kegiatan);
const submitting = ref(false);
const eselonList = ['Eselon I', 'Eselon II', 'Eselon III'];

const locationTypes = [
  { id: 'Kemlu', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 'Jakarta', color: '#3b82f6', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'Bodetabek', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 'Luar Kota', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
];

const form = reactive({
  nama_kegiatan: '', deskripsi: '', tgl_dari: '', tgl_sampai: '',
  waktu_mulai: '', waktu_selesai: '', nomor_nodin: '', satker_permohonan: '',
  eselon: '', lokasi: '', warna_lokasi: '', cp_satker: '',
  teknisi_nips: [], peralatan_akun: '', status: 'Pending',
});

onMounted(() => {
  if (props.kegiatan) {
    const { teknisi, ...rest } = props.kegiatan;
    Object.keys(form).forEach(key => {
      if (rest[key] !== undefined && rest[key] !== null) {
        form[key] = rest[key];
      }
    });
    form.teknisi_nips = Array.isArray(teknisi) ? teknisi.map(t => t.nip) : [];
  }
});

const selectedTeknisi = computed({
  get: () => props.teknisiList.filter(t => form.teknisi_nips.includes(t.nip)),
  set: (val) => { form.teknisi_nips = val.map(t => t.nip); },
});

function isFormValid() {
  return form.nama_kegiatan && form.tgl_dari && form.tgl_sampai;
}

function resetForm() {
  Object.keys(form).forEach(key => { form[key] = Array.isArray(form[key]) ? [] : ''; });
  form.status = 'Pending';
}

function goBack() { router.visit('/admin/kegiatan'); }

async function handleSubmit() {
  if (!isFormValid() || submitting.value) return;
  submitting.value = true;
  try {
    const url = isEdit.value ? `/admin/kegiatan/${props.kegiatan.id}` : '/admin/kegiatan';
    const method = isEdit.value ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { router.visit('/admin/kegiatan'); }
    else { alert('Gagal menyimpan: ' + (data.message || 'Terjadi kesalahan')); }
  } catch (e) {
    alert('Terjadi kesalahan saat menyimpan data.');
  } finally { submitting.value = false; }
}
</script>
