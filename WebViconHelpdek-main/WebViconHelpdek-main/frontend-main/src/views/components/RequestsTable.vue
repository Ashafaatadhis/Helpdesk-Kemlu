<template>
  <div class="activity-container">
    <!-- Header terpisah -->
    <div class="header-section" style="margin-bottom: 16px;">
      <div class="header-content">
        <div class="header-info">
          <h2><i class="fas fa-calendar-check me-3"></i>Daftar Kegiatan</h2>
          <p>Kelola dan pantau semua kegiatan yang terdaftar dalam sistem</p>
        </div>
        <div class="header-actions right-align-actions">
          <div style="display: flex; gap: 16px; align-items: center;">
           
            <div class="search-container" style="height:48px; display:flex; align-items:center;">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                class="search-input"
                type="text"
                placeholder="Cari kegiatan, Nodin, Satker, atau Petugas..."
                style="height:44px; padding-top:0; padding-bottom:0;"
              />
            </div>
            <router-link
              to="/kegiatan-form"
              class="action-button add-button"
            >
              <i class="fas fa-plus"></i>
              Tambah
            </router-link>
            <button 
              class="action-button export-button"
              @click="showExportModal = true"
            >
              <i class="fas fa-file-excel"></i>
              Export Excel
            </button>
        </div>
        </div>
      </div>
    </div>

    <!-- Table terpisah -->
    <div class="table-card">
      <div class="table-header">
        <div class="stats-info">
          <div class="header-left">
            <span class="total-count">
              <i class="fas fa-list-ul me-2"></i>
              Total: {{ filteredActivities.length }} kegiatan
            </span>
            <!-- Month Navigation -->
            <div class="month-navigation">
              <button class="btn-month" @click="previousMonth">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="month-display">
                {{ currentMonthDisplay }}
              </div>
              <button class="btn-month" @click="nextMonth">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="status-filters">
            <button
              class="btn btn-outline-primary btn-sm status-filter-btn"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              Semua
            </button>
            <button
              class="btn btn-outline-success btn-sm status-filter-btn"
              :class="{ active: statusFilter === 'Done' }"
              @click="statusFilter = 'Done'"
            >
              Done ({{ getStatusCount('Done') }})
            </button>
            <button
              class="btn btn-outline-warning btn-sm status-filter-btn"
              :class="{ active: statusFilter === 'Pending' }"
              @click="statusFilter = 'Pending'"
            >
              Pending ({{ getStatusCount('Pending') }})
            </button>
            <button
              class="btn btn-outline-info btn-sm status-filter-btn"
              :class="{ active: statusFilter === 'Mandiri' }"
              @click="statusFilter = 'Mandiri'"
            >
              Mandiri ({{ getStatusCount('Mandiri') }})
            </button>
            <button
              class="btn btn-outline-danger btn-sm status-filter-btn"
              :class="{ active: statusFilter === 'Batal' }"
              @click="statusFilter = 'Batal'"
            >
              Batal ({{ getStatusCount('Batal') }})
            </button>
          </div>
        </div>
      </div>
      <div class="table-container" style="overflow-x: auto; max-height: 60vh;">
        <table class="modern-table">
          <thead class="table-head" style="position: sticky; top: 0; z-index: 2; background: #f7fafc;">
            <tr>
              <th style="width: 20%"><div class="th-content"><i class="fas fa-calendar-alt me-2"></i> Kegiatan</div></th>
              <th style="width: 25%"><div class="th-content"><i class="fas fa-info-circle me-2"></i> Informasi Umum</div></th>
              <th style="width: 25%"><div class="th-content"><i class="fas fa-map-marker-alt me-2"></i> Lokasi & Kontak</div></th>
              <th style="width: 20%"><div class="th-content"><i class="fas fa-users me-2"></i> Pelaksana</div></th>
              <th style="width: 10%"><div class="th-content"><i class="fas fa-cog me-2"></i> Aksi</div></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredActivitiesByStatus.length === 0" class="empty-state">
              <td colspan="5">
                <div class="empty-content">
                  <i class="fas fa-inbox fa-3x mb-3"></i>
                  <h5>Tidak ada data kegiatan</h5>
                  <p>Belum ada kegiatan yang sesuai dengan kriteria pencarian</p>
                </div>
              </td>
            </tr>
            <tr v-for="(activity, index) in filteredActivitiesByStatus" :key="activity.id" class="table-row" @click="viewActivity(activity)">
              <td style="width: 20%" class="kegiatan-cell">
                <div class="activity-info">
                  <div style="font-size: 17px; font-weight: 700; color: #1a56db; margin-bottom: 6px; display: block;">{{ activity.nama_kegiatan }}</div>
                  <div style="font-size: 13.5px; color: #6b7280;"><i class="fas fa-calendar me-1"></i> {{ formatDateRange(activity.tgl_dari, activity.tgl_sampai) }}</div>
                  <div style="font-size: 13.5px; color: #6b7280;"><i class="fas fa-clock me-1"></i> {{ formatTimeRange(activity.waktu_mulai, activity.waktu_selesai) }}</div>
                </div>
              </td>
              <td style="width: 25%" class="info-cell">
                <div class="info-item">
                  <div class="info-label text-muted">Nota Dinas</div>
                  <div class="info-value fw-bold text-primary">{{ activity.nomor_nodin }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label text-muted">Satuan Kerja</div>
                  <div class="info-value fw-bold">{{ activity.eselon || '-' }}</div>
                </div>
              </td>
              <td style="width: 25%" class="location-cell">
                <div class="info-item">
                  <div class="info-label text-muted">Lokasi</div>
                  <div class="info-value fw-bold"><i class="fas fa-map-marker-alt me-1 text-danger"></i> {{ activity.lokasi }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label text-muted">Contact Person</div>
                  <div class="info-value contact-person fw-bold"><i class="fas fa-phone me-1 text-success"></i> {{ activity.cp_satker }}</div>
                </div>
              </td>
              <td style="width: 20%" class="petugas-cell">
                <div class="petugas-list">
                  <div v-for="(petugas, idx) in (Array.isArray(activity.petugas) ? activity.petugas : (typeof activity.petugas === 'string' ? activity.petugas.split(', ') : []))" :key="idx" class="petugas-badge"><i class="fas fa-user-circle me-1"></i> {{ petugas }}</div>
                </div>
              </td>
              <td style="width: 10%" class="action-cell" @click.stop>
                <div class="d-flex flex-column align-items-center gap-2" style="min-width: 140px;">
                  <div class="status-dropdown" style="width: 100%;">
                    <button class="btn btn-sm status-button w-100" :class="getStatusClass(activity.status)" type="button" @click.stop="toggleStatusDropdown(activity.nomor_nodin, $event)" style="padding: 6px 12px; height: 32px;">
                      <span class="d-flex align-items-center gap-2"><i class="fas" :class="getStatusIcon(activity.status)"></i> {{ activity.status || 'Pending' }}</span>
                      <i class="fas fa-chevron-down" :class="{ 'rotate': activeDropdown === activity.nomor_nodin }"></i>
                    </button>
                    <div class="dropdown-container" style="position: absolute; z-index: 1000; width: 100%;">
                      <Transition name="fade">
                        <div v-if="activeDropdown === activity.nomor_nodin" class="status-options-menu">
                          <div v-for="status in statusOptions" :key="status" class="status-option" :class="{ 'active': activity.status === status, [getStatusClass(status).replace('btn-', 'status-')]: true }" @click.stop="updateStatus(activity.id, status, $event)"><i class="fas" :class="getStatusIcon(status)"></i> {{ status }}</div>
                        </div>
                      </Transition>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center gap-3" style="width: 100%; margin-top: 4px;">
                    <button class="btn btn-primary btn-sm action-btn" @click="shareActivity(activity)"><i class="fas fa-share"></i></button>
                    <button class="btn btn-warning btn-sm action-btn" @click="editActivity(activity)"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm action-btn" @click="deleteActivity(activity)"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Overlay untuk menutup dropdown -->
    <div v-if="activeDropdown !== null" class="dropdown-overlay" @click="closeDropdown"></div>

            <teleport to="body">
              <div v-if="showExportModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="exportModalTitle">
                <div class="modal-content export-modal-center">
                  <div class="modal-header" style="width:100%;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div class="modal-icon" aria-hidden>
                        <i class="fas fa-file-excel" style="font-size:20px; color:#16a34a"></i>
                      </div>
                      <div style="text-align:left;">
                        <h4 id="exportModalTitle" class="modal-title">Export Excel</h4>
                        <div class="modal-subtitle">Pilih rentang export yang diinginkan</div>
                      </div>
                    </div>
                    <button class="modal-close-btn" @click="showExportModal = false" aria-label="Tutup dialog">&times;</button>
                  </div>

                  <div class="modal-actions">
                    <button class="btn btn-success" @click="exportPerbulan"><i class="fas fa-calendar-alt me-2"></i>Export Perbulan</button>
                    <button class="btn btn-primary" @click="exportPerminggu"><i class="fas fa-calendar-week me-2"></i>Export Perminggu</button>
                  </div>

                  <div class="export-note" style="margin-top:8px; color:#6b7280; font-size:0.9rem;">
                    File akan diunduh otomatis setelah proses selesai.
                  </div>

                  <div style="width:100%; display:flex; justify-content:center; margin-top:14px;">
                    <button class="btn btn-secondary btn-danger" style="min-width:140px;" @click="showExportModal = false">Batal</button>
                  </div>
                </div>
              </div>
            </teleport>
            
            <teleport to="body">
              <div v-if="showWeekSelect" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="weekSelectTitle">
                <div class="modal-content export-modal-center">
                  <div class="modal-header" style="width:100%;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div class="modal-icon" aria-hidden>
                        <i class="fas fa-calendar-week" style="font-size:20px; color:#2563eb"></i>
                      </div>
                      <div style="text-align:left;">
                        <h4 id="weekSelectTitle" class="modal-title">Pilih Minggu</h4>
                        <div class="modal-subtitle">Pilih minggu yang ingin diexport.</div>
                      </div>
                    </div>
                    <button class="modal-close-btn" @click="showWeekSelect = false" aria-label="Tutup dialog">&times;</button>
                  </div>

                  <div class="week-grid" role="list" aria-label="Pilih minggu">
                        <button
                          v-for="(wk, idx) in weekRanges"
                          :key="idx"
                          role="listitem"
                          type="button"
                          :class="['week-tile', { 'selected': selectedWeek && selectedWeek.startISO === wk.startISO }]"
                          @click="selectWeek(wk)"
                          @keyup.enter="selectWeek(wk)"
                          :title="`${wk.startISO} → ${wk.endISO}`"
                          :style="{ '--tile-accent': TILE_ACCENT }"
                          tabindex="0"
                        >
                          <div class="tile-body">
                            <i class="fas fa-calendar-week tile-icon" aria-hidden></i>
                            <div class="week-label">{{ wk.label }}</div>
                          </div>
                        </button>
                  </div>

                      <div style="width:100%; display:flex; justify-content:center; gap:14px; margin-top:18px;">
                        <button class="btn btn-primary btn-export-week" :disabled="!selectedWeek" @click="exportSelectedWeek" style="min-width:160px;">
                          <i class="fas fa-file-excel me-2"></i>
                          Export Minggu
                        </button>
                        <button class="btn btn-cancel" style="min-width:160px;" @click="cancelWeekSelect">Batal</button>
                      </div>
                </div>
              </div>
            </teleport>

    <!-- Delete Confirmation Modal -->
    <DeletePetugasAlert
      :isOpen="showDeleteModal"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Success Notification Popup -->
    <div v-if="showSuccessPopup" class="success-popup">
      <div class="popup-content">
        <div class="success-icon">
          <i class="fas fa-check"></i>
        </div>
        <h2 class="popup-title">Berhasil</h2>
        <p class="popup-message">Data berhasil dihapus</p>
        <button class="btn-ok" @click="closeSuccessPopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import DeletePetugasAlert from '@/components/DeletePetugasAlert.vue';

// Fungsi untuk export Excel dari backend
const handleExportExcel = async () => {
  try {
    // Send month/year of selected currentDate to backend so export is limited to that month
    const d = new Date(currentDate.value || new Date());
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();

    const url = `http://localhost:3001/export-excel?month=${month}&year=${year}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || 'Gagal export Excel');
    }

    const blob = await response.blob();

    // Try to get filename from Content-Disposition header
    const contentDisp = response.headers.get('Content-Disposition') || '';
    const filenameMatch = contentDisp.match(/filename\*=UTF-8''(.+)$|filename="?([^";]+)"?/i);
    let filename = 'Daftar_Kegiatan.xlsx';
    if (filenameMatch) {
      filename = decodeURIComponent((filenameMatch[1] || filenameMatch[2] || '').replace(/\"/g, '')) || filename;
    } else {
      // fallback to month-year naming
      filename = `Daftar_Kegiatan_${year}-${String(month).padStart(2, '0')}.xlsx`;
    }

    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    alert('Export Excel gagal: ' + (error.message || error));
  }
};

// Export modal & week selection state + handlers
const showExportModal = ref(false);
const showWeekSelect = ref(false);

const exportPerbulan = async () => {
  // Close modal and call existing perbulan export
  showExportModal.value = false;
  await handleExportExcel();
};

const exportPerminggu = () => {
  // Close main modal, open week select
  showExportModal.value = false;
  showWeekSelect.value = true;
};

const handleExportPerminggu = async (startDateISO, endDateISO) => {
  try {
    // Call backend endpoint for weekly export with start/end range (assumes endpoint accepts start & end query params)
    const response = await fetch(`http://localhost:3001/export-excel-week?start=${startDateISO}&end=${endDateISO}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Gagal export Excel per minggu');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Kegiatan_${startDateISO}_to_${endDateISO}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Export Perminggu gagal: ' + err.message);
  } finally {
    showWeekSelect.value = false;
  }
};

// Selection state for week modal
const selectedWeek = ref(null);

const selectWeek = (wk) => {
  selectedWeek.value = wk;
};

// Single accent color for all week tiles (modern unified look)
const TILE_ACCENT = '#2563eb';

const exportSelectedWeek = async () => {
  if (!selectedWeek.value) return;
  // call the existing handler with selected week
  await handleExportPerminggu(selectedWeek.value.startISO, selectedWeek.value.endISO);
  selectedWeek.value = null;
  showWeekSelect.value = false;
};

const cancelWeekSelect = () => {
  selectedWeek.value = null;
  showWeekSelect.value = false;
};

// Compute week ranges (7-day chunks) for the currently selected month
const weekRanges = computed(() => {
  // Use currentDate (selected month) as basis
  const base = new Date(currentDate.value || new Date());
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const ranges = [];

  // Find the Monday on or before the 1st of the month (so weeks spanning previous month are included)
  const firstMonday = new Date(firstDay);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() - 1);
  }

  const padISO = (d) => d.toISOString().slice(0, 10);
  const formatShort = (d) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

  // Generate ranges starting each Monday, ending the Friday (Mon + 4 days).
  // Do NOT cap the Friday to month end — this allows a week to include days from the next month (e.g. minggu ke-5 has 3 days)
  let cur = new Date(firstMonday);
  while (cur <= lastDay) {
    const start = new Date(cur);
    const end = new Date(cur);
    end.setDate(end.getDate() + 4); // Friday (may be in next month)

    ranges.push({
      label: `${formatShort(start)} - ${formatShort(end)}`,
      startISO: padISO(start),
      endISO: padISO(end)
    });

    // Move to next Monday
    cur.setDate(cur.getDate() + 7);
  }

  return ranges;
});

