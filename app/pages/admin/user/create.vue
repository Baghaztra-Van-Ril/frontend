<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-primary">Tambah Admin Baru</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
        <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input v-model="form.email" type="email" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
        <input v-model="form.role" type="text" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select v-model="form.status" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-orange-900 transition">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  role: 'Admin',
  status: 'Active',
})

const handleSubmit = () => {
  console.log('User baru:', form.value)
  alert(`User ${form.value.name} berhasil ditambahkan! (Simulasi Frontend)`)
  router.push('/admin/user')
}

definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
</style>
