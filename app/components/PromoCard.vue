<template>
    <NuxtLink :to="`/product/${productId}`">
        <UCard class="relative overflow-hidden p-0 h-96 mt-4">
            <div class="w-auto p-5">
                <img :src="image" alt="Promo" class="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-1">
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-semibold truncate" title="{{ productName }}">
                        {{ productName }}
                    </span>
                    <div class="flex items-end gap-2">
                        <span class="text-white text-base font-medium line-through opacity-70">
                            {{ formatPrice(originalPrice) }}
                        </span>
                        <span class="text-yellow-400 text-2xl font-bold">
                            {{ formatPrice(discountPrice) }}
                        </span>
                    </div>
                </div>
            </div>
        </UCard>
    </NuxtLink>
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
    },
    productId: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
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