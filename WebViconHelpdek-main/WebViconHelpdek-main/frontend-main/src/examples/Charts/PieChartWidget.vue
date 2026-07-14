<template>
  <!-- Header dengan gradient background seperti gambar -->
  <div class="chart-header">
    <h3 class="chart-title">Data Permintaan per Satker</h3>
    <button class="more-button">MORE</button>
  </div>
  
  <!-- Chart wrapper -->
  <div class="chart-wrapper">
    <div class="chart-container">
      <canvas ref="doughnutChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Chart from 'chart.js/auto'

// Template ref untuk canvas element
const doughnutChart = ref(null)
let chartInstance = null

// Data pengaduan bulan ini (akan diisi dari backend)
const pengaduanData = ref({
  staffAhli: 0,
  inspektoratJenderal: 0,
  sekretariatJenderal: 0,
  dirjenAsiaPasifikAfrika: 0,
  dirjenAmerikaEropa: 0,
  dirjenKerjasamaASEAN: 0,
  dirjenKerjasamaMultilateral: 0,
  dirjenHukumPerjanjian: 0,
  dirjenHubunganEkonomi: 0,
  dirjenInformasiDiplomasi: 0,
  dirjenProtokolKonsuler: 0,
  badanStrategiKebijakan: 0
})

import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Computed untuk total pengaduan
const totalPengaduan = computed(() => {
  return Object.values(pengaduanData.value).reduce((total, value) => total + value, 0)
})

// Computed untuk bulan saat ini
const currentMonth = computed(() => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const currentDate = new Date()
  return months[currentDate.getMonth()]
})

// Data untuk donut chart
const chartLabels = [
  'Staff Ahli',
  'Inspektorat Jenderal', 
  'Sekretariat Jenderal',
  'Direktorat Jenderal Asia Pasifik dan Afrika',
  'Direktorat Jenderal Amerika dan Eropa',
  'Direktorat Jenderal Kerjasama ASEAN',
  'Direktorat Jenderal Kerjasama Multilateral',
  'Direktorat Jenderal Hukum dan Perjanjian Internasional',
  'Direktorat Jenderal Hubungan Ekonomi dan Kerjasama Pembangunan',
  'Direktorat Jenderal Informasi dan Diplomasi Publik',
  'Direktorat Jenderal Protokol dan Konsuler',
  'Badan Strategi Kebijakan Luar Negeri'
]
const chartData = ref({
  labels: chartLabels,
  datasets: [{
    label: 'Pengaduan per Bulan',
    data: Object.values(pengaduanData.value),
    backgroundColor: [
      '#3b82f6', // Biru
      '#10b981', // Hijau
      '#f59e0b', // Kuning
      '#ef4444', // Merah
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#f97316', // Orange
      '#84cc16', // Lime
      '#ec4899', // Pink
      '#6366f1', // Indigo
      '#14b8a6', // Teal
      '#f43f5e'  // Rose
    ],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
})

// Watch pengaduanData agar chartData selalu sinkron
import { watch } from 'vue'
watch(pengaduanData, (val) => {
  chartData.value.datasets[0].data = Object.values(val)
  if (chartInstance) {
    chartInstance.data.datasets[0].data = Object.values(val)
    chartInstance.update()
  }
})

// Function untuk menyingkat nama di legend
const abbreviateLegendLabel = (label) => {
  return label.replace(/Direktorat Jenderal/g, 'Dirjen')
}

// Plugin untuk center text
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    const xCoor = (chartArea.left + chartArea.right) / 2;
    const yCoor = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();

    // angka utama
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#1a202c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(totalPengaduan.value.toString(), xCoor, yCoor - 10);

    // label
    ctx.font = '600 13px Arial';
    ctx.fillStyle = '#4a5568';
    ctx.fillText('Total Pengaduan', xCoor, yCoor + 15);

    // bulan
    ctx.font = '500 11px Arial';
    ctx.fillStyle = '#718096';
    ctx.fillText(currentMonth.value, xCoor, yCoor + 30);

    ctx.restore();
  }
};


