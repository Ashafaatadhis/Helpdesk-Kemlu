<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
	
			<!-- Header putih sederhana -->
			<div class="header-section">
				<div class="header-flex">
					<div>
						<h1 class="header-title"><i class="fas fa-calendar-alt" style="margin-right:10px;"></i>Jadwal Petugas</h1>
						<p class="header-subtext">Kelola dan pantau jadwal dinas dengan mudah</p>
						<div class="quick-stats">
							<div class="stat-card active">
								<div class="stat-icon">
									<i class="fas fa-calendar-check"></i>
										<div
											v-for="item in calendarEvents"
											:key="item.id"
											class="calendar-event"
											:style="{ color: (item.warna_lokasi === '#00ffff' || item.color === '#00ffff') ? 'black' : '#fff', backgroundColor: item.warna_lokasi ? item.warna_lokasi : (item.color || '#6c4cf1') }"
										>
											{{ item.nama }}
										</div>
								</div>
								<div class="stat-info">
									<div class="stat-number">{{ monthlyEvents }}</div>
									<div class="stat-label">Hari Terjadwal {{ monthName }} {{ year }}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="header-actions" style="display: flex; flex-direction: row; gap: 12px; align-items: center;">
						<div class="search-container" style="flex:1; max-width:220px;">
							<i class="fas fa-search search-icon"></i>
							<input
								v-model="searchQuery"
								class="search-input"
								type="text"
								placeholder="Ketik nama petugas..."
								@input="onSearch"
							/>
						</div>
						<button class="export-excel-btn" @click="exportExcel" style="white-space:nowrap;">
							<i class="fas fa-file-excel"></i> Export Excel
						</button>
					</div>
				</div>
			</div>

		<!-- Kalender dengan efek modern -->
		<div class="calendar-card">
			<FullCalendar :key="calendarKey" :options="calendarOptions" class="calendar-modern fc-custom" />
		</div>
	
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Mapping warna lokasi dengan gradient yang lebih modern
const lokasiColors = {
	Kemlu: '#00ffff',
	Jakarta: '#00b050',
	Bodetabek: '#ffff00',
	'Luar Kota': '#ff0000',
	'BOGOR': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
	'DIP': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
	'Bandung': 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
	'PSJ UI': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
	'DPK': 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
	'MKAA Bandung': 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
	'eL Hotel Bandung': 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
	'BRIN BOGOR': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
	'HTL GRAND HYATT': 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
	'Htl Ashley': 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
	'SANTIKA-BOGOR': 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
	'UI': 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
}

// Data event diisi dari backend
import { onMounted, getCurrentInstance } from 'vue'
const allEvents = ref([])
const calendarKey = ref(Date.now())

// Function to export Excel
async function exportExcel() {
    try {
        const currentDate = currentViewDate.value;
        const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const year = currentDate.getFullYear();
        
        // Make request to backend
        const response = await fetch(`http://localhost:3001/export/petugas/${year}/${month}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        if (!response.ok) {
            throw new Error('Export failed');
        }

        // Get the blob from response
        const blob = await response.blob();
        
        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Jadwal_Petugas_${monthName.value}_${year}.xlsx`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        // Show success message
        Swal.fire({
            title: 'Berhasil!',
            text: 'File Excel berhasil diexport',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'modern-popup',
                confirmButton: 'modern-confirm-btn'
            }
        });
    } catch (error) {
        console.error('Export error:', error);
        Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat mengexport file Excel',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'modern-popup',
                confirmButton: 'modern-confirm-btn'
            }
        });
    }
}

async function fetchKegiatan() {
    try {
        const res = await fetch(`http://localhost:3001/laporan?_=${Date.now()}`);
        const data = await res.json();
        const events = [];
		data.forEach(item => {
			let petugasArr = [];
			if (Array.isArray(item.petugas)) {
				petugasArr = item.petugas;
			} else if (typeof item.petugas === 'string') {
				petugasArr = item.petugas.split(',').map(s => s.trim()).filter(Boolean);
			}
			petugasArr.forEach(nama => {
				   // Gunakan string tanggal asli dari data, tanpa parsing Date dan tanpa toISOString
				   if (!item.tgl_dari) return;
				   const startDateStr = item.tgl_dari;
				   const endDateStr = item.tgl_sampai || item.tgl_dari;
				   // Loop setiap tanggal dari tgl_dari sampai tgl_sampai (inklusif)
				   let d = new Date(startDateStr);
				   let end = new Date(endDateStr);
				   while (d <= end) {
					   const y = d.getFullYear();
					   const m = (d.getMonth() + 1).toString().padStart(2, '0');
					   const day = d.getDate().toString().padStart(2, '0');
					   const dateStr = `${y}-${m}-${day}`;
					   events.push({
						   title: nama || '-',
						   start: dateStr, // string tanggal persis dari iterasi
						   color: item.warna_lokasi ? item.warna_lokasi : (lokasiColors[item.lokasi] || undefined),
						   extendedProps: {
							   lokasi: item.lokasi || '-',
							   warna_lokasi: item.warna_lokasi || ''
						   }
					   });
					   d.setDate(d.getDate() + 1);
				   }
			});
		});
        allEvents.value = events;
        calendarKey.value = Date.now(); // force re-render calendar
    } catch (e) {
        allEvents.value = [];
        calendarKey.value = Date.now();
    }
}


