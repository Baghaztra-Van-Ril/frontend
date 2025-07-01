<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen Sepatu</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ products.length }} produk
          </span>
        </div>
        <NuxtLink
          to="/admin/barang/create"
          class="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition"
        >
          + Tambah Produk
        </NuxtLink>

      </div>
      <table class="min-w-full border border-gray-200 dark:text-gray-200 rounded-lg shadow">
        <thead class="bg-primary text-gray-50 text-left">
          <tr>
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Nama</th>
            <th class="px-4 py-2">Deskripsi</th>
            <th class="px-4 py-2">Gambar</th>
            <th class="px-4 py-2">Stok</th>
            <th class="px-4 py-2">Ukuran</th>
            <th class="px-4 py-2">Harga</th>
            <th class="px-4 py-2">Kunjungan</th>
            <th class="p-4 py-2">Favorite</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in paginatedProducts"
            :key="product.id"
            class="border-t hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            <td class="px-4 py-2">{{ product.id }}</td>
            <td class="px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2">{{ product.description }}</td>
            <td class="px-4 py-2">
              <img
                :src="product.imageUrl"
                alt="sepatu"
                class="w-16 h-16 rounded-md object-cover border"
              />
            </td>
            <td class="px-4 py-2">{{ product.stock }}</td>
            <td class="px-4 py-2">{{ product.size }}</td>
            <td class="px-4 py-2 text-green-600 font-semibold">
              Rp {{ product.price.toLocaleString("id-ID") }}
            </td>
            <td class="px-4 py-2">{{ product.visitCount }}</td>
            <td class="px-4 py-2">{{ product.favorite}}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/admin/barang/${product.id}`"
                  class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="handleDelete(product.id)"
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
        <
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
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import axios from 'axios'

definePageMeta({
  layout: 'admin'
})

// Access runtime config
const config = useRuntimeConfig()

// Make products reactive
const products = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${config.public.BACKEND_URL_2}/products`)
    products.value = response.data.data || response.data
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Gagal mengambil data produk'
    
    // Fallback to hardcoded data if API fails
  } finally {
    loading.value = false
  }
}

// Delete product function with API call
const handleDelete = async (productId) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus produk ini?',
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
      // Call API to delete product
      await axios.delete(`${config.public.BACKEND_URL_2}/products/${productId}`,{
        withCredentials:true
      })
      const me = axios.get(`${config.public.BACKEND_URL_1}/auth/me`, {
         withCredentials:true
      })

      console.log("me",me)
      
      // Remove from local array
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
      
      Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success')
    } catch (err) {
      console.error('Error deleting product:', err)
      Swal.fire('Error!', 'Gagal menghapus produk.', 'error')
    }
  }
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > products.value.length ? products.value.length : end
})

// Fetch data on component mount
onMounted(() => {
  fetchProducts()
})

// Expose refresh function for manual refresh
const refreshProducts = () => {
  fetchProducts()
}

// Export functions that might be needed in template
defineExpose({
  refreshProducts,
  fetchProducts
})
</script>
