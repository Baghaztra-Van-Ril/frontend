<template>
    <UCard class="relative overflow-hidden p-0 h-96 mt-4">
        <div class="w-auto p-5">
            <img :src="image" alt="Promo" class="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div class="absolute bottom-0 left-0 text-right w-full bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col">
            <span class="text-white text-2xl font-semibold line-through opacity-70">
                {{ formatPrice(originalPrice) }}
            </span>
            <span class="text-yellow-400 text-3xl font-bold">
                {{ formatPrice(discountPrice) }}
            </span>
        </div>
    </UCard>
</template>

<script setup>
defineProps({
    image: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    }
})

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}
</script>