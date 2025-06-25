<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Produk Kami</h1>

    <!-- Grid Produk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id + '-' + product.name"
        :id="product.id"
        :image="product.image"
        :productName="product.name"
        :price="product.price"
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-8 gap-4 items-center">
  <!-- Tombol Prev -->
  <button
    @click="currentPage--"
    :disabled="currentPage === 1"
    class="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    <span><</span>
  </button>

  <!-- Info Halaman -->
  <span class="font-semibold text-gray-700 px-2">
    Halaman {{ currentPage }} / {{ totalPages }}
  </span>

  <!-- Tombol Next -->
  <button
    @click="currentPage++"
    :disabled="currentPage === totalPages"
    class="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    <span>></span>
  </button>
</div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentPage = ref(1)
const itemsPerPage = 8

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High quality sound, noise cancelling.',
    price: 99.99,
    image: 'https://picsum.photos/200/300'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Track your fitness and notifications.',
    price: 149.99,
    image: 'https://picsum.photos/200/300'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    description: 'Portable and powerful sound.',
    price: 59.99,
    image: 'https://picsum.photos/200/300'
  },
  // Duplikasikan agar data lebih banyak
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    name: `Produk ${i + 4}`,
    description: 'Deskripsi produk',
    price: 49.99 + i,
    image: 'https://picsum.photos/200/300'
  }))
]

const totalPages = computed(() =>
  Math.ceil(products.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.slice(start, start + itemsPerPage)
})

definePageMeta({
  layout: 'home'
})
</script>