onMounted(() => {
		fetchKegiatan();
});

// Watch route change agar data selalu fresh
const instance = getCurrentInstance();
if (instance && instance.proxy && instance.proxy.$route) {
	watch(
		() => instance.proxy.$route.fullPath,
		() => {
			fetchKegiatan();
		}
	);
}

// State management
const selectedPetugas = ref('')
const currentViewDate = ref(new Date())
const searchQuery = ref('') // Add searchQuery ref
let searchTimeout = null

const onSearch = () => {
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    searchTimeout = setTimeout(() => {
        // Update calendar view after search
        if (calendarApi.value) {
            calendarApi.value.refetchEvents();
        }
    }, 300); // 300ms debounce delay
}

const calendarApi = ref(null)

// Menambahkan mounted hook untuk calendar API
onMounted(() => {
    const calendarEl = document.querySelector('.calendar-modern');
    if (calendarEl) {
        calendarApi.value = calendarEl._vueWrapper?.ctx?.getApi();
    }
});

// Computed values
const petugasList = computed(() => 
	Array.from(new Set(allEvents.value.map(e => e.title.split(' - ')[0]))).sort()
)

const filteredEvents = computed(() => {
	let filtered = allEvents.value;

	// Filter berdasarkan pencarian
	if (searchQuery.value.trim()) {
		const searchLower = searchQuery.value.toLowerCase().trim();
		filtered = filtered.filter(event => {
			const namaPetugas = event.title.split(' - ')[0].toLowerCase();
			return namaPetugas.includes(searchLower);
		});
	}

	// Filter berdasarkan petugas yang dipilih (jika ada)
	if (selectedPetugas.value) {
		filtered = filtered.filter(e => e.title.startsWith(selectedPetugas.value + ' -'));
	}

	// Filter event agar hanya event yang tgl_dari (start) atau tgl_sampai (end) berada di bulan yang sedang dilihat
	const viewMonth = currentViewDate.value.getMonth();
	const viewYear = currentViewDate.value.getFullYear();
	filtered = filtered.filter(event => {
		const start = new Date(event.start);
		const end = event.end ? new Date(event.end) : start;
		// Event tampil jika ada bagian dari event di bulan ini
		return (
			(start.getMonth() === viewMonth && start.getFullYear() === viewYear) ||
			(end.getMonth() === viewMonth && end.getFullYear() === viewYear) ||
			// Atau event melintasi bulan ini
			(start < new Date(viewYear, viewMonth + 1, 1) && end >= new Date(viewYear, viewMonth, 1))
		);
	});

	return filtered;
})

const monthlyEvents = computed(() => {
	const viewMonth = currentViewDate.value.getMonth();
	const viewYear = currentViewDate.value.getFullYear();
	// Ambil semua event yang tampil di bulan ini (menggunakan filteredEvents yang sudah di-patch logicnya)
	const eventsThisMonth = filteredEvents.value;
	// Hitung tanggal unik di bulan ini yang memiliki event
	const uniqueDates = new Set();
	eventsThisMonth.forEach(event => {
		const start = new Date(event.start);
		const end = event.end ? new Date(event.end) : start;
		// Loop setiap hari dalam rentang event
		let d = new Date(start);
		while (d <= end) {
			if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
				uniqueDates.add(d.toISOString().split('T')[0]);
			}
			d.setDate(d.getDate() + 1);
		}
	});
	return uniqueDates.size;
})

const activePetugasCount = computed(() => {
    const viewMonth = currentViewDate.value.getMonth();
    const viewYear = currentViewDate.value.getFullYear();
    
    // Filter event untuk bulan ini
    const eventsThisMonth = filteredEvents.value.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getMonth() === viewMonth && eventDate.getFullYear() === viewYear;
    });
    
    // Dapatkan nama-nama petugas unik yang terjadwal bulan ini
    const uniquePetugas = new Set(eventsThisMonth.map(e => e.title.split(' - ')[0]));
    
    return uniquePetugas.size; // Jumlah petugas unik
})

const monthName = computed(() => {
  const date = currentViewDate.value;
  return date.toLocaleString('id-ID', { month: 'long' });
});

const year = computed(() => {
  const date = currentViewDate.value;
  return date.getFullYear();
});	

// Reset filter function

// Custom event rendering dengan animasi
function renderEventContent(arg) {
	   const [nama, lokasi] = arg.event.title.split(' - ')
	   const warnaCustom = arg.event.extendedProps?.warna_lokasi;
	   const gradient = warnaCustom && warnaCustom !== '' ? warnaCustom : (lokasiColors[lokasi] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)');
	   // Set text color black for Bodetabek, else white
	   const textColor = (lokasi === 'Bodetabek' || warnaCustom === '#ffff00') ? 'black' : 'white';
	   return {
		   html: `
			   <div class="event-badge" style="
				   background: ${gradient};
				   color: ${textColor};
				font-size: 11px;
				font-weight: 600;
				font-family: 'Inter', 'Segoe UI', sans-serif;
				border-radius: 8px;
				padding: 6px 10px;
				box-shadow: 0 3px 12px rgba(0,0,0,0.15);
				border: 1px solid rgba(255,255,255,0.2);
				backdrop-filter: blur(10px);
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				cursor: pointer;
				position: relative;
				overflow: hidden;
				display: flex;
				align-items: center;
				gap: 4px;
				text-shadow: 0 1px 2px rgba(0,0,0,0.1);
			">
				<span class="event-icon" style="font-size: 10px;">${arg.event.extendedProps.icon || '👤'}</span>
				<span class="event-name" style="
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 120px;
				">${nama}</span>
				<div class="event-shimmer" style="
					position: absolute;
					top: -50%;
					left: -50%;
					width: 200%;
					height: 200%;
					background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
					transform: translateX(-100%);
					transition: transform 0.6s;
				"></div>
			</div>
		`
	}
}

