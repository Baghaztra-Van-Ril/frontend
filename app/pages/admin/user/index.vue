<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Manajemen User</h1>

    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ user.length }} user
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
            v-for="user in paginateduser"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.role }}</td>
            <td class="px-4 py-2">{{ user.status }}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <NuxtLink :to="`/admin/user/${user.id}`" class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900">
  Edit
</NuxtLink>
                <button
                @click="hapus(user.id)"
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
import { useRouter } from 'vue-router';


const router = useRouter(); // ← ini penting!
const goToEditPage = (id) => {
  router.push(`/admin/user/${id}/edit`);
};

definePageMeta({
  layout: 'admin'
})

const user = [
  {
    id:1,
    name: 'Amir',
    email: 'amir@gmail.com',
    role: 'BNN(Bagian Nice Nice)',
    status: 'Inactive',
  },
  {
    name: 'Adit',
    email: 'adit@gmail.com',
    role: 'BNN(Bagian Nice Nice)',
    status: 'Inactive',
  },
  {
    name: 'Bagaz',
    email: 'bagaz@gmail.com',
    role: 'BNN(Bagian Nice Nice)',
    status: 'Inactive',
  },
  {
    name: 'Firman',
    email: 'firman@gmail.com',
    role: 'BNN(Bagian Nice Nice)',
    status: 'Inactive',
  },
]

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(user.length / itemsPerPage))

const paginateduser = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return user.slice(start, start + itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > user.length ? user.length : end
})

const hapus=(id)=>{
alert("anjay udah diapus")
}

const tambahAdmin = () => {
  router.push(`/admin/user/create`);
}
</script>
