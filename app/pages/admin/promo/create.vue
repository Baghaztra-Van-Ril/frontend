<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Tambah Promo</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Pilih Produk</label>
        <select v-model="form.productId" @change="onProductChange" required class="w-full border rounded px-3 py-2">
          <option value="">-- Pilih Produk --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name || product.title || product.productName || 'Unnamed Product' }}
          </option>
        </select>
        <!-- Debug info -->
        <p class="text-xs text-gray-500 mt-1">Total produk: {{ products.length }}</p>
      </div>

      <div v-if="selectedProduct">
        <label class="block font-medium mb-1">Harga Produk</label>
        <p class="border border-gray-300 rounded px-3 py-2">
          {{ (selectedProduct.price || selectedProduct.harga || 0).toLocaleString('id-ID') }}
        </p>
      </div>

      <div>
        <label class="block font-medium mb-1">Diskon (%)</label>
        <input v-model.number="form.discount" type="number" min="0" max="100" step="0.1" required class="w-full border rounded px-3 py-2" />
        <p class="text-sm text-gray-500 mt-1">Contoh: 10 untuk diskon 10%</p>
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.isActive" />
        <label class="font-medium">Promo Aktif</label>
      </div>

      <div>
        <label class="block font-medium mb-1">Banner Promo</label>
        <div
          class="w-full border-2 border-dashed border-gray-400 rounded p-6 text-center relative cursor-pointer"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <p class="text-gray-600">Seret gambar ke sini atau klik untuk memilih</p>

          <div v-if="imagePreview" class="mt-4 relative inline-block">
            <img :src="imagePreview" alt="Preview" class="max-h-40 rounded mx-auto" />
            <button
              @click.stop="clearImage"
              type="button"
              class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm"
            >
              &times;
            </button>
          </div>

          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          />
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" class="bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition">
          Simpan Promo
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import axios from 'axios'

const router = useRouter()

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_2 // atau sesuaikan jika kamu pakai _2

const products = ref([])
const form = ref({
  productId: '',
  discount: 0,
  isActive: false,
})

const imageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const selectedProduct = computed(() => {
  return products.value.find(p => p.id === form.value.productId) || null
})

const isImageFile = (file) => file && file.type.startsWith('image/')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  processFile(file)
}

const processFile = (file) => {
  if (isImageFile(file)) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    clearImage()
    Swal.fire('File tidak valid!', 'Hanya gambar yang diperbolehkan.', 'error')
  }
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = null
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const onProductChange = () => {
  // Harga ditampilkan otomatis melalui selectedProduct
}

onMounted(async () => {
  try {
    const response = await axios.get(`${backendURL}/products`, {
      withCredentials: true
    })
    
    // Debug: log response untuk melihat struktur data
    console.log('API Response:', response.data)
    
    // Periksa apakah response.data adalah array atau object
    if (Array.isArray(response.data)) {
      products.value = response.data
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Jika API mengembalikan format { data: [...] }
      products.value = response.data.data
    } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
      // Jika API mengembalikan format { products: [...] }
      products.value = response.data.products
    } else {
      console.error('Unexpected response format:', response.data)
      products.value = []
    }
    
    console.log('Products loaded:', products.value)
  } catch (err) {
    console.error('Error fetching products:', err)
    Swal.fire('Gagal mengambil produk', err.message || 'Terjadi kesalahan', 'error')
  }
})

const submitForm = async () => {
  if (!form.value.productId || !imageFile.value) {
    Swal.fire('Lengkapi semua data!', 'Gambar dan produk wajib diisi.', 'warning')
    return
  }

  // Validasi discount
  if (form.value.discount < 0 || form.value.discount > 100) {
    Swal.fire('Diskon tidak valid!', 'Diskon harus antara 0-100%.', 'warning')
    return
  }

  const formData = new FormData()
  formData.append('productId', form.value.productId.toString())
  
  // Konversi persentase ke desimal (contoh: 10% menjadi 0.1)
  const discountDecimal = form.value.discount / 100
  formData.append('discount', discountDecimal.toString())
  
  formData.append('isActive', form.value.isActive.toString())
  formData.append('image', imageFile.value)

  try {
    const res = await axios.post(`${backendURL}/promos`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    Swal.fire('Berhasil!', 'Promo berhasil ditambahkan.', 'success')
    router.push('/admin/promo') // sesuaikan dengan route halaman promo kamu
  } catch (err) {
    console.error(err)
    
    // Tambahkan error handling yang lebih spesifik
    if (err.response) {
      const errorMessage = err.response.data?.message || 'Gagal menambahkan promo'
      Swal.fire('Error!', errorMessage, 'error')
    } else if (err.request) {
      Swal.fire('Error!', 'Tidak dapat terhubung ke server', 'error')
    } else {
      Swal.fire('Error!', 'Terjadi kesalahan yang tidak terduga', 'error')
    }
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #EA580C; /* Tailwind orange-600 */
}
</style>