const calendarOptions = computed(() => ({
	plugins: [dayGridPlugin, interactionPlugin],
	initialView: 'dayGridMonth',
	events: filteredEvents.value,
	height: 'auto',
	headerToolbar: {
		left: 'prev,next today',
		center: 'title',
		right: 'dayGridMonth,dayGridWeek'
	},
	buttonText: {
		today: 'Hari Ini',
		month: 'Bulan',
		week: 'Minggu',
		prev: '<',
		next: '>'
	},

	// ✅ semua config taruh di sini, jangan di luar
	locale: 'id',
	eventDisplay: 'block',
	dayMaxEvents: 3, // Batasi tampilan 3 event per hari
	moreLinkContent: function(args) {
		return {
			html: `<div class="more-link">+${args.num} lainnya</div>`
		}
	},
	moreLinkClick: function(args) {
		// Munculkan sebagai popover di cell yang sama
		return 'popover';
	},
	aspectRatio: 1.6,
	eventContent: renderEventContent,

	eventDidMount: function(info) {
		// Add hover effects
		info.el.addEventListener('mouseenter', () => {
			info.el.style.transform = 'translateY(-2px) scale(1.03)'
			info.el.style.zIndex = '10'
			const shimmer = info.el.querySelector('.event-shimmer')
			if (shimmer) shimmer.style.transform = 'translateX(100%)'
		})
		
		info.el.addEventListener('mouseleave', () => {
			info.el.style.transform = 'translateY(0) scale(1)'
			info.el.style.zIndex = '1'
			const shimmer = info.el.querySelector('.event-shimmer')
			if (shimmer) shimmer.style.transform = 'translateX(-100%)'
		})
	},

	eventClick: function(info) {
		info.jsEvent.preventDefault()
		showEventDetail(info.event)
	},

	dateClick: function(info) {
		// Normalize date to YYYY-MM-DD for both event and clicked date
		function toYMD(date) {
		  if (typeof date === 'string') return date.slice(0, 10);
		  if (date instanceof Date) {
		    // Pastikan tanggal yang diklik tidak mengalami pergeseran zona waktu
		    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
		    return localDate.toISOString().slice(0, 10);
		  }
		  return '';
		}
		const clicked = toYMD(info.date);
		const allOnDate = allEvents.value.filter(ev => {
		  const eventDate = toYMD(new Date(ev.start));
		  return eventDate === clicked;
		});
		if (allOnDate.length === 0) {
			showEmptyDateMessage(clicked);
			return;
		}
		showDateEvents(clicked, allOnDate);
	},

	dayCellDidMount: function(info) {
		// Add today highlighting
		const today = new Date().toDateString()
		if (info.date.toDateString() === today) {
			info.el.classList.add('fc-day-today-custom')
		}
	},

	datesSet: function(info) {
		// Update current view date when calendar view changes
		currentViewDate.value = info.view.currentStart
	}
}))


// SweetAlert2 functions
function showEventDetail(event) {
		const nama = event.title || '-';
		// Ambil lokasi dari extendedProps (hasil mapping event), fallback ke "-" jika tidak ada
		const lokasi = (event.extendedProps && event.extendedProps.lokasi) || event.lokasi || '-';
		const date = new Date(event.start);

		Swal.fire({
			html: `
				<div class="event-detail-container">
					<div class="event-detail-header">
						<h2 class="detail-title">${nama}</h2>
						<div class="detail-subtitle">${lokasi}</div>
						<div class="detail-divider"></div>
					<div
						v-for="item in calendarEvents"
						:key="item.id"
						class="calendar-event"
						:style="{ color: (item.lokasi === 'Bodetabek' || item.warna_lokasi === '#ffff00') ? 'black' : '#fff', backgroundColor: item.warna_lokasi ? item.warna_lokasi : (item.color || '#6c4cf1') }"
					>
						
					</div>
								
						</div>
					</div>
					<div class="info-card">
						<div class="info-icon">
							<i class="fas fa-calendar"></i>
						</div>
						<div class="info-content">
							<label>Tanggal</label>
							<span>${date.toLocaleDateString('id-ID', { 
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}</span>
						</div>
					</div>
				</div>
			</div>
		`,
		showCloseButton: true,
		confirmButtonText: 'Tutup',
		customClass: {
			popup: 'modern-popup',
			confirmButton: 'modern-confirm-btn',
			closeButton: 'modern-close-btn'
		}
	})
}

