<template>
    <div>
        <h1 class="text-3xl font-bold mb-6">Produk Kami</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :id="product.id"
                :image="product.image"
                :productName="product.name"
                :price="product.price"
            />
        </div>
    </div>
    <!-- TODO: Pagination -->
</template>

<script setup>
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 1,
        name: 'Wireless Headphones',
        description: 'High quality sound, noise cancelling.',
        price: 99.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Track your fitness and notifications.',
        price: 149.99,
        image: 'https://picsum.photos/200/300'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        description: 'Portable and powerful sound.',
        price: 59.99,
        image: 'https://picsum.photos/200/300'
    },
]

definePageMeta({
    layout: 'home'
});
</script>