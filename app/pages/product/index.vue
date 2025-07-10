<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Produk Kami</h1>
      
      <div class="flex items-center space-x-4 pt-5">
        <span class="text-gray-600" v-if="!loading">
          {{ products.length }} produk ditemukan
        </span>
        
        <div class="flex items-center space-x-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="searchProducts"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button
            type="button"
            class="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
            @click="searchProducts"
            aria-label="Cari"
          > 
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">Gagal Memuat Produk</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchProducts" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-12">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V9a4 4 0 00-4-4H9a4 4 0 00-4 4v4h14z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">
          {{ searchQuery ? 'Produk Tidak Ditemukan' : 'Belum Ada Produk' }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery 
            ? `Tidak ada produk yang cocok dengan "${searchQuery}"` 
            : 'Belum ada produk yang tersedia saat ini'
          }}
        </p>
        <button 
          v-if="searchQuery"
          @click="clearSearch" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lihat Semua Produk
        </button>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <template v-for="product in paginatedProducts" :key="product.id">
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

              <!-- Stock Badge -->
              <div class="absolute top-2 left-2">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis' }}
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                {{ product.name }}
              </h3>
              
              <div class="flex items-center justify-between mb-3">
                <p class="text-xl font-bold text-primary">
                  Rp {{ formatPrice(product.price) }}
                </p>
              </div>
              
              <!-- Bottom Stats -->
              <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ product.visitCount || 0 }} views
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
        Menampilkan {{ startIndex + 1 }}-{{ Math.min(endIndex, products.length) }} 
        dari {{ products.length }} produk
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const config = useRuntimeConfig()

const products = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(8)
const searchQuery = ref('')

const totalPages = computed(() =>
  Math.ceil(products.value.length / itemsPerPage.value)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return products.value.slice(start, start + itemsPerPage.value)
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count?.toString() || '0'
}

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch(`${config.public.BACKEND_URL_2}/products/`)
    
    if (response.success) {
      products.value = response.data.filter(product => !product.isDeleted)
    } else {
      throw new Error(response.message || 'Gagal mengambil data produk')
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = err.message || 'Terjadi kesalahan saat mengambil data produk'
    products.value = []
  } finally {
    loading.value = false
  }
}

const searchProducts = async () => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    await fetchProducts()
    return
  }
  try {
    loading.value = true
    error.value = null
    currentPage.value = 1
    
    const url = `${config.public.BACKEND_URL_2}/products/search/`
    const params = searchQuery.value ? { q: searchQuery.value } : {}
    
    const response = await $fetch(url, { params })
    
    if (response.success) {
      products.value = response.data
      console.log("saas",products.value)
    } else {
      throw new Error(response.message || 'Gagal mengambil data produk')
    }
  } catch (err) {
    console.error('Error searching products:', err)
    error.value = err.message || 'Terjadi kesalahan saat mencari produk'
    products.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})

definePageMeta({
  layout: 'home'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>