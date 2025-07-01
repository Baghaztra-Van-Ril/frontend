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
            <td class="px-4 py-2 text-gray-500 dark:text-gray-200 font-semibold">{{ promo.productName }}</td>
            <td class="px-4 py-2 text-gray-500 line-through dark:text-gray-200 font-semibold">
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
import Swal from 'sweetalert2'
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

const handleDelete = (promoId) => {
  Swal.fire({
    title: 'Yakin ingin menghapus promo ini?',
    text: 'Data yang dihapus tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      const index = promos.findIndex(p => p.id === promoId)
      if (index !== -1) {
        promos.splice(index, 1)
        Swal.fire('Terhapus!', 'Promo telah dihapus.', 'success')
      }
    }
  })
}

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
