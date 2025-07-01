<template>
  <div>
    <div class="mt-5" v-if="promos.length > 0">
      <h1 class="text-2xl font-bold">Promo Untukmu</h1>
    </div>
    
    <div class="w-full px-4">
      <div v-if="promosLoading" class="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-gray-500">Memuat promo...</p>
        </div>
      </div>
      
      <Swiper
        v-else-if="promos.length > 0"
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
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="mt-5" v-if="products.length > 0">
      <h1 class="text-2xl font-bold">Produk Terbaru Kami</h1>
    </div>

    <div class="flex items-center space-x-4 w-full">
      <div class="ml-auto" v-if="products.length > 0">
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

    <div v-else-if="products.length > 0" class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-12">
      <template v-for="product in displayedProducts" :key="product.id">
        <ProductCard
          :id="product.id"
          :image="product.imageUrl"
          :productName="product.name"
          :price="product.price"
        />
      </template>
    </div>
    <div v-else class="max-w-6xl mx-auto py-12">
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

const promos = ref([])
const products = ref([])
const promosLoading = ref(true)
const productsLoading = ref(true)

const displayedProducts = computed(() => {
  return products.value.slice(0, 6)
})

const calculateDiscountPrice = (originalPrice, discountPercentage) => {
  if (!originalPrice || !discountPercentage) return originalPrice
  const discount = parseFloat(discountPercentage)
  const discountAmount = originalPrice * discount
  return Math.round(originalPrice - discountAmount)
}

const refreshPromos = async () => {
  await fetchPromos()
}

const fetchPromos = async () => {
  try {
    promosLoading.value = true
    const response = await $fetch(`${config.public.BACKEND_URL_2}/promos/active`)
    
    if (response.success) {
      promos.value = response.data
    }
  } catch (error) {
    console.error('Error fetching promos:', error)
    promos.value = []
  } finally {
    promosLoading.value = false
  }
}

const fetchProducts = async () => {
  try {
    productsLoading.value = true
    const response = await $fetch(`${config.public.BACKEND_URL_2}/products`)
    
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    productsLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchPromos(),
    fetchProducts()
  ])
})

definePageMeta({
  layout: 'home',
})
</script>