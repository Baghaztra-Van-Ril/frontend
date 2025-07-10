<script setup>
import bgImage from '/images/image 6.png'
</script>

<template>
  <div
    class="relative h-screen bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Judul di atas -->
    <div class="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-9/2 text-center">
      <h1 class="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-100 to-black bg-clip-text text-transparent">
        Ignite Step
      </h1>
    </div>

    <!-- Tombol di bawah -->
    <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2">
      <UButton
  to="/home"
  class="bg-red-500 text-white text-xl px-8 py-4 rounded-lg hover:bg-red-600 transition"
>
  Get Started
</UButton>
    </div>
  </div>
</template>
