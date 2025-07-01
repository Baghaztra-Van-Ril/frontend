<template>
  <div class="h-screen w-48 text-gray-800 dark:text-gray-200 flex flex-col px-4 py-6">
    <!-- Judul -->
    <div class="text-xl font-bold mb-6 text-center">
      Toko Sepatu
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
  
  isLoading.value = true
  const tokenCookie = useCookie('token')
  const token = tokenCookie.value
  
  console.log("Token:", token ? "exists" : "not found");
  
  try {
    if (token) {
      console.log("Starting logout request to:", `${backendURL}/auth/logout`);
      
      const response = await $fetch(`${backendURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log("Logout response:", response);

      // Hapus cookie di frontend
      tokenCookie.value = null
      
      await navigateTo('/home')
      await Swal.fire('Berhasil', 'Berhasil logout logout.', 'success')
    } else {
      // Jika tidak ada token, langsung hapus cookie dan redirect
      console.log("No token found, direct logout");
      tokenCookie.value = null
  
      await navigateTo('/home')
      await Swal.fire('Info', 'Anda sudah logout.', 'info')
    }
  } catch (err) {
    console.error("Logout error:", err)
    
    // Tetap hapus cookie meskipun ada error
    tokenCookie.value = null
    
    await Swal.fire('Error', `Terjadi kesalahan saat logout: ${err.message || 'Unknown error'}`, 'error')
    await navigateTo('/home') // Redirect tetap dilakukan
  } finally {
    console.log("Logout process completed");
    isLoading.value = false
  }
}
</script>
