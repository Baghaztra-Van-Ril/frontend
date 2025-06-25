<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen Barang</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ products.length }} produk
          </span>
        </div>
        <button
        @click="tambahProduk"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition"
        >
          + Tambah Produk
        </button>
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
            class="border-t hover:bg-gray-50"
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
                <button
                  class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900"
                >
                  Edit
                </button>
                <button
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
definePageMeta({
  layout: 'admin'
})

const products = [
  {
    id: 1,
    name: 'Sepatu Keren',
    description: 'Sepatu running nyaman dan stylish',
    imageUrl: 'https://picsum.photos/200/200?1',
    stock: 20,
    size: 42,
    price: 350000,
    favorite: 10,
    visitCount: 132,
  },
  {
    id: 2,
    name: 'Sneakers Putih',
    description: 'Cocok untuk sehari-hari',
    imageUrl: 'https://picsum.photos/200/200?2',
    stock: 15,
    size: 41,
    price: 275000,
    favorite: 12,
    visitCount: 98,
  },
  {
    id: 3,
    name: 'Sepatu Kulit',
    description: 'Elegan untuk acara formal',
    imageUrl: 'https://picsum.photos/200/200?3',
    stock: 10,
    size: 43,
    price: 500000,
    favorite: 41,
    visitCount: 54,
  },
]

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(products.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > products.length ? products.length : end
})

const tambahProduk = () => {
  alert("Navigasi ke halaman tambah produk atau tampilkan modal form")
}
</script>