// Register plugin
Chart.register(centerTextPlugin);

// Konfigurasi chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    centerText: true,
    legend: {
      position: 'right',
      labels: {
        padding: 12,
        usePointStyle: true,
        font: {
          size: 10
        },
        boxWidth: 10,
        maxWidth: 220,
        textAlign: 'left',
        generateLabels: function (chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const dataset = data.datasets[0];
              const backgroundColor = dataset.backgroundColor[i];
              const meta = chart.getDatasetMeta(0);
              const hidden = meta.data[i].hidden; // cek apakah slice ini disembunyikan

              // Singkat hanya untuk legend
              const abbreviatedLabel = abbreviateLegendLabel(label);

              return {
                text: abbreviatedLabel,
                fillStyle: backgroundColor,
                strokeStyle: backgroundColor,
                lineWidth: 0,
                index: i,
                hidden: hidden,
                fontColor: hidden ? '#a0aec0' : '#1a202c', // abu-abu jika hidden
                textDecoration: hidden ? 'line-through' : 'none'
              };
            });
          }
          return [];
        }
      },
      onClick: function (e, legendItem, legend) {
        const index = legendItem.index;
        const chart = legend.chart;
        const meta = chart.getDatasetMeta(0);

        // Toggle show/hide slice
        meta.data[index].hidden = !meta.data[index].hidden;

        chart.update();
      }
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          // Tooltip tetap menggunakan nama asli (tidak disingkat)
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} pengaduan (${percentage}%)`;
        }
      }
    }
  },
  cutout: '70%',
  elements: {
    arc: {
      borderWidth: 0
    }
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
};


// Lifecycle hooks
let pollingInterval = null;
const fetchSatkerData = async () => {
  try {
    const response = await axios.get('/api/pengaduan-per-satker-bulan-ini');
    const backendData = response.data;
    const labelKeyMap = [
      'staffAhli',
      'inspektoratJenderal',
      'sekretariatJenderal',
      'dirjenAsiaPasifikAfrika',
      'dirjenAmerikaEropa',
      'dirjenKerjasamaASEAN',
      'dirjenKerjasamaMultilateral',
      'dirjenHukumPerjanjian',
      'dirjenHubunganEkonomi',
      'dirjenInformasiDiplomasi',
      'dirjenProtokolKonsuler',
      'badanStrategiKebijakan'
    ];
    const newData = {};
    labelKeyMap.forEach(key => {
      newData[key] = backendData[key] || 0;
    });
    updateChartData(newData);
  } catch (error) {
    console.error('Gagal fetch data pengaduan:', error);
  }
};

onMounted(async () => {
  await fetchSatkerData();
  if (doughnutChart.value) {
    chartInstance = new Chart(doughnutChart.value, {
      type: 'doughnut',
      data: chartData.value,
      options: chartOptions
    });
  }
  pollingInterval = setInterval(fetchSatkerData, 10000); // polling setiap 10 detik
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

// Method untuk update data (optional)
const updateChartData = (newData) => {
  // Update data pengaduan terlebih dahulu agar computed ikut berubah
  pengaduanData.value = newData;
  if (chartInstance) {
    chartInstance.data.datasets[0].data = Object.values(newData);
    chartInstance.update();
  }
};

// Expose method jika dibutuhkan parent component
defineExpose({
  updateChartData
});

</script>

<style scoped>
.chart-header {
  background: white;              /* dari gradient → putih */
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;  /* garis tipis abu-abu */
  border-radius: 8px 8px 0 0;        /* kalau mau rounded */
}


.chart-title {
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  position: relative;
  z-index: 2;
}

.more-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
}

.more-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 0 0 16px 16px;
  /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); */
}

.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container canvas {
  position: relative;
  z-index: 1;
}

canvas {
  max-width: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain;
}

/* Responsive */
@media (max-width: 1024px) {
  .chart-wrapper {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 350px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 300px;
  }
}

.chartjs-legend li span {
  text-decoration: inherit !important;
}

</style>