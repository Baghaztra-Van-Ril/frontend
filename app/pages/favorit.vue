<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-6xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold mb-6 text-center">Produk Favorit</h1>

      <div v-if="loading" class="text-center text-gray-500">Memuat data...</div>
      <div v-else-if="favorites.length === 0" class="text-center text-gray-500">Belum ada produk favorit.</div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="fav in favorites"
          :key="fav.id"
          :to="`/product/${fav.product?.id}`"
          class="bg-white p-4 rounded shadow text-center hover:shadow-lg transition duration-200 hover:scale-[1.02]"
        >
          <img
            :src="fav.product?.imageUrl"
            alt="Gambar Produk"
            class="w-full h-40 object-cover rounded mb-4"
          />
          <p class="font-medium text-gray-800">
            {{ fav.product?.name || 'Nama Produk' }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>



<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_2

const favorites = ref([])
const loading = ref(true)

const fetchFavorites = async () => {
  try {
    const response = await axios.get(`${backendURL}/favorites`, {
      withCredentials: true
    })
    if (Array.isArray(response.data.data)) {
      favorites.value = response.data.data
    } else {
      favorites.value = [response.data.data]
    }
  } catch (error) {
    console.error('Gagal mengambil data favorit:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

definePageMeta({
  layout: 'home',
})

onMounted(fetchFavorites)
</script>