function showDateEvents(dateStr, events) {
  const date = new Date(dateStr);
  const eventsGrouped = [];
  for (let i = 0; i < events.length; i += 2) {
    eventsGrouped.push(events.slice(i, i + 2));
  }

  Swal.fire({
    title: 'Jadwal Petugas',
    html: `
      <div class="date-events-container">
        <div class="date-events-header">
          <div class="date-display">
            <i class="fas fa-calendar-alt"></i>
            <span>${date.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
          <div class="header-divider"></div>
        </div>
        <div class="events-grid">
					${eventsGrouped.map((pair, index) => `
						<div class="events-pair" style="animation-delay: ${index * 0.1}s">
							${pair.map(ev => {
								const nama = ev.title || '-';
								const lokasi = (ev.extendedProps && ev.extendedProps.lokasi) || ev.lokasi || '-';
								// Gunakan warna dari event yang diambil dari database, fallback ke lokasiColors
								const warnaCustom = ev.color || ev.extendedProps?.warna_lokasi;
								const warna = warnaCustom || lokasiColors[lokasi] || '#6c4cf1';
								// Tentukan warna teks agar kontras
								let textColor = 'white';
								if (warna === '#00ffff' || warna === '#ffff00' || warna.toLowerCase() === '#ffffff') {
									textColor = 'black';
								}
								return `
									<div class="event-card" style="background: ${warna}; color: ${textColor};">
										<div class="event-card-icon" style="background: ${textColor === 'black' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}">
											<i class="${ev.extendedProps?.icon?.replace(/[<>]/g, '') || 'fas fa-user'}" style="color: ${textColor}"></i>
										</div>
										<div class="event-card-content">
											<h3>${nama}</h3>
											<div class="event-card-location" style="opacity: ${textColor === 'black' ? '0.7' : '0.9'}">
												<i class="fas fa-map-marker-alt"></i>
												${lokasi}
											</div>
										</div>
									</div>
								`;
							}).join('')}
						</div>
					`).join('')}
        </div>
      </div>
    `,
    showCloseButton: true,
    confirmButtonText: 'Tutup',
    customClass: {
      popup: 'modern-popup',
      confirmButton: 'modern-confirm-btn',
      closeButton: 'modern-close-btn',
      title: 'swal2-title'
    },
    width: '600px'
  });
}


function showEmptyDateMessage(dateStr) {
	Swal.fire({
		title: '📅 Tidak Ada Jadwal',
		text: `Tidak ada petugas yang bertugas pada ${new Date(dateStr).toLocaleDateString('id-ID')}`,
		icon: 'info',
		confirmButtonText: 'OKE',
		customClass: {
			popup: 'swal2-modern-popup',	
			confirmButton: 'swal2-modern-confirm'
		}
	})
}
</script>
	
<style scoped>
.export-excel-btn {
	background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
	color: #fff;
	border: none;
	border-radius: 12px;
	padding: 8px 18px;
	font-size: 1rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	box-shadow: 0 2px 8px rgba(34,197,94,0.08);
	transition: background 0.2s, transform 0.2s;
	margin-bottom: 4px;
	margin-top: 12px;
}
.export-excel-btn:hover {
	background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
	transform: translateY(-2px) scale(1.03);
}
</style>

<style scoped>
/* Header-section putih modern seperti RequestsTable.vue */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
.header-section {
	background: #fff;
	position: relative;
	top: 20px; /* Ini yang menurunkan header */
	border-radius: 16px;
	box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
	padding: 24px 32px;
	margin: 0 24px;
	max-width: calc(100% - 48px);
	width: auto;
}

.header-flex {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 24px;
	margin: 0 auto
}
.header-title {
		font-size: 2rem;
		font-weight: 700;
		color: #7266d8;
		display: flex;
		align-items: center;
		gap: 8px;
}
.header-icon {
		font-size: 2rem;
		color: #7266d8;
}
.header-subtext {
	color: #7b809a;
	font-size: 1.1rem;
	font-weight: 400;
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
	.search-input {
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid rgba(102, 126, 234, 0.2);
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

	/* Search input focus styles */
	.search-container:focus-within .search-icon {
		color: #667eea;
	}

	.search-input:focus {
		outline: none;
		border-color: #667eea;
		background: white;
		box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
		transform: translateY(-1px);
	}

	/* No results state */
	.fc-daygrid-body:empty::after {
		content: 'Tidak ada jadwal yang sesuai dengan pencarian';
		display: block;
		text-align: center;
		padding: 2rem;
		color: #a0aec0;
		font-size: 0.95rem;
		font-weight: 500;
	}
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Container utama dengan proper spacing */
.app-container {
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
	min-height: 100vh;
	padding: 2rem 1rem 4rem 1rem; /* Increased bottom padding */
	margin: 0;
	box-sizing: border-box;
}

@media (min-width: 768px) {
	.app-container {
		padding: 2.5rem 1.5rem 1.5rem 1.5rem;
	}
}

@media (min-width: 1024px) {
	.app-container {
		padding: 3rem 2rem 2rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}
}

/* Glass effect section */
.glass-section {
	position: relative;
	padding-top: 1rem;
	min-height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	margin-top: 0; /* background ungu naik ke atas, glass section tetap di posisinya */
   margin-left: -1rem;
   margin-right: -1rem;
   margin-bottom: 2rem;
	padding: 3rem 1rem;
}

/* .header-section { */
	/* Header-section putih modern seperti RequestsTable.vue */
	  /* background: rgba(255, 255, 255, 0.95);
	  backdrop-filter: blur(20px);
	  border-radius: 20px;
	  padding: 25px 30px;
	  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	  border: 1px solid rgba(255, 255, 255, 0.2);
	  margin-bottom: 16px; */
	/* } */


/* Background Decorations */
.bg-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
}

.floating-shape {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	animation: float 6s ease-in-out infinite;
}

.shape-1 {
width: 100px;
height: 100px;
top: 10%;
right: 10%;
animation-delay: 0s;
}

.shape-2 {
width: 150px;
height: 150px;
top: 12%;
right: 23%;
animation-delay: 2s;
}

.shape-3 {
width: 80px;
height: 80px;
top: 8%;
left: 15%;
animation-delay: 4s;
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-20px); }
}



