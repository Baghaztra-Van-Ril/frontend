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
        <img 
          :src="productData.imageUrl" 
          :alt="productData.name" 
          class="w-full h-full object-cover cursor-pointer select-none" 
          @error="handleImageError"
          @click="handleImageClick"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        />
        <div v-if="activePromo" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
          {{ Math.round((1 - parseFloat(activePromo.discount)) * 100) }}% OFF
        </div>
        <!-- Favorite Toggle Button - Top Left -->
        <button 
          @click="handleFavoriteToggle" 
          class="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-md"
          :disabled="favoriteLoading"
        >
          <HeartIcon 
            v-if="isFavorited" 
            class="w-6 h-6 text-red-500 fill-current" 
          />
          <HeartIcon 
            v-else 
            class="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" 
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </button>
        
        <!-- Double Tap Animation -->
        <div 
          v-if="showHeartAnimation" 
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <HeartIcon 
            class="w-16 h-16 text-red-500 fill-current animate-ping" 
            style="animation-duration: 0.6s;"
          />
        </div>
      </div>

      <!-- Favorite Count Display -->
      <div class="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        <HeartIcon class="w-5 h-5 mr-2 text-red-500" />
        <span class="font-medium">{{ favoriteCount }} Favorite</span>
      </div>

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

// Reactive variables for favorite functionality
const isFavorited = ref(false)
const favoriteCount = ref(0)
const favoriteLoading = ref(false)

// Double tap functionality
const showHeartAnimation = ref(false)
const lastTapTime = ref(0)
const tapTimeout = ref(null)
const DOUBLE_TAP_DELAY = 300 // milliseconds

// Touch handling for mobile
const touchStartTime = ref(0)
const touchEndTime = ref(0)

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
      // Update favorite state from API response
      isFavorited.value = data.data.isFavorited
      favoriteCount.value = data.data._count?.favorites || 0
      return data.data
    } else {
      throw new Error(data.message || 'Gagal mengambil produk')
    }
  },
  {
    watch: [productId],
  }
)

// Handle favorite toggle
const handleFavoriteToggle = async () => {
  if (favoriteLoading.value) return
  
  favoriteLoading.value = true
  
  try {
    const response = await axios.post(`${backendURL2}/favorites`, {
      productId: productId.value
    }, {
      withCredentials: true,
    })

    if (response.data.success) {
      // Toggle favorite state
      isFavorited.value = !isFavorited.value
      
      // Update count based on action
      if (isFavorited.value) {
        favoriteCount.value += 1
      } else {
        favoriteCount.value = Math.max(0, favoriteCount.value - 1)
      }
      
      console.log('Berhasil toggle favorit:', response.data.message)
    } else {
      console.warn('Gagal toggle favorit:', response.data.message)
      alert('Gagal mengubah status favorit: ' + response.data.message)
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat toggle favorit:', error)
    
    // Handle different error types
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message
      
      if (status === 404) {
        alert('Endpoint tidak ditemukan. Periksa URL backend.')
      } else if (status === 500) {
        alert('Server error. Silakan coba lagi nanti.')
      } else {
        alert(`Gagal mengubah status favorit: ${message}`)
      }
    } else if (error.request) {
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet.')
    } else {
      alert('Terjadi kesalahan yang tidak diketahui.')
    }
  } finally {
    favoriteLoading.value = false
  }
}

// Handle double tap on image (for desktop)
const handleImageClick = (event) => {
  event.preventDefault()
  
  const currentTime = Date.now()
  const timeSinceLastTap = currentTime - lastTapTime.value
  
  if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
    // Double tap detected
    handleDoubleTap()
    clearTimeout(tapTimeout.value)
  } else {
    // Single tap - wait to see if there's a second tap
    lastTapTime.value = currentTime
    tapTimeout.value = setTimeout(() => {
      // Single tap action (if needed)
      console.log('Single tap on image')
    }, DOUBLE_TAP_DELAY)
  }
}

// Handle touch events for mobile
const handleTouchStart = (event) => {
  touchStartTime.value = Date.now()
}

const handleTouchEnd = (event) => {
  event.preventDefault()
  touchEndTime.value = Date.now()
  
  // Prevent if touch was too long (likely a drag/scroll)
  if (touchEndTime.value - touchStartTime.value > 200) {
    return
  }
  
  const currentTime = Date.now()
  const timeSinceLastTap = currentTime - lastTapTime.value
  
  if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
    // Double tap detected
    handleDoubleTap()
    clearTimeout(tapTimeout.value)
  } else {
    // Single tap - wait to see if there's a second tap
    lastTapTime.value = currentTime
    tapTimeout.value = setTimeout(() => {
      // Single tap action (if needed)
      console.log('Single tap on image')
    }, DOUBLE_TAP_DELAY)
  }
}

// Handle double tap action
const handleDoubleTap = () => {
  console.log('Double tap detected!')
  
  // Show heart animation
  showHeartAnimation.value = true
  
  // Hide animation after 600ms
  setTimeout(() => {
    showHeartAnimation.value = false
  }, 600)
  
  // Toggle favorite
  handleFavoriteToggle()
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