<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen Penjualan</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ penjualan.length }} penjualan
          </span>
        </div>
      </div>

      <table class="min-w-full border border-gray-200 dark:text-gray-200 rounded-lg shadow">
        <thead class="bg-primary text-gray-50 text-left">
          <tr>
            <th class="px-4 py-2">Order ID</th>
            <th class="px-4 py-2">Nama Pembeli</th>
            <th class="px-4 py-2">Nama Barang</th>
            <th class="px-4 py-2">Jumlah</th>
            <th class="px-4 py-2">Total Harga</th>
            <th class="px-4 py-2">Status Pembayaran</th>
            <th class="px-4 py-2">Status Pengiriman</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedpenjualan"
            :key="item.orderId"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ item.orderId }}</td>
            <td class="px-4 py-2">{{ item.user.name }}</td>
            <td class="px-4 py-2">{{ item.product.name }}</td>
            <td class="px-4 py-2">{{ item.quantity }}</td>
            <td class="px-4 py-2">Rp.{{ item.totalPrice.toLocaleString('id-ID') }}</td>
            <td class="px-4 py-2">{{ item.paymentStatus }}</td>
            <td class="px-4 py-2">
              <select
                v-model="item.shipmentStatus"
                @change="updateShipmentStatus(index)"
                class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>PENDING</option>
                <option>ON PROCESS</option>
                <option>SHIPPED</option>
                <option>DELIVERED</option>
              </select>
            </td>
            <td class="px-4 py-2">
              <button
              @click="handleDelete(item.id)"
              class="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-100"
              >
                Hapus
              </button>
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

const penjualan = reactive([
  {
    orderId: 'ORD-20250623-khkjgjg',
    totalPrice: 700000,
    quantity: 5,
    paymentStatus: 'PENDING',
    shipmentStatus: 'PENDING',
    user: {
      name: "anjay"
    },
    product: {
      name: "njay"
    },
  },
])


const handleDelete = (penjualanId) => {
  Swal.fire({
    title: 'Yakin ingin menghapus penjualan ini?',
    text: 'Data yang dihapus tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      const index = penjualan.findIndex(p => p.id === penjualanId)
      if (index !== -1) {
        penjualan.splice(index, 1)
        Swal.fire('Terhapus!', 'Penjualan telah dihapus.', 'success')
      }
    }
  })
}

const updateShipmentStatus = (index) => {
  const updatedStatus = penjualan[index].shipmentStatus
  alert(`Status pengiriman diubah menjadi: ${updatedStatus}`)
  // Nanti di sini bisa tambahkan call ke backend
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(penjualan.length / itemsPerPage))

const paginatedpenjualan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return penjualan.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > penjualan.length ? penjualan.length : end
})
</script>
