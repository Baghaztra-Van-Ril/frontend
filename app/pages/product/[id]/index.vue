<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gray-900 flex justify-center items-center p-6">
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-10 max-w-5xl w-full">
      <!-- Gambar & Favorite -->
      <div class="flex flex-col items-center w-full md:w-64">
        <div class="w-60 h-60 border-4 border-blue-500 rounded-xl overflow-hidden flex justify-center items-center mb-4">
          <img :src="productData.imageUrl" :alt="productData.name" class="w-full h-full object-cover" />
        </div>
        <button @click="handleFavorite" class="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
          <HeartIcon class="w-6 h-6 mr-2" />
          72k Favorite
        </button>
      </div>

      <!-- Informasi Produk -->
      <div class="flex flex-col w-full gap-3">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ productData.name }}</h2>
        <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">Rp.{{ productData.price.toLocaleString('id-ID') }},-</p>
        <p class="text-gray-600 dark:text-gray-300">Stok: {{ productData.stock }}</p>
        <p class="text-gray-600 dark:text-gray-300">Ukuran: {{ productData.size }}</p>
        <p class="text-gray-700 dark:text-gray-400 mt-2">{{ productData.description }}</p>

        <div class="mt-6 flex gap-4">
          <button @click="handleBuy" class="flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition">
            <ShoppingCartIcon class="w-6 h-6 mr-2" />
            Beli
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/solid'; // Ganti sesuai kebutuhan
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'; // Ganti sesuai kebutuhan
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const productId = ref(null);
const productData = ref({
  id: null,
  name: '',
  stock: 0,
  size: '',
  description: '',
  price: 0,
  imageUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image',
});

const dummyProducts = {
  '123': {
    id: '123',
    name: 'Sepatu Lari X-Run',
    stock: 25,
    size: '39, 40, 41, 42, 43',
    description:
      'Sepatu lari inovatif dengan teknologi bantalan responsif untuk performa maksimal. Ringan dan nyaman digunakan sehari-hari maupun untuk latihan intensif. Desain aerodinamis mengurangi hambatan angin, sementara sol luar yang tahan lama memberikan traksi superior di berbagai permukaan.',
    price: 950000,
    imageUrl:
      'data:image/jpeg;base64,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',
  },
  '456': {
    id: '456',
    name: 'Kemeja Batik Modern',
    stock: 15,
    size: 'S, M, L, XL',
    description:
      'Kemeja batik dengan desain kontemporer, cocok untuk acara formal maupun kasual. Terbuat dari bahan katun berkualitas tinggi yang adem dan nyaman. Motif batik yang elegan dipadukan dengan potongan modern menciptakan gaya yang unik dan berkelas.',
    price: 320000,
    imageUrl:
      'https://images.unsplash.com/photo-1627885409605-65cf8527a419?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  '789': {
    id: '789',
    name: 'Celana Jeans Slim Fit',
    stock: 30,
    size: '28, 30, 32, 34, 36',
    description:
      'Celana jeans model slim fit yang nyaman dan mengikuti bentuk tubuh. Bahan denim berkualitas tinggi dengan sentuhan stretch untuk mobilitas. Cocok dipadukan dengan berbagai atasan untuk tampilan kasual sehari-hari.',
    price: 450000,
    imageUrl:
      'https://images.unsplash.com/photo-1541099645162-bb44fc0b1f2e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
};

onMounted(() => {
  productId.value = route.params.id;
  if (dummyProducts[productId.value]) {
    productData.value = dummyProducts[productId.value];
  } else {
    console.error(`Produk dengan ID ${productId.value} tidak ditemukan.`);
    productData.value = {
      id: null,
      name: 'Produk Tidak Ditemukan',
      stock: 0,
      size: 'N/A',
      description: 'Mohon periksa ID produk yang Anda cari.',
      price: 0,
      imageUrl: 'https://via.placeholder.com/150/CCCCCC/000000?text=Not+Found',
    };
  }
});

const handleBuy = () => {
  if (!productData.value.id) {
    alert('Produk tidak valid untuk dibeli.');
    return;
  }
  alert(`Anda akan membeli produk: ${productData.value.name}!\n(Simulasi Frontend)`);
  router.push(`/product/${productData.value.id}/payment`);
};

const handleFavorite = () => {
  alert(`Produk ${productData.value.name} ditambahkan ke favorit!\n(Simulasi Frontend)`);
};
definePageMeta({
  layout: 'home'
})
</script>


