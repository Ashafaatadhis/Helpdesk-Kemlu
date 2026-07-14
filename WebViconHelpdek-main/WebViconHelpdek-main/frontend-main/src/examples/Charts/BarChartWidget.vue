<template>
  <div class="chart-inner">
    <div class="widget-header">
      <div class="widget-title-section">
        <h3 class="widget-title">Kegiatan per Tahun</h3>
        <div class="growth-indicator">
          <span class="growth-icon">↗</span>
          <span class="growth-text">{{ growthPercentage }}% more in {{ selectedYear }}</span>
        </div>
      </div>
      <div class="year-selector">
        <select v-model="selectedYear" class="year-select custom-scroll-select">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="chart-container" ref="chartContainer">
      <canvas 
        ref="chartCanvas" 
        class="chart-canvas"
        @mousemove="handleMouseMove"
        @mouseleave="hideTooltip"
      ></canvas>
      
      <!-- Debug info -->
      <div class="debug-info" v-if="debugMode">
        Debug info hidden
      </div>
      
      <!-- Tooltip -->
      <div 
        v-if="tooltip.show"
        class="tooltip"
        :style="{
          left: tooltip.x + 'px',
          top: tooltip.y + 'px'
        }"
      >
        <div class="tooltip-header">{{ tooltip.month }}</div>
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-color"></span>
            <span class="tooltip-label">Kegiatan:</span>
            <span class="tooltip-value">{{ tooltip.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

export default {
  name: 'BarChartWidget',
  setup() {
    const chartCanvas = ref(null)
    const chartContainer = ref(null)
  const selectedYear = ref(String(new Date().getFullYear()))
    const availableYears = ref([])
    const salesData = ref({})
    const growthPercentage = ref(0)
    const debugMode = ref(false)
    const tooltip = ref({
      show: false,
      x: 0,
      y: 0,
      month: '',
      value: 0
    })
    const chartPoints = ref([])

    const calculateGrowthPercentage = () => {
      // Simplified growth calculation
      growthPercentage.value = 15
    }

    const updateChartData = () => {
      if (chartCanvas.value) {
        drawChart()
      }
    }

    const drawChart = () => {
      if (!chartCanvas.value || !chartContainer.value) return
      const canvas = chartCanvas.value
      const container = chartContainer.value
      const ctx = canvas.getContext('2d')
      // Responsive height: Semakin banyak data, semakin kecil view
      const data = salesData.value[selectedYear.value] || []
      const minHeight = 180
      const maxHeight = 320
      // Jika data <= 5, tinggi besar, jika data > 20, tinggi kecil
      let dynamicHeight = maxHeight - (data.length * 6)
      if (dynamicHeight < minHeight) dynamicHeight = minHeight
      if (dynamicHeight > maxHeight) dynamicHeight = maxHeight
      container.style.height = dynamicHeight + 'px'
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Chart dimensions
      const padding = 40
      const chartWidth = canvas.width - (padding * 2)
      const chartHeight = canvas.height - (padding * 2) - 20
      
  // Sample data (replace with actual data)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      // Calculate points
      const points = []
      chartPoints.value = []
      
      const maxValue = Math.max(...data, 100)
      
      months.forEach((month, index) => {
        const x = padding + (index * chartWidth) / (months.length - 1)
        const y = padding + chartHeight - (data[index] / maxValue) * chartHeight
        
        points.push({ x, y })
        chartPoints.value.push({
          x,
          y,
          month,
          value: data[index]
        })
      })
      
      // Draw area gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
      gradient.addColorStop(0, 'rgba(139, 195, 74, 0.3)')
      gradient.addColorStop(1, 'rgba(139, 195, 74, 0.1)')
      
      // Draw area
      ctx.beginPath()
      ctx.moveTo(points[0].x, padding + chartHeight)
      ctx.lineTo(points[0].x, points[0].y)
      
      for (let i = 0; i < points.length - 1; i++) {
        const currentPoint = points[i]
        const nextPoint = points[i + 1]
        const midPointX = (currentPoint.x + nextPoint.x) / 2
        const midPointY = (currentPoint.y + nextPoint.y) / 2
        
        if (i === 0) {
          ctx.lineTo(midPointX, midPointY)
        } else {
          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midPointX, midPointY)
        }
      }
      
      // Complete the curve to the last point
      const lastPoint = points[points.length - 1]
      const secondLastPoint = points[points.length - 2]
      ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y)
      
      // Close the area
      ctx.lineTo(lastPoint.x, padding + chartHeight)
      ctx.closePath()
      
      // Fill area
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Draw the main curve line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      
      for (let i = 0; i < points.length - 1; i++) {
        const currentPoint = points[i]
        const nextPoint = points[i + 1]
        const midPointX = (currentPoint.x + nextPoint.x) / 2
        const midPointY = (currentPoint.y + nextPoint.y) / 2
        
        if (i === 0) {
          ctx.lineTo(midPointX, midPointY)
        } else {
          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midPointX, midPointY)
        }
      }
      
      ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y)
      
      ctx.strokeStyle = '#8BC34A'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      
      // Draw data points (hidden but still interactive)
      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = 'transparent'
        ctx.fill()
      })
      
      // Draw month labels
      ctx.fillStyle = '#999'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      
      months.forEach((month, index) => {
        if (index < points.length) {
          ctx.fillText(month, points[index].x, padding + chartHeight + 20)
        }
      })
    }

    const handleMouseMove = (event) => {
      if (!chartCanvas.value || !chartContainer.value) return
      
      const canvas = chartCanvas.value
      const canvasRect = canvas.getBoundingClientRect()
      
      // Get mouse position relative to canvas
      const mouseX = event.clientX - canvasRect.left
      const mouseY = event.clientY - canvasRect.top
      
      // Check if mouse is near any data point
      let nearestPoint = null
      let minDistance = Infinity
      const threshold = 40
      
      chartPoints.value.forEach((point) => {
        const distance = Math.sqrt(
          Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
        )
        
        if (distance < threshold && distance < minDistance) {
          minDistance = distance
          nearestPoint = point
        }
      })
      
      if (nearestPoint) {
        tooltip.value = {
          show: true,
          x: nearestPoint.x,
          y: nearestPoint.y - 20,
          month: nearestPoint.month,
          value: nearestPoint.value
        }
      } else {
        tooltip.value.show = false
      }
    }

    const hideTooltip = () => {
      tooltip.value.show = false
    }

    // Ambil tahun yang tersedia dari backend (distinct tahun dari kegiatan)
    const fetchAvailableYears = async () => {
      // Dropdown tahun bisa di-scroll dari 2015 sampai 2050
      const minYear = 2015;
      const maxYear = 2050;
      const years = [];
      for (let y = minYear; y <= maxYear; y++) years.push(String(y));
      availableYears.value = years;
      // Set default tahun ke tahun saat ini
      const currentYear = new Date().getFullYear();
      if (!years.includes(selectedYear.value)) selectedYear.value = String(currentYear);
    }

    // Ambil data kegiatan per bulan dari backend
    const fetchYearData = async (year) => {
      try {
        const res = await axios.get(`/api/kegiatan-per-tahun?year=${year}`)
        salesData.value[year] = res.data.data
      } catch (err) {
        salesData.value[year] = Array(12).fill(0)
      }
    }

    onMounted(async () => {
      await fetchAvailableYears()
      await fetchYearData(selectedYear.value)
      calculateGrowthPercentage()
      setTimeout(() => {
        if (chartCanvas.value) {
          drawChart()
        }
      }, 100)
      // Handle window resize
      window.addEventListener('resize', () => {
        setTimeout(() => {
          if (chartCanvas.value) {
            drawChart()
          }
        }, 100)
      })
    })

    // Watch perubahan tahun: fetch data baru jika belum ada
    watch(selectedYear, async (newYear) => {
      if (!salesData.value[newYear]) {
        await fetchYearData(newYear)
      }
      updateChartData()
    })

    return {
      chartCanvas,
      chartContainer,
      selectedYear,
      availableYears,
      growthPercentage,
      debugMode,
      tooltip,
      handleMouseMove,
      hideTooltip,
      updateChartData
    }
  }
}
</script>

