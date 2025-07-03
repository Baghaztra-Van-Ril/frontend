<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Tambah Produk Baru</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Input lainnya tetap -->
      <div>
        <label class="block font-medium mb-1">Nama Produk</label>
        <input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <div>
        <label class="block font-medium mb-1">Deskripsi</label>
        <textarea v-model="form.description" rows="3" required class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
      </div>

      <div>
        <label class="block font-medium mb-1">Stok</label>
        <input v-model.number="form.stock" type="number" min="0" required class="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <div>
        <label class="block font-medium mb-1">Ukuran</label>
        <input v-model="form.size" type="number" required class="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <div>
        <label class="block font-medium mb-1">Harga</label>
        <input v-model.number="form.price" type="number" min="0" required class="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <!-- Gambar (drag and drop + validasi) -->
      <div>
        <label class="block font-medium mb-1">Gambar Produk</label>
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

          <div v-else-if="invalidFile" class="mt-4 text-red-600 flex justify-center items-center gap-2">
            File tidak valid! Hanya gambar yang diperbolehkan.
            <button
              @click.stop="clearImage"
              type="button"
              class="bg-red-600 text-white rounded px-2 py-0.5 text-sm"
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
          Simpan Produk
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_2

const form = ref({
  name: '',
  description: '',
  stock: 0,
  size: '',
  price: 0
})

const imageFile = ref(null)
const imagePreview = ref(null)
const invalidFile = ref(false)
const fileInput = ref(null)

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

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('stock', form.value.stock)
    formData.append('size', form.value.size)
    formData.append('price', form.value.price)
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    const response = await axios.post(`${backendURL}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    })

    console.log('Produk ditambahkan:', response.data)

    alert('Produk berhasil ditambahkan!')
    router.push('/product')
  } catch (err) {
    console.error('Gagal menambahkan produk:', err)
    alert('Gagal menambahkan produk.')
  }
}
</script>

