<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Riwayat Transaksi</h1>
      
      <div class="flex items-center space-x-4 pt-5">
        <span class="text-gray-600" v-if="!loading">
          {{ transactions.length }} transaksi ditemukan
        </span>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex gap-4">
            <div class="bg-gray-300 h-24 w-24 rounded-lg flex-shrink-0"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">Gagal Memuat Transaksi</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchTransactions" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <div v-else-if="transactions.length === 0" class="text-center py-12">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Belum Ada Transaksi</h3>
        <p class="text-gray-600 mb-4">Anda belum memiliki riwayat transaksi</p>
      </div>
    </div>

    <div v-else>
      <div class="space-y-4">
        <div
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-4">
            <div class="flex gap-4">
              <!-- Gambar Produk -->
              <div class="flex-shrink-0">
                <img
                  :src="transaction.product.imageUrl"
                  :alt="transaction.product.name"
                  class="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  @error="handleImageError"
                />
              </div>
              
              <!-- Informasi Transaksi -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 truncate">
                      {{ transaction.product.name }}
                    </h3>
                    <p class="text-sm text-gray-500 mb-1">
                      Order ID: {{ transaction.orderId }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-gray-900">
                      {{ formatPrice(transaction.finalAmount) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Jumlah: {{ transaction.quantity }}
                    </p>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    :class="getPaymentStatusClass(transaction.paymentStatus)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getPaymentStatusText(transaction.paymentStatus) }}
                  </span>
                  <span 
                    :class="getShipmentStatusClass(transaction.shipmentStatus)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getShipmentStatusText(transaction.shipmentStatus) }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center text-sm text-gray-500">
                  <span>{{ formatDate(transaction.createdAt) }}</span>
                  <span v-if="transaction.product.size">
                    Size: {{ transaction.product.size }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-4 items-center">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Prev</span>
        </button>

        <div class="flex gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition',
              page === currentPage
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <span class="font-semibold text-gray-700 px-2">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span>Next</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="text-center mt-4 text-sm text-gray-600">
        Menampilkan {{ startIndex + 1 }}-{{ Math.min(endIndex, transactions.length) }} 
        dari {{ transactions.length }} transaksi
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const config = useRuntimeConfig()

const transactions = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() =>
  Math.ceil(transactions.value.length / itemsPerPage.value)
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return transactions.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => currentPage.value * itemsPerPage.value)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const fetchTransactions = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch(`${config.public.BACKEND_URL_1}/transactions/user`, {
      credentials: 'include'
    })

    if (response.success) {
      transactions.value = response.data.filter(transaction => !transaction.deletedAt)
    } else {
      throw new Error(response.message || 'Gagal mengambil data transaksi')
    }
  } catch (err) {
    console.error('Error fetching transactions:', err)
    error.value = err.message || 'Terjadi kesalahan saat mengambil data transaksi'
    transactions.value = []
  } finally {
    loading.value = false
  }
}


const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentStatusClass = (status) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusText = (status) => {
  switch (status) {
    case 'PAID':
      return 'Dibayar'
    case 'PENDING':
      return 'Menunggu Pembayaran'
    case 'FAILED':
      return 'Gagal'
    default:
      return status
  }
}

const getShipmentStatusClass = (status) => {
  switch (status) {
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getShipmentStatusText = (status) => {
  switch (status) {
    case 'SHIPPED':
      return 'Dikirim'
    case 'DELIVERED':
      return 'Diterima'
    case 'PENDING':
      return 'Menunggu Pengiriman'
    case 'CANCELLED':
      return 'Dibatalkan'
    default:
      return status
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder-product.jpg' // Ganti dengan path gambar placeholder
}

onMounted(() => {
  fetchTransactions()
})

definePageMeta({
  layout: 'home'
})
</script>