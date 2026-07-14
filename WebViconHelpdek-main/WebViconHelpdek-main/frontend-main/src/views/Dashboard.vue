<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h1 class="dashboard-title">DASHBOARD</h1>
          <p class="dashboard-subtitle">Melayani dengan Hati dengan IT</p>
        </div>
      </div>
    </div>
    
    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <!-- Top Row - Pie Chart memanjang horizontal -->
      <div class="pie-chart-row">
        <div class="pie-chart-widget">
          <PieChartWidget />
        </div>
      </div>
      
      <!-- Bottom Row - Bar Chart dan Table sejajar -->
      <div class="bottom-row">
        <!-- Bar Chart Widget -->
        <div class="bar-chart-widget">
          <BarChartWidget />
        </div>
        
        <!-- Recent Activities Table -->
        <div class="table-widget">
          <RecentActivityTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import komponen dari folder examples
import PieChartWidget from '@/examples/Charts/PieChartWidget.vue'
import BarChartWidget from '@/examples/Charts/BarChartWidget.vue'
import RecentActivityTable from '@/examples/Tabel/RecentActivityTable.vue'


export default {
  name: 'Dashboard',
  components: {
    PieChartWidget,
    BarChartWidget,
    RecentActivityTable
  },
  data() {
    return {
      // Dashboard data bisa ditambahkan di sini kalau diperlukan
    }
  },
  mounted() {
    // Logic ketika dashboard dimount
    console.log('Dashboard loaded successfully')
  }
}
</script>

<style scoped>
/* .dashboard-container {
  min-height: 100vh;
  background-color: #006fdf;
} */

.dashboard-header {
  position: relative;
  top: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 24px 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  max-width: 1400px;
  margin: 0 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dashboard-title {
  color: #495057;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.dashboard-subtitle {
  color: #6c757d;
  font-size: 14px;
  margin: 4px 0 0 0;
  font-weight: 400;
}

.dashboard-content {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Top Row - Pie Chart memanjang horizontal */
.pie-chart-row {
  margin-bottom: 24px;
}

.pie-chart-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  padding: 24px;
  min-height: 400px;
  transition: box-shadow 0.2s ease;
}

.pie-chart-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Bottom Row - Bar Chart dan Table sejajar */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 0.7fr;
  gap: 24px;
}

.bar-chart-widget {
  align-self: start;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  padding: 24px;
  max-height: 400px;
  transition: box-shadow 0.2s ease;
  height: fit-content;
}

.bar-chart-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-widget {
   align-self: stretch;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  padding: 20px;
  min-height: 400px;
  height: auto;
  transition: box-shadow 0.2s ease;
  overflow-y: auto;
}

.table-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive Design untuk layar sangat besar */
@media (min-width: 1920px) {
  .dashboard-header {
    max-width: 1800px;
    margin: 0 auto;
  }
  
  .dashboard-content {
    max-width: 1800px;
    padding: 40px;
  }
  
  .header-content {
    max-width: 1800px;
  }
}

@media (min-width: 1600px) and (max-width: 1919px) {
  .dashboard-header {
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .dashboard-content {
    max-width: 1600px;
  }
  
  .header-content {
    max-width: 1600px;
  }
}

@media (min-width: 1400px) and (max-width: 1599px) {
  .dashboard-header {
    margin: 0 auto;
  }
}

/* Responsive Design untuk layar medium-large */
@media (max-width: 1200px) {
  .dashboard-header {
    max-width: 1200px;
  }
  
  .dashboard-content {
    max-width: 1200px;
  }
  
  .bottom-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: start; 
}

}

/* Responsive Design untuk tablet */
@media (max-width: 1024px) {
  .dashboard-content {
    padding: 24px;
  }
  
  .dashboard-header {
    padding: 20px 24px;
  }
  
  .bottom-row {
    gap: 20px;
    grid-template-columns: 1fr;
  }
  
  .pie-chart-widget,
  .bar-chart-widget,
  .table-widget {
    padding: 20px;
  }
}

/* Responsive Design untuk mobile landscape */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px 20px;
    margin: 0 16px;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .dashboard-subtitle {
    font-size: 13px;
  }
  
  .bottom-row {
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .dashboard-content {
    padding: 16px;
  }
  
  .pie-chart-widget,
  .bar-chart-widget {
    min-height: 350px;
    padding: 16px;
  }
  
  .table-widget {
    min-height: 300px;
    padding: 16px;
  }
}

/* Responsive Design untuk mobile portrait */
@media (max-width: 480px) {
  .dashboard-header {
    padding: 12px 16px;
    margin: 0 12px;
  }
  
  .dashboard-title {
    font-size: 20px;
  }
  
  .dashboard-subtitle {
    font-size: 12px;
  }
  
  .dashboard-content {
    padding: 12px;
  }
  
  .pie-chart-widget,
  .bar-chart-widget {
    min-height: 300px;
    padding: 12px;
  }
  
  .table-widget {
    min-height: 250px;
    padding: 12px;
  }
  
  .bottom-row {
    gap: 12px;
  }
}

/* Responsive Design untuk layar sangat kecil */
@media (max-width: 360px) {
  .header-icon {
    width: 36px;
    height: 36px;
  }
  
  .dashboard-title {
    font-size: 18px;
  }
  
  .dashboard-subtitle {
    font-size: 11px;
  }
}
</style>