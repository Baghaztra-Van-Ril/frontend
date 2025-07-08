<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 flex justify-center items-center">
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-10">

      <!-- Loading State -->
      <template v-if="loading">
        <!-- Product Info Loading -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/2">
          <div class="animate-pulse">
            <div class="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
            <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1 w-3/4"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1 w-1/2"></div>
            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded mt-4 w-1/3"></div>
            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>

        <!-- Payment Form Loading -->
        <div class="bg-orange-500 rounded-xl text-white p-6 w-full md:w-1/2 shadow-md">
          <div class="animate-pulse">
            <div class="flex justify-between mb-4">
              <div class="h-6 bg-white/30 rounded w-1/3"></div>
              <div class="h-6 bg-white/30 rounded w-1/6"></div>
            </div>
            <div class="flex justify-between items-center mb-4">
              <div class="h-6 bg-white/30 rounded w-1/3"></div>
              <div class="h-8 bg-white/30 rounded w-24"></div>
            </div>
            <div class="h-px bg-white/30 my-6"></div>
            <div class="flex justify-between text-lg font-bold mb-6">
              <div class="h-7 bg-white/30 rounded w-1/4"></div>
              <div class="h-7 bg-white/30 rounded w-1/2"></div>
            </div>
            <div class="h-12 bg-white/30 rounded"></div>
          </div>
        </div>
      </template>

      <!-- Content (when loaded) -->
      <template v-else>
        <!-- Product Info -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/2">
          <img
            :src="productData.imageUrl"
            :alt="productData.name"
            class="w-full h-64 object-cover rounded-md mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ productData.name }}</h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-1">{{ productData.description }}</p>
          <p class="text-gray-700 dark:text-gray-200 font-semibold mt-4">Harga: Rp.{{ productData.price.toLocaleString('id-ID') }}</p>
          <p class="text-gray-700 dark:text-gray-200">Stok: {{ productData.stock }}</p>
        </div>

        <!-- Payment Form -->
        <div class="bg-orange-500 rounded-xl text-white p-6 w-full md:w-1/2 shadow-md flex flex-col gap-4">
          <div class="flex justify-between">
            <span class="font-semibold">Stok Total:</span>
            <span>{{ productData.stock }}</span>
          </div>

          <div class="flex justify-between items-center">
            <label class="font-semibold">Jumlah Beli:</label>
            <input
              type="number"
              v-model.number="quantity"
              @input="validateQuantity"
              min="1"
              :max="productData.stock"
              :disabled="productData.stock === 0"
              class="w-24 text-white rounded-md px-2 py-1 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            />
          </div>

          <hr class="border-white/50 my-2" />

          <div class="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>Rp.{{ calculateTotal.toLocaleString('id-ID') }},-</span>
          </div>

          <button
            @click="confirmPayment"
            :disabled="productData.stock === 0 || quantity <= 0 || paymentLoading"
            class="bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 rounded-lg mt-4 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <template v-if="paymentLoading">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </template>
            <template v-else>
              {{ productData.stock === 0 ? 'Stok Habis' : 'Konfirmasi' }}
            </template>
          </button>
        </div>
      </template>

    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <div class="text-center">
          <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
          <div class="flex gap-2 justify-center">
            <button 
              @click="retryFetch"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button 
              @click="$router.go(-1)"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const config = useRuntimeConfig()
const route = useRoute()
const backendURL2 = config.public.BACKEND_URL_2
const productId = ref(null)
const loading = ref(true)
const paymentLoading = ref(false)
const error = ref(null)

const productData = ref({
  id: null,
  name: '',
  description: '',
  imageUrl: '',
  stock: 0,
  price: 0
})

const quantity = ref(1)

const calculateTotal = computed(() => {
  return productData.value.price * quantity.value
})

// Watcher untuk memastikan kuantitas tidak melebihi stok atau kurang dari 1
watch(() => productData.value.stock, (newStock) => {
  if (quantity.value > newStock && newStock > 0) {
    quantity.value = newStock
  } else if (newStock === 0 && quantity.value > 0) {
    quantity.value = 0
  }
})

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1
  } else if (quantity.value > productData.value.stock) {
    quantity.value = productData.value.stock
  }
}

const fetchProduct = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await axios.get(`${backendURL2}/products/${productId.value}`, {
      withCredentials: true
    })
    
    if (response.data.success) {
      productData.value = response.data.data
      validateQuantity()
    } else {
      throw new Error(response.data.message || 'Gagal mengambil produk')
    }
  } catch (err) {
    console.error(`Produk dengan ID ${productId.value} tidak ditemukan:`, err)
    error.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data produk'
    
    // Set default data for not found product
    productData.value = {
      id: null,
      name: 'Produk Tidak Ditemukan',
      description: 'Mohon periksa ID produk.',
      imageUrl: 'https://via.placeholder.com/150/CCCCCC/000000?text=Not+Found',
      stock: 0,
      price: 0
    }
    quantity.value = 0
  } finally {
    loading.value = false
  }
}

const retryFetch = () => {
  error.value = null
  fetchProduct()
}

const confirmPayment = async () => {
  if (quantity.value <= 0) {
    alert('Jumlah beli harus lebih dari 0!')
    return
  }
  if (quantity.value > productData.value.stock) {
    alert(`Maaf, stok hanya tersedia ${productData.value.stock} unit.`)
    return
  }

  try {
    paymentLoading.value = true
    
    // Kirim data ke backend-1 (payment)
    const response = await axios.post(
      'http://localhost:3010/api/payments/create',
      {
        productId: productData.value.id,
        quantity: quantity.value,
      },
      {
        withCredentials: true // jika pakai auth cookie
      }
    )

    if (response.data.success && response.data.data.redirect_url) {
      // Redirect ke Midtrans Snap URL
      window.location.href = response.data.data.redirect_url
    } else {
      alert('Gagal membuat pembayaran!')
      console.error(response.data)
    }
  } catch (err) {
    alert('Terjadi kesalahan saat proses pembayaran.')
    console.error(err)
  } finally {
    paymentLoading.value = false
  }
}

onMounted(async () => {
  productId.value = route.params.id
  await fetchProduct()
})

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})
</script>

<style scoped>
.w-120 { width: 30rem; }
.h-120 { height: 30rem; }
@media (max-width: 640px) {
  .w-120 { width: 20rem; }
  .h-120 { height: 20rem; }
}
</style>