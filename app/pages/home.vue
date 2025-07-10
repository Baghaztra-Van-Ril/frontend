<template>
  <div>
    <div class="mt-5" v-if="promos && promos.length > 0">
      <h1 class="text-2xl font-bold">Promo Untukmu</h1>
    </div>
    
    <div class="w-full px-4">
      <div v-if="promosLoading" class="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-gray-500">Memuat promo...</p>
        </div>
      </div>
      
      <ClientOnly>
        <Swiper
          v-if="promos && promos.length > 0"
          :modules="[Autoplay, Pagination]"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 3000 }"
          pagination
          class="w-full"
        >
          <SwiperSlide v-for="promo in promos" :key="promo.id">
            <PromoCard
              :image="promo.imageUrl || promo.product?.imageUrl"
              :original-price="promo.product?.price"
              :discount-price="calculateDiscountPrice(promo.product?.price, promo.discount)"
              :product-name="promo.product?.name"
              :discount-percentage="Math.round(parseFloat(promo.discount) * 100)"
              :product-id="promo.product?.id"
            />
          </SwiperSlide>
        </Swiper>
        <template #fallback>
          <div class="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Loading swiper...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="mt-5" v-if="products && products.length > 0">
      <h1 class="text-2xl font-bold">Produk Terbaru Kami</h1>
    </div>

    <div class="flex items-center space-x-4 w-full">
      <div class="ml-auto" v-if="products && products.length > 0">
        <UButton color="primary" to="/product">Lihat Semua Produk</UButton>
      </div>
    </div>

    <div v-if="productsLoading" class="max-w-6xl mx-auto py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-300 h-48 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div v-else-if="products && products.length > 0" class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-12">
      <template v-for="product in displayedProducts" :key="product.id">
        <NuxtLink :to="`/product/${ product.id }`" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <!-- Product Image -->
          <div class="relative">
            <img 
              :src="product.imageUrl || '/placeholder-image.jpg'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            
            <!-- Stats overlay -->
            <div class="absolute top-2 right-2 flex flex-col gap-1">
              <!-- Visit Count -->
              <div class="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ formatCount(product.visitCount) }}</span>
              </div>
              
              <!-- Favorite Count -->
              <div class="bg-red-500 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span>{{ formatCount(product._count?.favorites || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
              {{ product.name }}
            </h3>
            
            <div class="flex items-center justify-between">
              <p class="text-xl font-bold text-primary">
                Rp {{ formatPrice(product.price) }}
              </p>
            </div>
            
            <!-- Bottom Stats -->
            <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ product.visitCount }} kali dilihat
                </span>
                
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                  </svg>
                  {{ product._count?.favorites || 0 }} favorit
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </div>
    
    <div v-else-if="!productsLoading" class="max-w-6xl mx-auto py-12">
      <div class="text-center">
        <p class="text-gray-500">Belum ada produk tersedia</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const config = useRuntimeConfig()

// Fetch promos using useAsyncData
const { data: promosData, pending: promosLoading, error: promosError, refresh: refreshPromos } = await useAsyncData(
  'promos',
  async () => {
    try {
      if (!config.public?.BACKEND_URL_2) {
        throw new Error('Backend URL not configured')
      }
      
      const response = await $fetch(`${config.public.BACKEND_URL_2}/promos/active`, {
        timeout: 10000,
        retry: 2
      })
      
      if (response?.success && Array.isArray(response.data)) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Error fetching promos:', error)
      return []
    }
  },
  {
    server: false, // Client-side only
    default: () => [],
    transform: (data) => data || []
  }
)

// Fetch products using useAsyncData
const { data: productsData, pending: productsLoading, error: productsError, refresh: refreshProducts } = await useAsyncData(
  'products', 
  async () => {
    try {
      if (!config.public?.BACKEND_URL_2) {
        throw new Error('Backend URL not configured')
      }
      
      const response = await $fetch(`${config.public.BACKEND_URL_2}/products`, {
        timeout: 10000,
        retry: 2
      })
      
      if (response?.success && Array.isArray(response.data)) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },
  {
    server: false, // Client-side only
    default: () => [],
    transform: (data) => data || []
  }
)

// Reactive computed properties
const promos = computed(() => promosData.value || [])
const products = computed(() => productsData.value || [])

const displayedProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) return []
  return products.value.slice(0, 6)
})

// Utility functions
const calculateDiscountPrice = (originalPrice, discountPercentage) => {
  if (!originalPrice || !discountPercentage) return originalPrice
  const discount = parseFloat(discountPercentage)
  const discountAmount = originalPrice * discount
  return Math.round(originalPrice - discountAmount)
}

const formatPrice = (price) => {
  if (!price || typeof price !== 'number') return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatCount = (count) => {
  if (!count || typeof count !== 'number') return '0'
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

// Error handling
watch(promosError, (error) => {
  if (error) {
    console.error('Promos error:', error)
  }
})

watch(productsError, (error) => {
  if (error) {
    console.error('Products error:', error)
  }
})

// Refresh function for external use
const refreshData = async () => {
  await Promise.all([
    refreshPromos(),
    refreshProducts()
  ])
}

// Expose refresh function
defineExpose({
  refreshData,
  refreshPromos,
  refreshProducts
})

definePageMeta({
  layout: 'home'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>