<style scoped>
.chart-inner {
  width: 100%;
  height: 100%;
}


.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.widget-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.widget-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.growth-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.growth-icon {
  color: #4CAF50;
  font-size: 16px;
  font-weight: bold;
}

.growth-text {
  color: #4CAF50;
  font-size: 14px;
  font-weight: 500;
}

.year-selector {
  display: flex;
  align-items: center;
}

.year-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

/* Dropdown tahun: default hanya tahun saat ini, klik muncul kotak 5 tahun bisa discroll */
.custom-scroll-select:focus {
  overflow-y: auto;
  min-height: 40px;
  max-height: 200px;
}

.year-select option {
  padding: 8px 12px;
}

.year-select:hover {
  border-color: #8BC34A;
}

.year-select:focus {
  border-color: #8BC34A;
  box-shadow: 0 0 0 2px rgba(139, 195, 74, 0.2);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
}

.debug-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
  z-index: 999;
}

/* Tooltip Styles */
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 120px;
  border: 2px solid #8BC34A;
  transform: translateX(-50%);
}

.tooltip-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #8BC34A;
  flex-shrink: 0;
}

.tooltip-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.tooltip-value {
  font-weight: 600;
  color: #fff;
  margin-left: auto;
}

@media (max-width: 640px) {
  .widget-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .year-selector {
    width: 100%;
  }
  
  .year-select {
    width: 100%;
  }
}
</style>