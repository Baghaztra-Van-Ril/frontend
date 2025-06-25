<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-6">Edit User</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Nama</label>
        <input v-model="form.name" type="text" class="input-field" required />
      </div>

      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input v-model="form.email" type="email" class="input-field" required />
      </div>

      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
        <select v-model="form.role" class="input-field">
          <option>BNN(Bagian Nice Nice)</option>
          <option>Admin</option>
          <option>User</option>
        </select>
      </div>

      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
        <select v-model="form.status" class="input-field">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div class="flex justify-end gap-4 pt-4">
        <NuxtLink to="/admin/user" class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          Batal
        </NuxtLink>
        <button type="submit" class="px-6 py-2 bg-primary text-white rounded hover:bg-orange-900 transition">
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
});

import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

// Simulasi data user untuk diedit
const dummyUsers = {
  1: { name: 'Amir', email: 'amir@gmail.com', role: 'BNN(Bagian Nice Nice)', status: 'Inactive' },
  2: { name: 'Adit', email: 'adit@gmail.com', role: 'BNN(Bagian Nice Nice)', status: 'Inactive' },
  3: { name: 'Bagaz', email: 'bagaz@gmail.com', role: 'BNN(Bagian Nice Nice)', status: 'Inactive' },
  4: { name: 'Firman', email: 'firman@gmail.com', role: 'BNN(Bagian Nice Nice)', status: 'Inactive' },
};

const form = ref({
  name: '',
  email: '',
  role: '',
  status: '',
});

onMounted(() => {
  if (dummyUsers[userId]) {
    form.value = { ...dummyUsers[userId] };
  } else {
    alert('User tidak ditemukan!');
    router.push('/admin/user');
  }
});

const handleSubmit = () => {
  alert(`Data user berhasil diperbarui:\n${JSON.stringify(form.value, null, 2)}\n(Simulasi frontend)`);
  router.push('/admin/user');
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #111827;
  outline: none;
  transition: border-color 0.3s;
}
.input-field:focus {
  border-color: #f97316;
}
.dark .input-field {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}
</style>
