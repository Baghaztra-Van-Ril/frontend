<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Tambah Promo</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Pilih Produk</label>
        <select v-model="form.productId" @change="onProductChange" required class="w-full border rounded px-3 py-2">
          <option value="">-- Pilih Produk --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedProduct">
        <label class="block font-medium mb-1">Harga Produk</label>
        <p class="border border-gray-300 rounded px-3 py-2">{{ selectedProduct.price.toLocaleString('id-ID') }}</p>
      </div>

      <div>
        <label class="block font-medium mb-1">Diskon (%)</label>
        <input v-model.number="form.discount" type="number" min="0" max="100" required class="w-full border rounded px-3 py-2" />
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

const router = useRouter()

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
  // Saat produk dipilih, harga otomatis ditampilkan melalui `selectedProduct`
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/products')
    const data = await res.json()
    products.value = data
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal mengambil produk', '', 'error')
  }
})

const submitForm = async () => {
  if (!form.value.productId || !imageFile.value) {
    Swal.fire('Lengkapi semua data!', 'Gambar dan produk wajib diisi.', 'warning')
    return
  }

  const formData = new FormData()
  formData.append('productId', form.value.productId)
  formData.append('discount', form.value.discount)
  formData.append('isActive', form.value.isActive)
  formData.append('image', imageFile.value)

  try {
    const res = await fetch('http://localhost:5000/api/promos', {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error('Gagal')

    Swal.fire('Berhasil!', 'Promo berhasil ditambahkan.', 'success')
    router.push('/promo')
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal menambahkan promo', '', 'error')
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #EA580C; /* Tailwind orange-600 */
}
</style>
