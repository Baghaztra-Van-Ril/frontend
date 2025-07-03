<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Promo</h1>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      Memuat data promo...
    </div>

    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Pilih Produk</label>
        
        <!-- Tampilkan produk yang sedang dipilih -->
        <div v-if="selectedProduct" class="mb-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-medium text-blue-800">Produk Saat Ini:</span>
              <span class="text-blue-700">{{ selectedProduct.name }}</span>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200"
              >
              </button>
            </div>
          </div>
        </div>

        <select
          v-model="form.productId"
          required
          class="w-full border border-gray-300 rounded px-3 py-2"
          @change="onProductChange"
        >
          <option value="">Pilih Produk</option>
          <option
            v-for="product in products"
            :key="product.id"
            :value="product.id"
            :class="{ 'bg-blue-50 font-medium': product.id === form.productId }"
          >
            {{ product.name }}
            {{ product.id === form.productId ? '(Sedang Dipilih)' : '' }}
          </option>
        </select>
      </div>

      <div>
        <label class="block font-medium mb-1">Diskon (%)</label>
        <input
          v-model.number="form.discount"
          type="number"
          min="0"
          max="100"
          required
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <!-- Status Aktif -->
      <div>
        <label class="block font-medium mb-1">Status Promo</label>
        <div class="flex items-center gap-4">
          <label class="flex items-center">
            <input
              v-model="form.isActive"
              type="radio"
              :value="true"
              class="mr-2"
            />
            Aktif
          </label>
          <label class="flex items-center">
            <input
              v-model="form.isActive"
              type="radio"
              :value="false"
              class="mr-2"
            />
            Tidak Aktif
          </label>
        </div>
      </div>

      <!-- Upload Gambar -->
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

          <!-- Gambar Preview Baru -->
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

          <!-- File Tidak Valid -->
          <div v-else-if="invalidFile" class="mt-4 text-red-600 flex justify-center items-center gap-2">
            File tidak valid! Hanya gambar yang diperbolehkan.
            <button @click.stop="clearImage" type="button" class="bg-red-600 text-white rounded px-2 py-0.5 text-sm">
              &times;
            </button>
          </div>

          <!-- Gambar Lama -->
          <div v-else-if="form.image" class="mt-4">
            <img :src="form.image" alt="Gambar Lama" class="max-h-40 rounded mx-auto" />
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_2

const router = useRouter()
const route = useRoute()
const id = route.params.id

const isLoading = ref(true)

const form = ref({
  productId: '',
  discount: 0,
  image: '',
  isActive: true
})

const products = ref([])
const imageFile = ref(null)
const imagePreview = ref(null)
const invalidFile = ref(false)
const fileInput = ref(null)

// Computed property untuk mendapatkan produk yang sedang dipilih
const selectedProduct = computed(() => {
  return products.value.find(product => product.id === form.value.productId)
})

const isImageFile = (file) => file && file.type.startsWith('image/')

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${backendURL}/products`, {
      withCredentials: true,
    })
    products.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
}

const fetchPromo = async () => {
  try {
    const res = await axios.get(`${backendURL}/promos/${id}`, {
      withCredentials: true,
    })
    const data = res.data
    form.value = {
      productId: data.productId,
      discount: data.discount * 100,
      image: data.image,
      isActive: data.isActive ?? true
    }
  } catch (err) {
    console.error('Gagal memuat promo:', err)
  }
}

onMounted(async () => {
  isLoading.value = true
  await fetchProducts()
  await fetchPromo()
  isLoading.value = false
})

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
    invalidFile.value = false
  } else {
    clearImage()
    invalidFile.value = true
  }
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = null
  invalidFile.value = false
  if (fileInput.value) {
    fileInput.value.value = null
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const onProductChange = () => {
  // Ketika produk berubah, bisa ditambahkan logic tambahan di sini
  console.log('Produk dipilih:', form.value.productId)
}

const editProduct = () => {
  if (form.value.productId) {
    // Navigasi ke halaman edit produk dengan ID yang dipilih
    router.push(`/admin/products/edit/${form.value.productId}`)
  }
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('discount', (form.value.discount / 100).toString())
    formData.append('isActive', form.value.isActive.toString())

    if (form.value.productId) {
      formData.append('productId', form.value.productId)
    }

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    await axios.put(`${backendURL}/promos/${id}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    alert('Promo berhasil diupdate!')
    router.push('/admin/promo')
  } catch (err) {
    console.error('Error details:', err.response?.data || err.message)
    alert(`Gagal mengupdate promo: ${err.response?.data?.message || err.message}`)
  }
}
</script>