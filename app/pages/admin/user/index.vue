<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen User</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ Array.isArray(users) ? users.length : 0 }} user
          </span>
        </div>
        <button
          @click="tambahAdmin"
          class="bg-primary text-white px-4 py-2 rounded hover:bg-orange-900 transition"
        >
          + Tambah Admin
        </button>
      </div>

      <table class="min-w-full border border-gray-200 dark:text-gray-200 rounded-lg shadow">
        <thead class="bg-primary text-gray-50 text-left">
          <tr>
            <th class="px-4 py-2">Username</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Role</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in paginatedUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">
              <select
                v-model="user.role"
                @change="updateUserRole(index)"
                class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>ADMIN</option>
                <option>USER</option>
              </select>
            </td>
            <td class="px-4 py-2">
              <span :class="getStatusClass(user.deletedAt)">
                {{ user.deletedAt ? 'Inactive' : 'Active' }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <NuxtLink :to="`/admin/user/${user.id}`" class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900">
                  Edit
                </NuxtLink>
                <button
                  @click="handleDelete(user.id)"
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
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_1

// Define all reactive variables
const users = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties for pagination
const totalPages = computed(() => {
  if (!Array.isArray(users.value)) {
    return 1
  }
  return Math.ceil(users.value.length / itemsPerPage.value)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  if (!Array.isArray(users.value)) {
    return 0
  }
  const end = currentPage.value * itemsPerPage.value
  return end > users.value.length ? users.value.length : end
})

const paginatedUsers = computed(() => {
  // Ensure users.value is an array before using slice
  if (!Array.isArray(users.value)) {
    return []
  }
  
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return users.value.slice(start, end)
})

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${backendURL}/users`, {
      withCredentials: true
    })
    
    // Check if response.data is an array, if not, handle the data structure
    if (Array.isArray(response.data)) {
      users.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      // If the response is wrapped in a data property
      users.value = response.data.data
    } else if (response.data && typeof response.data === 'object') {
      // If it's an object, try to find the array property
      const dataKeys = Object.keys(response.data)
      const arrayKey = dataKeys.find(key => Array.isArray(response.data[key]))
      if (arrayKey) {
        users.value = response.data[arrayKey]
      } else {
        console.error('No array found in response data:', response.data)
        users.value = []
      }
    } else {
      console.error('Invalid response data structure:', response.data)
      users.value = []
    }
    
    console.log('Processed users data:', users.value)
  } catch (err) {
    console.error('Gagal memuat data user:', err)
    users.value = []
  }
}

onMounted(fetchUsers)

const handleDelete = async (userId) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus user ini?',
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
      await axios.delete(`${backendURL}/users`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          ids: [userId]
        }
      })

      // Remove the deleted item from the array
      users.value = users.value.filter(u => u.id !== userId)

      Swal.fire('Terhapus!', 'User telah dihapus.', 'success')
    } catch (err) {
      console.error('Gagal menghapus user:', err)
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error')
    }
  }
}

const updateUserRole = async (index) => {
  const user = paginatedUsers.value[index]
  console.log('Sending payload:', {
    data: {
      role: user.role
    }
  })

  try {
    await axios.put(`${backendURL}/users/${user.id}`, {
        role: user.role
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    Swal.fire('Berhasil', `Role user diperbarui menjadi: ${user.role}`, 'success')
  } catch (err) {
    console.error('Gagal update role:', err)
    Swal.fire('Gagal', 'Gagal memperbarui role user.', 'error')
  }
}

const getStatusClass = (deletedAt) => {
  return deletedAt 
    ? 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs' 
    : 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs'
}

const tambahAdmin = () => {
  router.push('/admin/user/create')
}
</script>