// Month navigation state
const currentDate = ref(new Date());
const currentMonthDisplay = computed(() => {
  const options = { month: 'long', year: 'numeric' };
  return currentDate.value.toLocaleDateString('id-ID', options);
});

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};



let prevHtmlOverflow = '';
let prevBodyOverflow = '';

const router = useRouter();
const activities = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');
const activeDropdown = ref(null);
const statusOptions = ['Done', 'Mandiri', 'Pending', 'Batal'];
const showDeleteModal = ref(false);
const activityToDelete = ref(null);
const showSuccessPopup = ref(false);

const getStatusClass = (status) => {
  const classes = {
    'Done': 'status-done',
    'Mandiri': 'status-mandiri',
    'Pending': 'status-pending',
    'Batal': 'status-batal'
  };
  return classes[status] || 'status-pending';
};
const getStatusIcon = (status) => {
  const icons = {
    'Done': 'fa-check-circle',
    'Mandiri': 'fa-user-check',
    'Pending': 'fa-clock',
    'Batal': 'fa-times-circle'
  };
  return icons[status] || 'fa-clock';
};
const toggleStatusDropdown = (activityId, event) => {
  event.preventDefault();
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === activityId ? null : activityId;
};
const closeDropdown = () => {
  activeDropdown.value = null;
};
const updateStatus = async (activityId, newStatus, event) => {
  event.stopPropagation();
  const activityIndex = activities.value.findIndex(
    (activity) => activity.id === activityId
  );
  if (activityIndex !== -1) {
    try {
      // Kirim update ke backend
      const response = await fetch(`http://localhost:3001/kegiatan/${activityId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Gagal update status ke database');
      const result = await response.json();
      activities.value[activityIndex].status = result.data.status;
      activeDropdown.value = null;
    } catch (err) {
      alert('Gagal update status ke database!');
      console.error(err);
    }
  }
};
const getStatusCount = (status) => {
  // Menghitung jumlah status dari aktivitas yang sudah difilter berdasarkan bulan
  return filteredActivities.value.filter((activity) => activity.status === status).length;
};
const loadActivities = async () => {
  try {
    const response = await fetch('http://localhost:3001/laporan');
    if (!response.ok) throw new Error('Gagal mengambil data kegiatan');
    const data = await response.json();
    activities.value = Array.isArray(data) ? data : [];
  } catch (error) {
    activities.value = [];
    console.error(error);
  }
};
const filteredActivities = computed(() => {
  const query = searchQuery.value.toLowerCase();
  // Filter berdasarkan bulan: tampilkan jika tgl_dari ATAU tgl_sampai berada di bulan yang dipilih
  const month = currentDate.value.getMonth();
  const year = currentDate.value.getFullYear();
  const monthFilteredActivities = activities.value.filter((activity) => {
    const dari = new Date(activity.tgl_dari);
    const sampai = new Date(activity.tgl_sampai);
    // True jika salah satu tanggal berada di bulan yang dipilih
    return (
      (dari.getMonth() === month && dari.getFullYear() === year) ||
      (sampai.getMonth() === month && sampai.getFullYear() === year)
    );
  });
  // Sort by id descending (data masuk terbaru ke terlama)
  monthFilteredActivities.sort((a, b) => (b.id || 0) - (a.id || 0));
  // Kemudian filter berdasarkan pencarian
  return monthFilteredActivities.filter((activity) => {
    return activity.nama_kegiatan.toLowerCase().includes(query) ||
           activity.nomor_nodin.toLowerCase().includes(query) ||
           activity.satker_permohonan.toLowerCase().includes(query) ||
           (typeof activity.petugas === 'string' && activity.petugas.toLowerCase().includes(query));
  });
});
const filteredActivitiesByStatus = computed(() => {
  if (statusFilter.value === 'all') return filteredActivities.value;
  return filteredActivities.value.filter(
    (activity) => activity.status === statusFilter.value
  );
});
const formatDateRange = (startDate, endDate) => {
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  if (startDate === endDate) {
    return d1.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  // Jika bulan dan tahun sama, tampilkan 19-21/09/2025
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate().toString().padStart(2, '0')}-${d2.getDate().toString().padStart(2, '0')}/${(d1.getMonth()+1).toString().padStart(2, '0')}/${d1.getFullYear()}`;
  }
  // Jika bulan atau tahun beda, tampilkan 19/09 - 01/10/2025
  return `${d1.getDate().toString().padStart(2, '0')}/${(d1.getMonth()+1).toString().padStart(2, '0')} - ${d2.getDate().toString().padStart(2, '0')}/${(d2.getMonth()+1).toString().padStart(2, '0')}/${d2.getFullYear()}`;
};

const formatTimeRange = (startTime, endTime) => {
  // Function to format time to HH:mm
  const formatTime = (time) => {
    if (!time) return '';
    return time.split(':').slice(0, 2).join(':');  // Take only HH:mm parts
  };
  
  if (!startTime && !endTime) return '-';
  if (!endTime) return formatTime(startTime);
  if (!startTime) return formatTime(endTime);
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};
const viewActivity = (activity) => {
  router.push(`/kegiatan-detail/${activity.id}`);
};
const editActivity = (activity) => {
  // Redirect ke halaman edit dengan id database
  router.push(`/kegiatan-edit/${activity.id}`);
};
const deleteActivity = (activity) => {
  activityToDelete.value = activity;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  activityToDelete.value = null;
};

const closeSuccessPopup = () => {
  showSuccessPopup.value = false;
};

const confirmDelete = async () => {
  if (activityToDelete.value) {
    try {
      const response = await fetch(`http://localhost:3001/kegiatan/${activityToDelete.value.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Gagal menghapus data di database');

      const activityIndex = activities.value.findIndex(
        (item) => item.id === activityToDelete.value.id
      );
      if (activityIndex !== -1) {
        activities.value.splice(activityIndex, 1);
      }
      showSuccessPopup.value = true;
    } catch (error) {
      alert('Gagal menghapus data di database!');
      console.error(error);
    } finally {
      showDeleteModal.value = false;
      activityToDelete.value = null;
    }
  }
};

const shareActivity = (activity) => {
  // Format tanggal
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Memproses array petugas
  const petugasList = Array.isArray(activity.petugas) 
    ? activity.petugas 
    : (typeof activity.petugas === 'string' ? activity.petugas.split(', ') : []);

  // Format petugas
  const formattedPetugas = petugasList.map(petugas => `${petugas}`).join('\n');

  // Membuat format text
  const messageText = `*++ URGENT ++*

${formattedPetugas}
     
Ref nota dinas nomor 
${activity.nomor_nodin} dari ${activity.satker_permohonan} mohon kiranya dapat dibantu kegiatan sbb :

Satker : ${activity.satker_permohonan}
Perihal: Peminjaman peralatan vicon dan dukungan personil
Nama Kegiatan: ${activity.nama_kegiatan}
Tempat : ${activity.lokasi}
Hari/Tgl : ${formatDate(activity.tgl_dari)}${activity.tgl_dari !== activity.tgl_sampai ? ` - ${formatDate(activity.tgl_sampai)}` : ''}
Jam: ${formatTime(activity.waktu_mulai)} - ${formatTime(activity.waktu_selesai)}
PIC: ${activity.cp_satker}

Sekiranya terdapat hal-hal yang perlu dikoordinasikan dapat menghubungi PIC. 
Untuk itu, mohon dapat dipersiapkan dan dilaksanakan dengan baik.

Catatan :
Mohon kepada Personil yang ditunjuk untuk memberikan konfirmasi 

Terima kasih.-`;

  // Encode pesan untuk URL WhatsApp
  const encodedMessage = encodeURIComponent(messageText);
  
  // Buka WhatsApp Web dengan pesan yang sudah diformat
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};

const formatTime = (time) => {
  if (!time) return '';
  // Take only HH:mm parts from the time string
  return time.split(':').slice(0, 2).join(':');
};

// Export Excel per bulan

onMounted(() => {
  loadActivities();
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.status-dropdown')) {
      closeDropdown();
    }
  });
});
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
// Mounted
onMounted(() => {
  loadActivities();

  // close dropdown kalau klik di luar
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.status-dropdown')) {
      closeDropdown();
    }
  });

  // lock scroll
  prevHtmlOverflow = document.documentElement.style.overflow;
  prevBodyOverflow = document.body.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  document.documentElement.style.overflow = prevHtmlOverflow || '';
  document.body.style.overflow = prevBodyOverflow || '';
});
</script>

<style scoped>
/* Month Navigation Styles */
.month-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 4px;
  border-radius: 12px;
  border: 2px solid rgba(102,126,234,0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.month-display {
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
  padding: 8px 16px;
}

.btn-month {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-month:hover {
  background: rgba(102,126,234,0.1);
  color: #4f46e5;
}

.btn-month:active {
  transform: translateY(1px);
}

/* Perkecil button status filter agar proporsional dengan teks */
.status-filter-btn {
  padding: 2px 10px !important;
  font-size: 0.85rem !important;
  height: 28px;
  min-width: unset;
  border-radius: 10px !important;
  line-height: 1.1;
}
/* Button style untuk status filter */
.status-filters {
  display: flex;
  gap: 6px;
}
.status-filter-btn.active,
.status-filter-btn:focus {
  font-weight: bold;
  box-shadow: 0 0 0 2px #667eea33;
}
/* Kotak putih untuk header-section */
.header-section {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 22px 26px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.06);
  margin-bottom: 16px;
}
/* Container utama halaman */
.activity-container {
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

/* Header Card */
.header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.right-align-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.header-info h2 {
  color: #2d3748;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  background-clip: text;
  background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-info p {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

/* Perbaiki agar tombol search dan tambah tidak terlalu ke kanan */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 0.9rem;
}

/* Responsive width agar search tidak terlalu lebar di desktop dan mobile */
.search-input {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102,126,234,0.2);
  border-radius: 15px;
  padding: 10px 15px 10px 38px;
  font-size: 0.85rem;
  color: #2d3748;
  transition: all 0.3s ease;
  width: 220px;
  max-width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #a0aec0;
  font-size: 0.78em;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 12px 25px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Table Card */
.table-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.05);
  flex: unset;
  display: flex;
  flex-direction: column;
  min-height: unset;
  max-height: 70vh;
  overflow: hidden;
  margin-bottom: 0;
}

/* accent moved to top border; .tile-accent element removed per request */
.week-tile {
  border-top: 3px solid transparent; /* will use --tile-accent when hovered/selected */
}
.week-tile:hover,
.week-tile:focus,
.week-tile.selected {
  border-top-color: var(--tile-accent, #2563eb);
}

/* Month Navigation in header */
.month-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(102,126,234,0.2);
}

.month-display {
  min-width: 130px;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  padding: 4px 12px;
}

.btn-month {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-month:hover {
  background: rgba(102,126,234,0.1);
  color: #4f46e5;
}

.btn-month:active {
  transform: translateY(1px);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  flex-shrink: 0;
}
.detail-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-btn {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
  box-shadow: 0 2px 8px rgba(237, 137, 54, 0.3);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}

/* Empty State */
.empty-state td {
  padding: 60px 20px !important;
}

.empty-content {
  text-align: center;
  color: #a0aec0;
}

.empty-content i {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.empty-content h5 {
  color: #718096;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-content p {
  color: #a0aec0;
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
    gap: 15px;
  }

  .search-input {
    width: 100%;
  }

  .stats-info {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .action-container {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .petugas-badge {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .activity-container {
    padding: 0 10px 10px;
  }

  .header-card,
  .table-card {
    border-radius: 15px;
    margin: 0;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .table-head th {
    padding: 15px 8px;
    font-size: 0.8rem;
  }

  .table-row td {
    padding: 12px 8px;
  }

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 6px;
  line-height: 1.4;
  transition: color 0.2s ease;
  cursor: pointer;
  display: block;
}

.activity-title:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.info-value {
  font-size: 0.875rem;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.info-item {
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}  .action-btn {
    width: 28px;
    height: 28px;
  }
}

/* Tambahan agar table-container tidak terlalu tinggi dan space bawah tidak berlebih */
.table-container {
  overflow-x: auto;
  max-height: 60vh;
  min-height: 200px;
  margin-bottom: 0;
}

/* Sticky header table agar tetap di atas saat scroll */
.table-head {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f7fafc;
}

/* --- ROOT LAYOUT --- */
.activity-container {
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

/* --- HEADER CARD --- */
.header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}
.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.right-align-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.header-info h2 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 8px;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.header-info p { color:#718096; font-size:1rem; margin:0; }
.header-actions { display:flex; align-items:center; gap:20px; }

/* --- SEARCH & BUTTON --- */
.search-container { position:relative; }
.search-icon {
  position:absolute; left:15px; top:50%;
  transform:translateY(-50%);
  color:#a0aec0; font-size:.9rem;
}
.search-input {
  background:rgba(255,255,255,0.9);
  border:2px solid rgba(102,126,234,0.2);
  border-radius:15px;
  padding:12px 15px 12px 45px;
  font-size:.95rem;
  color:#2d3748;
  transition:all .3s ease;
  width:350px;
}
.search-input:focus {
  outline:none; border-color:#667eea; background:#fff;
  box-shadow:0 0 0 4px rgba(102,126,234,.1);
}
.btn-add {
  background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color:#fff; border:none; border-radius:15px;
  padding:12px 25px; font-weight:600; font-size:.95rem;
  cursor:pointer; transition:all .3s ease;
  display:flex; align-items:center; gap:8px;
}
.btn-add:hover {
  transform:translateY(-2px);
  box-shadow:0 12px 35px rgba(102,126,234,.4);
  background:linear-gradient(135deg,#764ba2 0%,#667eea 100%);
}

/* --- TABLE CARD --- */
.table-card {
  background:rgba(255,255,255,0.95);
  backdrop-filter:blur(20px);
  border-radius:20px;
  box-shadow:0 20px 40px rgba(0,0,0,.1);
  border:1px solid rgba(255,255,255,.2);
  flex:unset;
  display:flex;
  flex-direction:column;
  min-height:unset;
  max-height:70vh;
  overflow:hidden;
  margin-bottom:0;
}
.table-header {
  padding:20px 30px;
  border-bottom:1px solid rgba(0,0,0,.05);
  background:rgba(102,126,234,.03);
  flex-shrink:0;
}
.stats-info { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; }
.total-count { font-weight:600; color:#4a5568; font-size:1rem; }

/* --- ACTIONS --- */
.action-cell,
.dropdown-container {
  position: relative;
  overflow: visible !important;
  z-index: 1;
}
.action-btn {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  max-width: 32px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  flex-shrink: 0;
}
.detail-btn {
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff;
}
.edit-btn {
  background:linear-gradient(135deg,#ed8936,#dd6b20);
  color:#fff;
}
.delete-btn {
  background:linear-gradient(135deg,#e53e3e,#c53030);
  color:#fff;
}
.action-btn:hover { transform:translateY(-1px); }

/* --- STATUS DROPDOWN --- */
.status-dropdown { width:100%; }
.status-button {
  display:flex; align-items:center; justify-content:space-between;
  gap:6px; width:100%;
  padding:8px 12px;
  border:none; outline:none;
  border-radius:8px;
  font-size:.8rem; font-weight:600;
  color:#fff; cursor:pointer;
  transition: all 0.3s ease;
}

.status-button.status-done {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.status-button.status-mandiri {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.status-button.status-pending {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
}

.status-button.status-batal {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.status-button i { font-size:.75rem; margin-left:auto; }

/* menu mengambang */
.status-options-menu {
  position:absolute; top:0; right:100%; margin-right:6px;
  min-width:140px;
  background:#fff;
  border:1px solid rgba(0,0,0,.1);
  border-radius:10px;
  box-shadow:0 8px 20px rgba(0,0,0,.15);
  z-index:10000;
  overflow:hidden;
}
.status-option {
  display:flex; align-items:center; gap:6px;
  padding:8px 12px;
  font-size:.8rem; cursor:pointer;
  color:#4a5568;
  transition:background .15s ease, color .15s ease;
}

/* Done status */
.status-option.status-done {
  color: #22c55e;
}
.status-option.status-done:hover {
  background: rgba(34, 197, 94, 0.1);
}
.status-option.status-done.active {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  font-weight: 600;
}

/* Mandiri status */
.status-option.status-mandiri {
  color: #f59e0b;
}
.status-option.status-mandiri:hover {
  background: rgba(245, 158, 11, 0.1);
}
.status-option.status-mandiri.active {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  font-weight: 600;
}

/* Pending status */
.status-option.status-pending {
  color: #6366f1;
}
.status-option.status-pending:hover {
  background: rgba(99, 102, 241, 0.1);
}
.status-option.status-pending.active {
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
  font-weight: 600;
}

/* Batal status */
.status-option.status-batal {
  color: #ef4444;
}
.status-option.status-batal:hover {
  background: rgba(239, 68, 68, 0.1);
}
.status-option.status-batal.active {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  font-weight: 600;
}
.status-success { color:#48bb78; } /* done */
.status-warning { color:#ed8936; } /* pending */
.status-mandiri{ color:#eeff00; } /* mandiri */
.status-danger { color:#e53e3e; } /* batal */

/* --- EMPTY STATE --- */
.empty-state td { padding:60px 20px !important; }
.empty-content { text-align:center; color:#a0aec0; }
.empty-content h5 { color:#718096; font-size:1.1rem; font-weight:600; margin-bottom:8px; }
.empty-content p { color:#a0aec0; font-size:.9rem; margin:0; }

/* --- FADE TRANSITION (untuk <Transition name="fade">) --- */
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease, transform .15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity:0; transform:translateY(-6px);
}
.fade-enter-to, .fade-leave-from {
  opacity:1; transform:translateY(0);
}

/* --- RESPONSIVE --- */
@media(max-width:768px){
  .header-content{ flex-direction:column; align-items:stretch; }
  .header-actions{ flex-direction:column; gap:15px; }
  .search-input{ width:100%; }
  .stats-info{ flex-direction:column; align-items:stretch; gap:10px; }
  .status-options-menu{ min-width:130px; }
  .status-option{ font-size:.75rem; padding:8px 10px; }
}
@media(max-width:480px){
  .activity-container{ padding:0 10px 10px; }
  .header-card,.table-card{ border-radius:15px; margin:0; }
  .search-input{ font-size:16px; }
  .table-head th{ padding:15px 8px; font-size:.8rem; }
  .table-row td{ padding:12px 8px; }
  .action-btn{ width:28px; height:28px; }
}

/* Gabungan dan perapihan CSS, alignment sejajar, hapus duplikat */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.table-head th {
  padding: 18px 12px;
  background: #f7fafc;
  font-weight: 700;
  font-size: 1rem;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
}
.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
.table-row td {
  padding: 18px 12px;
  vertical-align: top;
  border-bottom: 1px solid #e2e8f0;
}
.activity-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item, .petugas-list, .action-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.petugas-list {
  gap: 6px;
}
.petugas-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 0.95rem;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102,126,234,0.15);
  transition: transform 0.2s;
}
.petugas-badge:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(102,126,234,0.25);
}

/* Action Buttons Styling */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 160px;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%) rotate(45deg);
  transition: transform 0.6s;
}

.action-button:hover::before {
  transform: translateX(100%) rotate(45deg);
}

.action-button i {
  margin-right: 8px;
  font-size: 1rem;
}

/* Add Button Style */
.add-button {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.add-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}

/* Export Button Style */
.export-button {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.export-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.export-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(34, 197, 94, 0.3);
}

/* Modal Styles - compact centered box */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px; /* keep some breathing room on small screens */
}

.modal-content {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(2, 6, 23, 0.08);
  text-align: center;
  width: 100%;
  max-width: 560px;     /* a bit wider for modern feel */
  max-height: 76vh;     /* cap height so it won't be too tall */
  overflow-y: auto;     /* scroll internally when content is long */
  -webkit-overflow-scrolling: touch;
}

.export-modal-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 6px 0 4px;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 6px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.modal-actions .btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  min-width: 140px;
}

.modal-actions .btn-secondary {
  background: #eef2ff;
  color: #3730a3;
}

.modal-actions .btn-danger {
  background: #ef4444;
  color: white;
}

.modal-actions .btn:hover {
  opacity: 0.95;
}

/* Modal header and controls */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
}
.modal-close-btn:hover { background: rgba(0,0,0,0.04); color: #111827; }
.modal-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(37,99,235,0.12), rgba(99,102,241,0.08));
  border-radius: 12px;
}
.export-note { max-width: 460px; text-align: center; }

/* Week selection grid and tile styling (modern) */
.week-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 480px; /* smaller overall grid */
  margin-top: 8px;
  align-items: stretch;
}

.week-tile {
  /* unified soft blue theme */
  background: linear-gradient(180deg, rgba(37,99,235,0.06) 0%, #ffffff 100%);
  border: 1px solid rgba(37,99,235,0.12);
  border-top: 3px solid transparent; /* accent shown via CSS variable on hover/selected */
  border-radius: 12px;
  padding: 12px 14px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.14s cubic-bezier(.2,.9,.3,1), box-shadow 0.14s ease, border-color 0.14s ease;
  min-height: 62px;
  position: relative;
  overflow: visible;
}

.week-tile:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 18px 40px rgba(37,99,235,0.12);
  border-color: rgba(37,99,235,0.18);
  border-top-color: var(--tile-accent, #2563eb);
}

.week-label {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.96rem;
  letter-spacing: 0.2px;
}
/* week-sub removed per request (subtitle date removed from tile) */

/* tile accent element removed (using top border accent instead) */

/* selected variant — stronger blue */
.week-tile.selected {
  background: linear-gradient(180deg, rgba(37,99,235,0.12) 0%, #f3f8ff 100%);
  box-shadow: 0 22px 48px rgba(37,99,235,0.16);
  border-color: #2b6be6;
  transform: translateY(-2px) scale(1.01);
  border-top-color: var(--tile-accent, #2563eb);
}

/* tile body layout */
.tile-body {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tile-icon {
  font-size: 18px;
  color: var(--tile-accent, #2563eb);
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(37,99,235,0.08);
  border-radius: 6px;
  padding: 4px;
}

/* animated top-border handled via :hover / .selected rules */

/* keyboard focus */
.week-tile:focus-visible {
  outline: 3px solid rgba(37,99,235,0.12);
  outline-offset: 4px;
}

/* Export / Cancel button polish */
.btn-export-week {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 800;
  letter-spacing: 0.4px;
  box-shadow: 0 10px 30px rgba(6, 95, 70, 0.12);
}
.btn-cancel {
  background: transparent;
  border: 1px solid rgba(15,23,42,0.08);
  color: #374151;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
}


/* Selected style */
.week-tile.selected {
  background: linear-gradient(180deg, #e9f0ff 0%, #eef6ff 100%);
  box-shadow: 0 12px 30px rgba(37,99,235,0.10);
  border-color: #2b6be6;
  border-top-color: var(--tile-accent, #2563eb);
}

/* Larger centered single tile style for uneven last row */
.week-grid > .week-tile:nth-last-child(1):nth-child(odd) {
  grid-column: 1 / -1; /* span both columns */
  justify-self: center;
  max-width: 360px;
}

.btn-export-week {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(6, 95, 70, 0.12);
  cursor: pointer;
}
.btn-export-week:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

/* Success Popup Styles */
.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #e6f9f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-icon i {
  color: #10b981;
  font-size: 30px;
}

.popup-title {
  color: #111827;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.popup-message {
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 24px;
}

.btn-ok {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ok:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-ok:active {
  transform: translateY(0);
}
</style>