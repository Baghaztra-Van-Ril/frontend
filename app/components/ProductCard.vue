<template>
    <nuxt-link :to="`/product/${id}`">
        <div class="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 
                transition-all duration-300 
                hover:scale-105 active:scale-95 active:translate-y-1">
            <img :src="image" alt="Product Image" class="w-full h-48 object-cover rounded-t" />
            <div class="p-4">
                <h2 class="text-lg font-semibold mb-2">{{ productName }}</h2>
                <p class="text-primary text-xl font-bold mb-4">Rp {{ price }}</p>
            </div>
        </div>
    </nuxt-link>
</template>

<script setup>
defineProps({
    id: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: [Number, String],
        required: true
    }
})
</script>