.header-left {
	flex: 1;
}

.page-title h1 {
	font-size: 2.5rem;
	font-weight: 800;
	color: white;
	margin: 0;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title p {
	font-size: 1.1rem;
	color: rgba(255, 255, 255, 0.8);
	margin: 0.5rem 0 2rem;
}

.header-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

@media (min-width: 768px) {
	.header-content {
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		gap: 2rem;
	}
}

.header-title {
	flex: 1;
	margin-bottom: 0;
}

.title-main {
	font-size: 1.875rem;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 0.5rem 0;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	line-height: 1.2;
}

.title-sub {
	font-size: 1rem;
	color: rgba(0, 0, 0, 0.65);
	margin: 0;
	font-weight: 400;
	line-height: 1.5;
}

.header-controls {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 1.5rem;
}

@media (min-width: 768px) {
	.header-controls {
		flex-direction: row;
		align-items: center;
		gap: 2rem;
	}
}

.filter-controls {
	flex-shrink: 0;
}

.filter-group {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}


.quick-stats {
	display: flex;
	gap: 0.7rem;
	margin-top: 0.7rem;
	justify-content: flex-start;
	flex-direction: row;
	align-items: center;
	flex-wrap: nowrap;
}

.stat-card {
	background: linear-gradient(45deg, #10b981, #34d399);
	border-radius: 16px;
	padding: 0.5rem 1.3rem;
	display: flex;
	align-items: center;
	gap: 0.7rem;
	min-width: 150px;
	width: auto;
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
	position: relative;
	overflow: hidden;
}
.stat-card.total {
	background: linear-gradient(45deg, #3b82f6, #60a5fa);
}

.stat-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.2),
		transparent
	);
	transition: left 0.5s ease;
}

.stat-card:hover {
	transform: translateY(-1px);
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.2),
		rgba(255, 255, 255, 0.15)
	);
	border-color: rgba(255, 255, 255, 0.35);
	box-shadow: 
		0 4px 16px -1px rgba(0, 0, 0, 0.15),
		0 2px 8px rgba(255, 255, 255, 0.1) inset;
}

.stat-card:hover::before {
	left: 100%;
}


