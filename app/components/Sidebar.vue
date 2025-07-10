<template>
  <div class="h-screen w-48 text-gray-800 dark:text-gray-200 flex flex-col px-4 py-6">
    <!-- Judul -->
    <div class="text-xl font-bold mb-6 text-center">
      Ignite Step
    </div>

    <!-- Menu Navigasi -->
    <nav class="flex flex-col gap-3">
      <NuxtLink
        v-for="item in menu"
        :key="item.name"
        :to="item.to"
        class="rounded-lg px-3 py-2 text-sm hover:bg-primary-30 transition-colors"
        active-class="bg-primary text-white"
      >
        {{ item.name }}
      </NuxtLink>
    </nav>

    <!-- Tombol Logout -->
    <div class="mt-auto pt-6">
      <UButton 
        @click="logout"
        color="primary"
        class="w-full justify-center"
        :disabled="isLoading"
      >
        <template v-if="isLoading">
          Loading...
        </template>
        <template v-else>
          Logout
        </template>
      </UButton>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import axios from 'axios';

const menu = [
  { name: "Dashboard", to: "/admin" },
  { name: "Barang", to: "/admin/barang" },
  { name: "Promo", to: "/admin/promo" },
  { name: "Penjualan", to: "/admin/penjualan" },
  { name: "User", to: "/admin/user" },
];

const config = useRuntimeConfig();
const backendURL = config.public.BACKEND_URL_1;
const isLoading = ref(false)

const logout = async () => {
  console.log("Logout function called");
  console.log("Backend URL:", backendURL);

  isLoading.value = true;

  const result = await Swal.fire({
    title: 'Yakin ingin logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Logout',
    cancelButtonText: 'Batal',
  });

  if (!result.isConfirmed) {
    isLoading.value = false;
    return; 
  }

  try {

      console.log("Starting logout request to:", `${backendURL}/auth/logout`);

      const response = await axios.post(
        `${backendURL}/auth/logout`,
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log("Logout response:", response);


      await navigateTo('/home');
      await Swal.fire('Berhasil', 'Berhasil logout.', 'success');
  } catch (err) {
    console.error("Logout error:", err);



    await Swal.fire('Error', `Terjadi kesalahan saat logout: ${err.message || 'Unknown error'}`, 'error');
    await navigateTo('/home');
  } finally {
    console.log("Logout process completed");
    isLoading.value = false;
  }
};


</script>
