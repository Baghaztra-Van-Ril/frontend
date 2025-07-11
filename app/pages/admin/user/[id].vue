<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">Edit User</h1>

    <div class="overflow-x-auto">
      <form class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Nama</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white w-full" 
            required 
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white w-full" 
            required 
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
          <select 
            v-model="form.role" 
            class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white w-full"
          >
            <option>ADMIN</option>
            <option>USER</option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
          <select 
            v-model="form.deletedAt" 
            class="border px-2 py-1 rounded text-sm bg-white text-gray-700 dark:bg-gray-800 dark:text-white w-full"
          >
            <option :value="null">Active</option>
            <option :value="true">Inactive</option>
          </select>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <NuxtLink 
            to="/admin/user" 
            class="border border-gray-500 text-gray-500 px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Batal
          </NuxtLink>
          <button 
            type="submit" 
            class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-orange-900 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { useRoute, useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import Swal from 'sweetalert2'
definePageMeta({
  layout: 'admin'
})


const route = useRoute()
const router = useRouter()
const userId = route.params.id

const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_1

const form = ref({
  name: '',
  email: '',
  role: '',
  deletedAt: null // null = active
})

onMounted(async () => {
  try {
    const res = await axios.get(`${backendURL}/users/${userId}`, {
      withCredentials: true
    })
    const user = res.data?.data || res.data
    form.value = {
      name: user.name,
      email: user.email,
      role: user.role,
      deletedAt: user.deletedAt ? true : null
    }
  } catch (error) {
    console.error('Gagal memuat data user:', error)
    Swal.fire('Error', 'User tidak ditemukan.', 'error')
    router.push('/admin/user')
  }
})

const handleSubmit = async () => {
  console.log('Form data:', form.value)
  let payloat = []
  if (form.value.deletedAt === true) {
    payloat = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      deletedAt: new Date()
    }
  } else {
     payloat = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
    }
  }
  try {
    await axios.put(`${backendURL}/users/${userId}`, {
      ...payloat
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // No additional code needed here since you want to remove 'null' handling.
    Swal.fire('Berhasil', 'User berhasil diperbarui.', 'success').then(() => {
      router.push('/admin/user')
    })
  } catch (error) {
    console.error('Gagal menyimpan data:', error)
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error')
  }
}
</script>