.stat-icon {
	font-size: 1.2rem;
	line-height: 1;
	background: rgba(255, 255, 255, 0.18);
	width: 36px;
	height: 36px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stat-icon i {
	color: white;
	opacity: 1;
	transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon i {
	transform: scale(1.1);
}

.stat-info {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
}


.stat-number {
	font-size: 1.1rem;
	font-weight: 700;
	color: white;
	line-height: 1;
}

.stat-label {
	font-size: 0.95rem;
	color: #fff;
	font-weight: 500;
	white-space: nowrap;
}


.stat-card.total {
	background: linear-gradient(45deg, #3b82f6, #60a5fa);
	border-radius: 16px;
	padding: 0.5rem 1.3rem;
	min-width: 150px;
	width: auto;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
	border: none;
}

.stat-card.total .stat-number,
.stat-card.total .stat-label,
.stat-card.total .stat-icon i {
	color: white;
}

.stat-card.total:hover {
	background: linear-gradient(135deg, #2563eb, #1e40af);
	transform: translateY(-2px);
	box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.stat-card.active {
	background: linear-gradient(45deg, #10b981, #34d399);
	border: none;
}

.stat-card.active .stat-number,
.stat-card.active .stat-label,
.stat-card.active .stat-icon i {
	color: white;
}

.stat-card.active:hover {
	background: linear-gradient(135deg, #059669, #047857);
	transform: translateY(-2px);
	box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

/* Filter section dengan animasi */
.filter-select {
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 12px;
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
	background: rgba(0, 0, 0, 0.05);
	color: #1a1a1a;
	outline: none;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	width: 200px;
	font-weight: 500;
	backdrop-filter: blur(10px);
	height: 44px;
	box-sizing: border-box;
}

.filter-select::placeholder {
	color: rgba(0, 0, 0, 0.7);
}

.filter-select:hover {
	background: rgba(0, 0, 0, 0.2);
	border-color: rgba(0, 0, 0, 0.4);
}

.filter-select:focus {
	border-color: rgba(0, 0, 0, 0.4);
	background: rgba(0, 0, 0, 0.2);
	box-shadow: none;
	transform: translateY(-1px);
	outline: none;
}

.filter-select option {
	background: #f1eeee;
	color: #0c0c0c;
	padding: 12px;
	border-radius: 8px;
}


/* Calendar card dengan glass effect */
.calendar-card {
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(25px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 24px;
	padding: 0.5rem;
	margin: 0 auto 1rem auto; /* Increased bottom margin */
	margin: 4rem auto 1rem auto; /* Top margin now works */
	max-width: 95%;
	box-shadow: 
		0 20px 60px rgba(0, 0, 0, 0.08),
		0 8px 24px rgba(0, 0, 0, 0.04);
	animation: fadeUp 1.2s ease-out forwards;
	opacity: 0;
	position: relative;
	overflow: hidden;
}

.calendar-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
		radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
	pointer-events: none;
}

/* FullCalendar modern styling */
.fc-custom {
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
	position: relative;
	z-index: 1;
}

.fc-custom .fc-toolbar {
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
	padding: 2rem 2.5rem;
	margin-bottom: 0;
	position: relative;
}

.fc-custom .fc-toolbar::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
		radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

.fc-custom .fc-toolbar-title {
	font-size: 2rem;
	color: #fff;
	font-weight: 800;
	text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
	position: relative;
	z-index: 1;
}

.fc-custom .fc-button {
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 12px;
	color: #fff;
	font-weight: 600;
	padding: 0.75rem 1.25rem;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	backdrop-filter: blur(10px);
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.fc-custom .fc-button i {
	font-size: 0.9em;
	opacity: 0.9;
	transition: opacity 0.2s ease;
}

.fc-custom .fc-button:hover i {
	opacity: 1;
}

.fc-custom .fc-button:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateY(-1px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.fc-custom .fc-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.fc-custom .fc-button:disabled:hover {
	transform: none;
}

.fc-custom .fc-daygrid {
	background: #fff;
	padding: 1rem;
}

.fc-custom .fc-day {
	transition: all 0.3s ease;
	border: 1px solid rgba(0, 0, 0, 0.04);
}

.fc-custom .fc-day:hover {
	background: rgba(99, 102, 241, 0.03);
}

.fc-custom .fc-day-today-custom {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%) !important;
	position: relative;
}

.fc-custom .fc-day-today-custom::before {
	content: '';
	position: absolute;
	top: 4px;
	left: 4px;
	right: 4px;
	bottom: 4px;
	border: 2px solid #6366f1;
	border-radius: 12px;
	pointer-events: none;
}

.fc-custom .fc-daygrid-day-number {
	font-weight: 600;
	padding: 8px;
	color: #374151;
	transition: color 0.2s ease;
}

.fc-custom .fc-day-today .fc-daygrid-day-number {
	color: #6366f1;
	font-weight: 700;
}

/* Event styling dengan hover effects */
.fc-custom .fc-event {
	border: none;
	margin: 2px;
	border-radius: 10px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fc-custom .fc-event:hover {
	transform: translateY(-2px) scale(1.02);
	z-index: 10;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.fc-custom .fc-more-link {
	background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
	color: #6b7280;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	padding: 4px 8px;
	font-size: 0.75rem;
	font-weight: 600;
	transition: all 0.2s ease;
}

.fc-custom .fc-more-link:hover {
	background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
	transform: translateY(-1px);
}

/* SweetAlert2 Custom Styles */
:global(.modern-popup) {
	border-radius: 24px !important;
	background: #ffffff !important;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08) !important;
	padding: 2rem !important;
	max-width: 600px !important;
}

:global(.modern-confirm-btn) {
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
	color: white !important;
	font-weight: 600 !important;
	padding: 1rem 2rem !important;
	border-radius: 9999px !important;
	border: none !important;
	box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25) !important;
	transition: all 0.3s ease !important;
}

:global(.modern-confirm-btn:hover) {
	transform: translateY(-2px) !important;
	box-shadow: 0 8px 16px rgba(99, 102, 241, 0.35) !important;
}

:global(.modern-close-btn) {
	position: absolute !important;
	top: 1rem !important;
	right: 1rem !important;
	width: 32px !important;
	height: 32px !important;
	border-radius: 50% !important;
	background: #f1f5f9 !important;
	color: #64748b !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	font-size: 1.25rem !important;
	transition: all 0.2s ease !important;
}

:global(.modern-close-btn:hover) {
	background: #e2e8f0 !important;
	color: #475569 !important;
}

/* Event Detail Styles */
:global(.event-detail-container) {
	padding: 1rem;
	max-width: 600px;
	margin: 0 auto;
}

:global(.event-detail-header) {
	text-align: center;
	margin-bottom: 1.5rem;
	padding-bottom: 1rem;
	position: relative;
}

:global(.detail-title) {
	margin: 0;
	font-size: 2.25rem;
	font-weight: 800;
	color: #1a1a1a;
	line-height: 1.2;
	letter-spacing: -0.02em;
}

:global(.detail-subtitle) {
	font-size: 1.1rem;
	color: #6b7280;
	margin-top: 0.5rem;
	font-weight: 500;
}

:global(.detail-divider) {
	height: 2px;
	background: linear-gradient(to right, transparent, #e2e8f0, transparent);
	margin: 1rem auto;
	width: 80%;
}

:global(.detail-location) {
	font-size: 1.1rem;
	color: #6b7280;
	font-weight: 500;
}

:global(.event-detail-grid) {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

:global(.detail-pair) {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
}

:global(.detail-item) {
	background: #f8fafc;
	border-radius: 16px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.3s ease;
}

:global(.detail-item:hover) {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

:global(.detail-icon) {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.25rem;
	flex-shrink: 0;
}

:global(.detail-content) {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

:global(.detail-cards) {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	margin-top: 0.5rem;
}

:global(.info-card) {
	background: #f8fafc;
	border-radius: 16px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.3s ease;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:global(.info-card:hover) {
	transform: translateY(-2px);
	box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.1);
}

:global(.info-icon) {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.25rem;
	flex-shrink: 0;
}

:global(.info-content) {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

:global(.info-content label) {
	font-size: 0.875rem;
	color: #6b7280;
	font-weight: 500;
}

:global(.info-content span) {
	font-size: 1rem;
	color: #1f2937;
	font-weight: 600;
}

:global(.status-badge) {
	display: inline-flex;
	align-items: center;
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	font-weight: 600;
}

:global(.status-badge.completed) {
	background: #dcfce7;
	color: #15803d;
}

:global(.status-badge.upcoming) {
	background: #dbeafe;
	color: #1d4ed8;
}

/* Date Events Styles */
:global(.date-events-container) {
	padding: 0.5rem;
}

:global(.date-events-header) {
	text-align: center;
	margin-bottom: 1rem;
	position: relative;
}

:global(.swal2-title) {
	font-size: 1.75rem !important;
	font-weight: 800 !important;
	color: #1f2937 !important;
	letter-spacing: -0.02em !important;
	line-height: 1.2 !important;
	margin-bottom: 1rem !important;
	padding: 0 !important;
}

:global(.header-divider) {
	height: 2px;
	background: linear-gradient(to right, transparent, #e2e8f0, transparent);
	margin: 0.75rem auto;
	width: 60%;
	opacity: 0.8;
}

:global(.date-display) {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	color: #6b7280;
	font-size: 1.1rem;
	margin-top: 0.75rem;
	font-weight: 500;
}

:global(.date-display i) {
	font-size: 1rem;
	color: #6366f1;
	opacity: 0.9;
}

:global(.events-grid) {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

:global(.events-pair) {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	opacity: 0;
	animation: fadeInUp 0.5s ease-out forwards;
}

:global(.event-card) {
	padding: 1.25rem;
	border-radius: 16px;
	display: flex;
	align-items: center;
	gap: 1rem;
	color: white;
	transition: all 0.3s ease;
}

:global(.event-card:hover) {
	transform: translateY(-2px);
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

:global(.event-card-icon) {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	flex-shrink: 0;
}

:global(.event-card-content) {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

:global(.event-card-content h3) {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
}

:global(.event-card-location) {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.875rem;
	opacity: 0.9;
}

:global(.swal2-modern-close) {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #f1f5f9;
	color: #64748b;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	transition: all 0.2s ease;
}

:global(.swal2-modern-close:hover) {
	background: #e2e8f0;
	color: #475569;
}

@media (max-width: 640px) {
	:global(.detail-pair),
	:global(.events-pair) {
		grid-template-columns: 1fr;
	}
	
	:global(.event-detail-header),
	:global(.date-events-header) {
		margin-bottom: 1rem;
	}
	

	:global(.date-display) {
		font-size: 1rem;
	}

	:global(.header-divider) {
		margin: 0.5rem ;
		width: 80%;
	}

	:global(.date-events-container) {
		padding: 0.25rem;
	}
}

:global(.swal2-modern-confirm) {
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
	color: #fff !important;
	font-weight: 600 !important;
	border-radius: 16px !important;
	padding: 1rem 2rem !important;
	border: none !important;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
	font-size: 0.95rem !important;
}

:global(.swal2-modern-confirm:hover) {
	transform: translateY(-2px) !important;
	box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3) !important;
}

:global(.swal2-modern-cancel) {
	background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
	color: #fff !important;
	font-weight: 600 !important;
	border-radius: 16px !important;
	padding: 1rem 2rem !important;
	border: none !important;
	margin-right: 1rem !important;
	font-size: 0.95rem !important;
}

:global(.swal2-close) {
	color: #6b7280 !important;
	font-size: 2rem !important;
	transition: all 0.2s ease !important;
}

:global(.swal2-close:hover) {
	color: #374151 !important;
	transform: scale(1.1) !important;
}

/* Event detail styles */
:global(.event-detail-title) {
	display: flex !important;
	align-items: center !important;
	gap: 1.5rem !important;
	text-align: left !important;
	margin-bottom: 0.5rem !important;
}

:global(.event-icon-large) {
	font-size: 3rem !important;
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
	width: 90px !important;
	height: 90px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	border-radius: 24px !important;
	box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3) !important;
	flex-shrink: 0 !important;
}

:global(.event-info h2) {
	margin: 0 !important;
	font-size: 1.75rem !important;
	font-weight: 800 !important;
	color: #1f2937 !important;
	line-height: 1.2 !important;
}

:global(.event-info p) {
	margin: 0.5rem 0 0 0 !important;
	color: #6b7280 !important;
	font-size: 1.1rem !important;
	font-weight: 500 !important;
}

:global(.event-detail-content) {
	display: grid !important;
	grid-template-columns: 1fr 1fr !important;
	gap: 1.5rem !important;
	margin-top: 2rem !important;
}

:global(.detail-card) {
	padding: 2rem !important;
	border-radius: 20px !important;
	color: #fff !important;
	text-align: center !important;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
	transition: transform 0.2s ease !important;
}

:global(.detail-card:hover) {
	transform: translateY(-2px) !important;
}

:global(.detail-card h3) {
	margin: 0 0 1rem 0 !important;
	font-size: 1.1rem !important;
	font-weight: 700 !important;
	opacity: 0.9 !important;
}

:global(.detail-card p) {
	margin: 0 !important;
	font-size: 1rem !important;
	font-weight: 600 !important;
}

/* Date events styles */
:global(.date-events-title) {
	display: flex !important;
	align-items: center !important;
	gap: 1.5rem !important;
	text-align: left !important;
	margin-bottom: 0.5rem !important;
}

:global(.calendar-icon-large) {
	font-size: 3rem !important;
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
	width: 90px !important;
	height: 90px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	border-radius: 24px !important;
	box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3) !important;
	flex-shrink: 0 !important;
}

:global(.events-container) {
	display: flex !important;
	flex-direction: column !important;
	gap: 1rem !important;
	margin-top: 1.5rem !important;
	max-height: 400px !important;
	overflow-y: auto !important;
}

:global(.event-list-item) {
	opacity: 0 !important;
	animation: fadeInUp 0.6s ease-out forwards !important;
}

:global(.event-badge-large) {
	display: flex !important;
	align-items: center !important;
	gap: 1rem !important;
	padding: 1.25rem 1.5rem !important;
	border-radius: 16px !important;
	color: #fff !important;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
	transition: all 0.3s ease !important;
	cursor: pointer !important;
}

:global(.event-badge-large:hover) {
	transform: translateY(-2px) scale(1.02) !important;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2) !important;
}

:global(.badge-icon) {
	font-size: 1.75rem !important;
	flex-shrink: 0 !important;
}

:global(.badge-content h4) {
	margin: 0 0 0.25rem 0 !important;
	font-size: 1.1rem !important;
	font-weight: 700 !important;
	color: inherit !important;
}

:global(.badge-content p) {
	margin: 0 !important;
	font-size: 0.9rem !important;
	opacity: 0.9 !important;
	color: inherit !important;
}

/* Animation Keyframes */
@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-40px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(-40px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes fadeUp {
	from {
		opacity: 0;
		transform: translateY(40px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.8;
	}
}

/* Responsive improvements */
@media (max-width: 768px) {
	.title-main {
		font-size: 1.5rem;
	}
	
	.fc-custom .fc-toolbar {
		padding: 1.5rem 1rem;
	}
	
	.fc-custom .fc-toolbar-title {
		font-size: 1.5rem;
	}
	
	.quick-stats {
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
	}
	
	.stat-card {
		width: 120px;
	}
	
	.filter-select {
		width: 100%;
		max-width: none;
	}
	
	:global(.event-detail-content) {
		grid-template-columns: 1fr !important;
	}
	
	:global(.event-detail-title) {
		flex-direction: column !important;
		text-align: center !important;
	}
	
	:global(.date-events-title) {
		flex-direction: column !important;
		text-align: center !important;
	}
}

@media (max-width: 480px) {
	.app-container {
		padding: 1.5rem 0.75rem 0.75rem 0.75rem;
	}
	
	.title-main {
		font-size: 1.25rem;
		flex-direction: column;
		text-align: center;
		gap: 0.5rem;
	}
	
	.fc-custom .fc-button {
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
	}
	
	.stat-number {
		font-size: 1.5rem;
	}
	
	.stat-icon {
		font-size: 1.5rem;
	}
}

/* Loading and transition effects */
.fc-custom .fc-event {
	animation: fadeInUp 0.4s ease-out forwards;
}

.fc-custom .fc-event:nth-child(even) {
	animation-delay: 0.1s;
}

.fc-custom .fc-event:nth-child(odd) {
	animation-delay: 0.2s;
}

/* Style untuk tombol "more" */
.more-link {
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
	color: white !important;
	font-size: 0.75rem;
	font-weight: 600;
	padding: 4px 8px;
	border-radius: 8px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin: 2px 4px;
	box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
	transition: all 0.3s ease;
}

.more-link:hover {
	background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
	transform: translateY(-1px);
	box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

/* Override default FullCalendar more link styles */
.fc .fc-daygrid-more-link {
	color: inherit !important;
	background: none !important;
	border: none !important;
	margin: 2px 4px !important;
}

.fc .fc-daygrid-more-link:hover {
	text-decoration: none !important;
}

/* Style untuk container event dalam cell kalender */
.fc-daygrid-day-events {
	max-height: none; /* Biarkan tinggi menyesuaikan saat expand */
	transition: max-height 0.3s ease;
}

/* Style untuk popover saat expand */
.fc-popover {
	background: white !important;
	border: none !important;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
	border-radius: 12px !important;
	overflow: hidden !important;
}

.fc-popover-header {
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
	padding: 8px 12px !important;
	color: white !important;
	font-weight: 600 !important;
}

.fc-popover-body {
	padding: 8px !important;
	max-height: 300px !important;
	overflow-y: auto !important;
}

.fc-popover .fc-event {
	margin: 4px 0 !important;
}

/* Style untuk close button pada popover */
.fc-popover .fc-popover-close {
	color: white !important;
	opacity: 0.8 !important;
	font-size: 1.2em !important;
	padding: 6px !important;
	transition: opacity 0.2s ease !important;
}

.fc-popover .fc-popover-close:hover {
	opacity: 1 !important;
}

/* Scroll improvements */
:global(.events-container::-webkit-scrollbar) {
	width: 6px;
}

:global(.events-container::-webkit-scrollbar-track) {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 3px;
}

:global(.events-container::-webkit-scrollbar-thumb) {
	background: rgba(99, 102, 241, 0.3);
	border-radius: 3px;
}

:global(.events-container::-webkit-scrollbar-thumb:hover) {
	background: rgba(99, 102, 241, 0.5);
}
</style>