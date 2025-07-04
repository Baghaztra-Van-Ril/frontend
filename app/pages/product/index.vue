<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Produk Kami</h1>
      
      <!-- Product count and filters -->
      <div class="flex items-center space-x-4 pt-5">
        <span class="text-gray-600" v-if="!loading">
          {{ products.length }} produk ditemukan
        </span>
        
        <!-- Search input -->
        <div class="flex items-center space-x-2">
      
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <Ubutton
            type="button"
            class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="searchProducts"
            aria-label="Cari"
          > 
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
          </Ubutton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
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

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0 && !loading" class="text-center py-12">
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
          @click="searchQuery = ''" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lihat Semua Produk
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :id="product.id"
          :image="product.imageUrl"
          :productName="product.name"
          :price="product.price"
          :stock="product.stock"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-4 items-center">
        <!-- Tombol Prev -->
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

        <!-- Page Numbers -->
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

        <!-- Info Halaman -->
        <span class="font-semibold text-gray-700 px-2">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <!-- Tombol Next -->
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

      <!-- Products per page info -->
      <div class="text-center mt-4 text-sm text-gray-600">
        Menampilkan {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredProducts.length) }} 
        dari {{ filteredProducts.length }} produk
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted, watch } from 'vue'

// Get runtime config
const config = useRuntimeConfig()

// Reactive data
const products = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(8)
const searchQuery = ref('')

// Computed properties
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  axios.get(`${config.public.BACKEND_URL_2}/products`, {
    params: { q: searchQuery.value }
  })  
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => currentPage.value * itemsPerPage.value)

// Visible page numbers for pagination
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


// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch(`${config.public.BACKEND_URL_2}/products`)
    
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
  try {
    loading.value = true
    error.value = null
    const response = await $fetch(`${config.public.BACKEND_URL_2}/products`, {
      params: { q: searchQuery.value }
    })
    
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

// Fetch data on component mount
onMounted(() => {
  fetchProducts()
})

definePageMeta({
  layout: 'home'
})
</script>