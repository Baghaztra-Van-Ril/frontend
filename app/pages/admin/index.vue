<template>
  <div>
    <h1 class="text-2xl color-primary font-bold mb-4">Dashboard Admin</h1>
    <div class="grid grid-cols-4 gap-4">
      <div v-for="(item, index) in items" :key="index" class="bg-white rounded-lg shadow p-2">
        <img :src="item" alt="sepatu" class="w-full h-auto rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
    {  
        image: 'https://picsum.photos/200/300'
    },
]
    definePageMeta({
    layout: 'admin'
    });
</script>