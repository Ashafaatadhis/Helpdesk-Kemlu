<template>
  <div class="recent-activity-table">
    <!-- Widget Header -->
    <div class="widget-header">
      <h3 class="widget-title">Kegiatan Terkini</h3>
      <!-- <button class="more-btn">MORE</button> -->
    </div>
    
    <!-- Table Container -->
    <div class="table-container">
      <table class="activity-table">
        <thead>
          <tr>
            <!-- <th>ID</th> -->
            <th>Petugas</th>
            <th>Pemohon</th>
            <!-- <th>Tanggal</th> -->
            <th>Kegiatan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="activity in activities" :key="activity.id">
            <!-- <td class="id-cell">{{ activity.id }}</td> -->
            <td class="petugas-cell">
              <div class="petugas-info">
                <img :src="activity.petugas.avatar" :alt="activity.petugas.name" class="avatar">
                <span>{{ activity.petugas.name }}</span>
              </div>
            </td>
            <td>{{ activity.pemohon }}</td>
            <!-- <td>{{ activity.tanggal }}</td> -->
            <td>{{ activity.kegiatan }}</td>
            <td>
              <span :class="['status-badge', activity.status.toLowerCase()]">
                {{ activity.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'RecentActivityTable',
  data() {
    return {
      activities: []
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/api/kegiatan-terkini');
      // Mapping backend fields to frontend table
      this.activities = response.data.map((item, idx) => {
        // Petugas bisa berupa string nama, atau array/comma separated
        let petugasName = '-';
        if (item.petugas) {
          if (Array.isArray(item.petugas)) petugasName = item.petugas[0] || '-';
          else if (typeof item.petugas === 'string') petugasName = item.petugas.split(',')[0] || '-';
        }
        return {
          id: item.id,
          petugas: {
            name: petugasName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(petugasName)}&background=3b82f6&color=fff&size=32`
          },
          pemohon: item.eselon || '-',
          kegiatan: item.nama_kegiatan || '-',
          status: item.status || '-'
        };
      });
    } catch (error) {
      // Jika error, biarkan activities kosong
      // Bisa juga tampilkan pesan error jika mau
    }
  }
}
</script>

<style scoped>
.recent-activity-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.widget-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
}

.more-btn:hover {
  color: #666;
}

.table-container {
  flex: 1;
  overflow-x: auto;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.activity-table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #dee2e6;
  font-size: 12px;
  text-transform: uppercase;
}

.activity-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.activity-table tbody tr:hover {
  background-color: #f8f9fa;
}

.id-cell {
  color: #666;
  font-weight: 500;
}

.petugas-cell {
  min-width: 120px;
}

.petugas-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.process {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background-color: #d1edff;
  color: #0c5460;
}

.status-badge.pending {
  background-color: #f8d7da;
  color: #721c24;
}

/* Responsive */
@media (max-width: 768px) {
  .activity-table {
    font-size: 11px;
  }
  
  .activity-table th,
  .activity-table td {
    padding: 8px 4px;
  }
  
  .avatar {
    width: 24px;
    height: 24px;
  }
}
</style>