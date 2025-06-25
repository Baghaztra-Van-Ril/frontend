<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-sm text-center space-y-4">
      <h1 class="text-3xl font-bold text-red-500">Akses Ditolak</h1>
      <p class="text-gray-600 mt-5 dark:text-gray-300">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <UButton
        class="mt-4"
        color="primary"
        @click="navigateTo('/home')"
      >
        Kembali ke Beranda
      </UButton>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank'
})
</script>
