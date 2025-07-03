<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen Penjualan</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ Array.isArray(penjualan) ? penjualan.length : 0 }} penjualan
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
            v-for="(item, index) in paginatedPenjualan"
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
                <option>FAILED</option>
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
import axios from 'axios'

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_1

// Define all reactive variables
const penjualan = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties for pagination
const totalPages = computed(() => {
  if (!Array.isArray(penjualan.value)) {
    return 1
  }
  return Math.ceil(penjualan.value.length / itemsPerPage.value)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  if (!Array.isArray(penjualan.value)) {
    return 0
  }
  const end = currentPage.value * itemsPerPage.value
  return end > penjualan.value.length ? penjualan.value.length : end
})

const paginatedPenjualan = computed(() => {
  // Ensure penjualan.value is an array before using slice
  if (!Array.isArray(penjualan.value)) {
    return []
  }
  
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return penjualan.value.slice(start, end)
})

const fetchPenjualan = async () => {
  try {
    const response = await axios.get(`${backendURL}/transactions/all`, {
      withCredentials: true
    })
    
    // Check if response.data is an array, if not, handle the data structure
    if (Array.isArray(response.data)) {
      penjualan.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      // If the response is wrapped in a data property
      penjualan.value = response.data.data
    } else if (response.data && typeof response.data === 'object') {
      // If it's an object, try to find the array property
      const dataKeys = Object.keys(response.data)
      const arrayKey = dataKeys.find(key => Array.isArray(response.data[key]))
      if (arrayKey) {
        penjualan.value = response.data[arrayKey]
      } else {
        console.error('No array found in response data:', response.data)
        penjualan.value = []
      }
    } else {
      console.error('Invalid response data structure:', response.data)
      penjualan.value = []
    }
    
    console.log('Processed penjualan data:', penjualan.value)
  } catch (err) {
    console.error('Gagal memuat data penjualan:', err)
    penjualan.value = []
  }
}

onMounted(fetchPenjualan)

const handleDelete = async (penjualanId) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus penjualan ini?',
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
      await axios.delete(`${backendURL}/transactions`, {
        withCredentials: true,
        headers: {
    'Content-Type': 'application/json'
  },
  data: {
      ids: [penjualanId]
    }
      })

      // Remove the deleted item from the array
      penjualan.value = penjualan.value.filter(p => p.id !== penjualanId)

      Swal.fire('Terhapus!', 'Penjualan telah dihapus.', 'success')
    } catch (err) {
      console.error('Gagal menghapus penjualan:', err)
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error')
    }
  }
}

const updateShipmentStatus = async (index) => {
  const item = paginatedPenjualan.value[index]
  console.log('Sending payload:', {
  ids: [25],
  data: {
    paymentStatus: 'paid'
  }
})

  try {
    await axios.patch(`${backendURL}/transactions`, {
  ids: [item.id],
  data: {
    shipmentStatus: item.shipmentStatus
  }
}, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

    Swal.fire('Berhasil', `Status pengiriman diperbarui menjadi: ${item.shipmentStatus}`, 'success')
  } catch (err) {
    console.error('Gagal update status:', err)
    Swal.fire('Gagal', 'Gagal memperbarui status pengiriman.', 'error')
  }
}
</script>