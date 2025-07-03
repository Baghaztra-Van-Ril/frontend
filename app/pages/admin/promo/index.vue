<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Kelola Promo</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan {{ startItem }} - {{ endItem }} dari {{ promos.length }} promo
        </span>
        <NuxtLink
          to="/admin/promo/create"
          class="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition"
        >
          + Tambah Promo
        </NuxtLink>
      </div>

      <table class="min-w-full border border-gray-200 dark:text-gray-200 rounded-lg shadow">
        <thead class="bg-primary text-gray-50 text-left">
          <tr>
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Gambar</th>
            <th class="px-4 py-2">Merk Sepatu</th>
            <th class="px-4 py-2">Harga</th>
            <th class="px-4 py-2">Diskon</th>
            <th class="px-4 py-2">Harga Setelah Diskon</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="promo in paginatedPromos"
            :key="promo.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 text-gray-500 dark:text-gray-200 font-semibold">{{ promo.id }}</td>
            <td class="px-4 py-2">
              <img
                :src="promo.imageUrl"
                alt="promo"
                class="w-16 h-16 rounded-md object-cover border"
              />
            </td>
            <td class="px-4 py-2 text-gray-500 dark:text-gray-200 font-semibold">
              {{ promo.product?.name || 'N/A' }}
            </td>
            <td class="px-4 py-2 text-gray-500 line-through dark:text-gray-200 font-semibold">
              Rp.{{ formatPrice(promo.product?.price) }}
            </td>
            <td class="px-4 py-2 text-red-600 font-semibold">
              {{ formatDiscount(promo.discount) }}%
            </td>
            <td class="px-4 py-2 text-green-600 font-semibold">
              Rp.{{ calculateDiscountedPrice(promo.product?.price, promo.discount) }}
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/admin/promo/${promo.id}`"
                  class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="handleDelete(promo.id)"
                  class="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end mt-6 gap-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="['px-3 py-1 border rounded', currentPage === page ? 'bg-primary text-white' : '']"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_2

const promos = ref([])

const fetchPromos = async () => {
  console.log('PROMO DATA:', promos.value)
  
  try {
    const response = await axios.get(`${backendURL}/promos`, {
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    // Periksa apakah respons memiliki key 'data'
    if (Array.isArray(response.data.data)) {
      promos.value = response.data.data
    } else {
      console.warn('Format data tidak sesuai:', response.data)
    }
  } catch (error) {
    console.error('Gagal mengambil data promo:', error)
  }
}

onMounted(() => {
  fetchPromos()
})

const handleDelete = async (promoId) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus promo ini?',
    text: 'Data yang dihapus tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${backendURL}/promos/${promoId}`, {
        withCredentials: true
      })
      promos.value = promos.value.filter(p => p.id !== promoId)
      Swal.fire('Terhapus!', 'Promo telah dihapus.', 'success')
    } catch (error) {
      console.error('Gagal menghapus promo:', error)
      Swal.fire('Gagal!', 'Gagal menghapus promo.', 'error')
    }
  }
}

// Helper functions untuk format data
const formatPrice = (price) => {
  if (!price || price === 0) return 'N/A'
  return price.toLocaleString('id-ID')
}

const formatDiscount = (discount) => {
  if (!discount || discount === 0) return '0'
  // Pastikan nilai diskon sudah dalam format yang benar
  const discountValue = Number(discount*100)
  return discountValue.toString()
}

const calculateDiscountedPrice = (price, discount) => {
  if (!price || !discount) return 'N/A'
  
  const originalPrice = Number(price)
  const discountPercent = Number(discount)
  
  // Validasi input
  if (isNaN(originalPrice) || isNaN(discountPercent)) return 'N/A'
  
  // Hitung harga setelah diskon
  const discountedPrice = originalPrice * (1 - discountPercent)
  
  return discountedPrice.toLocaleString('id-ID')
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(promos.value.length / itemsPerPage))

const paginatedPromos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return promos.value.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > promos.value.length ? promos.value.length : end
})
</script>