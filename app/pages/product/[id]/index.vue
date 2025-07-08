<template>
  <div class="bg-gray-200 dark:bg-gray-900 flex justify-center p-6">
    <div v-if="pending" class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col items-center gap-6 w-full h-full">
      <div class="w-120 h-120 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
      <div class="w-32 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      <div class="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      <div class="w-64 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
    </div>

    <div v-else-if="error" class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col items-center gap-6 w-full h-full">
      <div class="w-120 h-120 border-4 border-red-500 rounded-xl overflow-hidden flex justify-center items-center">
        <div class="text-red-500 text-center">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-semibold">Produk Tidak Ditemukan</p>
        </div>
      </div>
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error.message || 'Gagal memuat produk' }}</p>
        <button @click="refresh()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Coba Lagi</button>
      </div>
    </div>

    <div v-else-if="productData" class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col items-center gap-6 w-full h-full">
      <div class="w-120 h-120 border-4 border-blue-500 rounded-xl overflow-hidden flex justify-center items-center relative">
        <img :src="productData.imageUrl" :alt="productData.name" class="w-full h-full object-cover" @error="handleImageError" />
        <div v-if="activePromo" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
          {{ Math.round((1 - parseFloat(activePromo.discount)) * 100) }}% OFF
        </div>
      </div>

      <button @click="handleFavorite" class="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
        <HeartIcon class="w-6 h-6 mr-2" /> {{ favoriteCount }}k Favorite
      </button>

      <div class="flex flex-col items-center text-center gap-2">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ productData.name }}</h2>
        <div class="flex items-center gap-2">
          <p v-if="activePromo" class="text-lg text-gray-500 dark:text-gray-400 line-through">Rp.{{ productData.price.toLocaleString('id-ID') }},-</p>
          <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">Rp.{{ finalPrice.toLocaleString('id-ID') }},-</p>
        </div>
        <p class="text-gray-600 dark:text-gray-300">Stok: {{ productData.stock }}</p>
        <p class="text-gray-600 dark:text-gray-300">Ukuran: {{ productData.size }}</p>
        <p class="text-gray-600 dark:text-gray-300">Dilihat: {{ productData.visitCount }} kali</p>
        <p class="text-gray-700 dark:text-gray-400 mt-2">{{ productData.description }}</p>
      </div>

      <div class="mt-4">
        <button
          @click="handleBuy"
          :disabled="productData.stock === 0"
          class="flex items-center justify-center px-6 py-3 rounded-lg transition"
          :class="productData.stock === 0 ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-orange-500 hover:bg-orange-600 text-white'"
        >
          <ShoppingCartIcon class="w-6 h-6 mr-2" /> {{ productData.stock === 0 ? 'Stok Habis' : 'Beli' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const backendURL2 = config.public.BACKEND_URL_2
const backendURL1 = config.public.BACKEND_URL_1
const id = computed(() => route.params.id)

const productId = computed(() => route.params.id)
const favoriteCount = ref(72)

const activePromo = computed(() => {
  if (!productData.value?.promo) return null
  return productData.value.promo.find(promo => promo.isActive)
})

const finalPrice = computed(() => {
  if (!productData.value) return 0
  if (!activePromo.value) return productData.value.price
  const discount = parseFloat(activePromo.value.discount)
  return Math.round(productData.value.price * discount)
})

const { data: productData, pending, error, refresh } = await useAsyncData(
  'fetch-product',
  async () => {
    const response = await axios.get(`${backendURL2}/products/${productId.value}`,{
       withCredentials: true
    })
    const data = response.data
    console.log(data.data)
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || 'Gagal mengambil produk')
    }
  },
  {
    watch: [productId],
  }
)


const handleFavorite = async () => {
  try {
    // Make sure you're using the correct backend URL
    const config = useRuntimeConfig()
    const backendURL = config.public.BACKEND_URL_2 // or whatever your correct config key is
    console.log(productId.value)
    const response = await axios.post(`${backendURL2}/favorites`, { // Remove trailing slash
      // userId: userId,        // Pass as parameter instead of hardcoding
      productId: productId.value   // Pass as parameter instead of hardcoding
    }, {
      withCredentials: true,
    })

    if (response.data.success) {
      console.log('Berhasil difavoritkan:', response.data.message)
      // Add user feedback
      alert('Produk berhasil ditambahkan ke favorit!')
      // Or use a toast notification if you have one
    } else {
      console.warn('Gagal favorit:', response.data.message)
      alert('Gagal menambahkan ke favorit: ' + response.data.message)
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat memfavoritkan:', error)
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.message
      
      if (status === 404) {
        alert('Endpoint tidak ditemukan. Periksa URL backend.')
      } else if (status === 401) {
        alert('Unauthorized. Silakan login kembali.')
      } else if (status === 500) {
        alert('Server error. Silakan coba lagi nanti.')
      } else {
        alert(`Gagal memfavoritkan: ${message}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet.')
    } else {
      // Something else happened
      alert('Terjadi kesalahan yang tidak diketahui.')
    }
  }
}
const handleBuy = async () => {
  const currentProductId = route.params.id || id.value
  
  if (!currentProductId) {
    console.error('Product ID tidak ditemukan')
    return
  }

  const redirectPath = `/product/${currentProductId}/payment`

  try {
    const res = await axios.get(`${backendURL1}/auth/me`, {
      withCredentials: true,
    })

    if (res.status === 200 || res.status === 304) {
      await router.push(redirectPath)
    }
    console.log("redirect", redirectPath)
  } catch (err) {
    console.error('Error saat cek login:', err)
    
    if (typeof window !== 'undefined') {
      window.location.href = `${backendURL1}/auth/google?redirect=${redirectPath}`
    }
  }
}


// Usage example:
// handleFavorite(7, 1) // productId: 7, userId: 1


const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=No+Image'
}

useSeoMeta({
  title: () => productData.value?.name || 'Loading Product...',
  ogTitle: () => productData.value?.name || 'Product Detail',
  description: () => productData.value?.description || 'Product description',
  ogDescription: () => productData.value?.description || 'Product description',
  ogImage: () => productData.value?.imageUrl || '',
})

definePageMeta({
  layout: 'home'
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