<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Promo</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Pilih Produk</label>
        <select
          v-model="form.productId"
          required
          class="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="" disabled>Pilih Produk</option>
          <option v-for="product in products" :key="product._id" :value="product._id">
            {{ product.name }}
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({
  productId: '',
  discount: 0,
  image: ''
})

const products = ref([])
const imageFile = ref(null)
const imagePreview = ref(null)
const invalidFile = ref(false)
const fileInput = ref(null)

const isImageFile = (file) => file && file.type.startsWith('image/')

const fetchPromo = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/promos/${id}`)
    const data = await res.json()
    form.value = {
      productId: data.productId,
      discount: data.discount * 100, // jika disimpan dalam bentuk 0.2
      image: data.image,
    }
  } catch (err) {
    console.error('Gagal memuat promo:', err)
  }
}

const fetchProducts = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/products`)
    products.value = await res.json()
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
}

onMounted(() => {
  fetchPromo()
  fetchProducts()
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

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('productId', form.value.productId)
    formData.append('discount', form.value.discount / 100) // konversi kembali ke 0.xx
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    await fetch(`http://localhost:5000/api/promos/${id}`, {
      method: 'PUT',
      body: formData,
    })

    alert('Promo berhasil diupdate!')
    router.push('/admin/promo')
  } catch (err) {
    console.error(err)
    alert('Gagal mengupdate promo.')
  }
}
</script>
