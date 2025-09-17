<template>
  <div id="app">
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Newspaper Analytics</h1>
      </header>

      <!-- Grafico principale -->
      <div class="chart-section">
        <div class="chart-container">
          <canvas id="mainChart"></canvas>
        </div>
      </div>

      <!-- Card delle metriche -->
      <div class="metrics-container">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.key"
          :title="metric.title"
          :value="metric.value"
          :isActive="selectedMetric === metric.key"
          @click="selectMetric(metric.key)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import MetricCard from './components/MetricCard.vue'

Chart.register(...registerables)

export default {
  name: 'App',
  components: {
    MetricCard
  },
  data() {
    return {
      chart: null,
      selectedMetric: 'subscriptions',
      metrics: [
        { key: 'subscriptions', title: 'Subscriptions', value: 0 },
        { key: 'impressions', title: 'Impressions', value: 0 },
        { key: 'clicks', title: 'Clicks', value: 0 },
        { key: 'avgTime', title: 'Avg Time', value: 0 }
      ],
      chartData: {
        subscriptions: {
          labels: [],
          data: []
        },
        impressions: {
          labels: [],
          data: []
        },
        clicks: {
          labels: [],
          data: []
        },
        avgTime: {
          labels: [],
          data: []
        }
      },
      impressionsInterval: null
    }
  },
  async mounted() {
    await this.initializeData()
    this.initChart()
    this.startRealTimeUpdates()
  },
  beforeUnmount() {
    if (this.impressionsInterval) {
      clearInterval(this.impressionsInterval)
    }
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    async initializeData() {
      // Simula dati dal server (sostituisci con chiamata API reale)
      const mockData = this.generateMockData()
      
      // Aggiorna i valori totali
      this.metrics[0].value = mockData.subscriptions.total
      this.metrics[1].value = mockData.impressions.total
      this.metrics[2].value = mockData.clicks.total
      this.metrics[3].value = mockData.avgTime.total

      // Aggiorna i dati temporali
      this.chartData = mockData.temporal
    },

    generateMockData() {
      const now = new Date()
      const labels = []
      const subscriptionsData = []
      const impressionsData = []
      const clicksData = []
      const avgTimeData = []

      // Genera dati per gli ultimi 12 mesi
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(date.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' }))
        
        subscriptionsData.push(Math.floor(Math.random() * 50) + 20)
        impressionsData.push(Math.floor(Math.random() * 1000) + 500)
        clicksData.push(Math.floor(Math.random() * 200) + 100)
        avgTimeData.push(Math.floor(Math.random() * 60) + 120)
      }

      return {
        subscriptions: { total: subscriptionsData.reduce((a, b) => a + b, 0) },
        impressions: { total: impressionsData.reduce((a, b) => a + b, 0) },
        clicks: { total: clicksData.reduce((a, b) => a + b, 0) },
        avgTime: { total: Math.floor(avgTimeData.reduce((a, b) => a + b, 0) / avgTimeData.length) },
        temporal: {
          subscriptions: { labels, data: subscriptionsData },
          impressions: { labels, data: impressionsData },
          clicks: { labels, data: clicksData },
          avgTime: { labels, data: avgTimeData }
        }
      }
    },

    initChart() {
      const ctx = document.getElementById('mainChart').getContext('2d')
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartData[this.selectedMetric].labels,
          datasets: [{
            label: this.getMetricTitle(this.selectedMetric),
            data: this.chartData[this.selectedMetric].data,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Chart',
              font: {
                size: 24,
                weight: 'bold'
              },
              color: '#374151'
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      })
    },

    selectMetric(metricKey) {
      this.selectedMetric = metricKey
      this.updateChart()
    },

    updateChart() {
      if (this.chart) {
        this.chart.data.labels = this.chartData[this.selectedMetric].labels
        this.chart.data.datasets[0].data = this.chartData[this.selectedMetric].data
        this.chart.data.datasets[0].label = this.getMetricTitle(this.selectedMetric)
        this.chart.update()
      }
    },

    getMetricTitle(key) {
      const metric = this.metrics.find(m => m.key === key)
      return metric ? metric.title : ''
    },

    startRealTimeUpdates() {
      // Aggiorna le impressions ogni 2 secondi (+5 unità)
      this.impressionsInterval = setInterval(() => {
        const impressionsMetric = this.metrics.find(m => m.key === 'impressions')
        if (impressionsMetric) {
          impressionsMetric.value += 5
        }
      }, 2000)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
}

.chart-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  height: 400px;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .metrics-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>