<template>
  <div>
    <h1 class="text-2xl color-primary font-bold mb-4">Dashboard Admin</h1>


<!-- Produk Terlaris -->
<div class="bg-white rounded-lg shadow p-4 mb-6">
  <h2 class="text-lg font-semibold mb-2">Produk Terlaris (berdasarkan stok)</h2>
  <div class="h-64">
    <Bar v-if="bestSellingChartData.labels.length" :data="bestSellingChartData" :options="chartOptions" />
  </div>
</div>

<!-- Produk Paling Banyak Di-Visit -->
<div class="bg-white rounded-lg shadow p-4">
  <h2 class="text-lg font-semibold mb-2">Produk Paling Banyak Di-Visit</h2>
  <div class="h-64">
    <Bar v-if="mostVisitedChartData.labels.length" :data="mostVisitedChartData" :options="chartOptions" />
  </div>
</div>




  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
const config = useRuntimeConfig()
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// Register Chart.js modules
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const bestSellingChartData = computed(() => ({
  labels: bestSellingData.value.labels,
  datasets: bestSellingData.value.datasets
}))

const mostVisitedChartData = computed(() => ({
  labels: mostVisitedData.value.labels,
  datasets: mostVisitedData.value.datasets
}))

// Reactive chart data
const bestSellingData = ref({
  labels: [],
  datasets: [{
    label: 'Stok Produk',
    backgroundColor: '#FFA500',
    data: []
  }]
})

const mostVisitedData = ref({
  labels: [],
  datasets: [{
    label: 'Jumlah Kunjungan',
    backgroundColor: '#f26021 ',
    data: []
  }]
})

// Ambil data dari API


onMounted(async () => {
  try {
    // Use the correct backend URL from runtime config
    const res = await axios.get(`${config.public.BACKEND_URL_2}/products`)
    const products = res.data.data

    // Ambil data terlaris (berdasarkan stok tertinggi)
    const sortedByStock = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5)
    bestSellingData.value.labels = sortedByStock.map(p => p.name)
    bestSellingData.value.datasets[0].data = sortedByStock.map(p => p.stock)

    // Ambil data paling banyak dikunjungi
    const sortedByVisit = [...products].sort((a, b) => b.visitCount - a.visitCount).slice(0, 5)
    mostVisitedData.value.labels = sortedByVisit.map(p => p.name)
    mostVisitedData.value.datasets[0].data = sortedByVisit.map(p => p.visitCount)

  } catch (err) {
    console.error('Gagal mengambil data produk:', err)
  }
})

definePageMeta({
  layout: 'admin',
  // middleware: 'is-login'
})
</script>


<style scoped>
/* Supaya grafik punya tinggi cukup */
.chart-container {
  height: 300px;
}
</style>
