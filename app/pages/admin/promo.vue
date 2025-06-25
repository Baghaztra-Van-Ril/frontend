<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Kelola Promo</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan {{ startItem }} - {{ endItem }} dari {{ promos.length }} promo
        </span>
        <button
          @click="tambahPromo"
          class="bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition"
        >
          + Tambah Promo
        </button>
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
            <td class="px-4 py-2">{{ promo.id }}</td>
            <td class="px-4 py-2">
              <img
                :src="promo.imageUrl"
                alt="promo"
                class="w-16 h-16 rounded-md object-cover border"
              />
            </td>
            <td class="px-4 py-2">{{ promo.productName }}</td>
            <td class="px-4 py-2 text-gray-500 line-through">
              Rp.{{ promo.price.toLocaleString() }}
            </td>
            <td class="px-4 py-2 text-red-600 font-semibold">
              {{ (promo.discount * 100).toFixed(0) }}%
            </td>
            <td class="px-4 py-2 text-green-600 font-semibold">
              Rp.{{ (promo.price * (1 - promo.discount)).toLocaleString() }}
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <button class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900">
                  Edit
                </button>
                <button class="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-100">
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
definePageMeta({
  layout: 'admin'
})

const promos = [
  {
    id: 1,
    productId: 101,
    productName: 'ADIBAS',
    price: 1200000,
    imageUrl: 'https://picsum.photos/200/200?11',
    discount: 0.2
  },
  {
    id: 2,
    productId: 102,
    productName: 'Nikes AirMaxim',
    price: 1900000,
    imageUrl: 'https://picsum.photos/200/200?12',
    discount: 0.15
  },
  {
    id: 3,
    productId: 103,
    productName: 'Putangina',
    price: 1090000,
    imageUrl: 'https://picsum.photos/200/200?13',
    discount: 0.4
  },
]

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(promos.length / itemsPerPage))

const paginatedPromos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return promos.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > promos.length ? promos.length : end
})

const tambahPromo = () => {
  alert("Navigasi ke halaman tambah promo atau tampilkan modal form")
}
</script>
