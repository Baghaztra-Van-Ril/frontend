<template>
  <div class="bg-gray-300 dark:bg-gray-800 shadow-md">
    <div class="flex items-center justify-between py-4 px-5">
      <div>
        <ULink to="/home" active-class="text-primary" class="hover:text-primary text-gray-700 dark:text-gray-200 font-bold text-xl">
          TOKUS
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <ColorModeButton />

        <template v-if="token">
          <UButton color="primary" to="/favorit">Favorit</UButton>
          <UButton 
            color="red" 
            @click="logout"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              Loading...
            </template>
            <template v-else>
              Logout
            </template>
          </UButton>
        </template>

        <template v-else>
          <UButton color="primary" to="/login">Login</UButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

// Reactive token state
const tokenCookie = useCookie('token', {
  default: () => null,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
})

const token = useCookie('token')
const isLoading = ref(false)

// Get runtime config
const config = useRuntimeConfig()
const backendURL = config.public.BACKEND_URL_1

const logout = async () => {
  isLoading.value = true
  
  try {
    if (token.value) {
      await $fetch(`${backendURL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        credentials: 'include'
      })
    }
    // Hapus token dari cookie
    tokenCookie.value = null

    await Swal.fire({
      icon: 'success',
      title: 'Logout Berhasil',
      text: 'Kamu telah keluar',
      confirmButtonColor: '#3085d6'
    })

    await navigateTo('/home')
    
  } catch (error) {
    console.error('Logout error:', error)
    
    tokenCookie.value = null
    
    await Swal.fire({
      icon: 'warning',
      title: 'Logout',
      text: 'Kamu telah keluar (ada gangguan koneksi)',
      confirmButtonColor: '#3085d6'
    })
    
    await navigateTo('/home')
  } finally {
    isLoading.value = false
  }
}
</script>
