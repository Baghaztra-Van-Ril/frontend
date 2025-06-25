<template>
  <div>
    <div class="mt-5">
      <h1 class="text-2xl font-bold">Promo Untukmu</h1>
    </div>
    
    <div class="w-full px-4">
      <Swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        pagination
        class="w-full"
      >
        <SwiperSlide v-for="promo in promos" :key="promo.id">
          <PromoCard
            :image="promo.image"
            :original-price="promo.originalPrice"
            :discount-price="promo.discountPrice"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="mt-5">
      <h1 class="text-2xl font-bold">Produk Terbaru Kami</h1>
    </div>

    <div class="flex items-center space-x-4 w-full">
      <div class="ml-auto">
        <UButton color="primary" to="/product">Lihat Semua Produk</UButton>
      </div>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-12">
      <template v-for="product in products" :key="product.id">
        <ProductCard
          :id="product.id"
          :image="product.image"
          :productName="product.name"
          :price="product.price"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const promos = [
  {
    id: 1,
    title: 'Diskon Musim Panas!',
    description: 'Diskon hingga 50% untuk produk pilihan.',
    image: 'https://picsum.photos/seed/promo1/600/200',
    originalPrice: 200000,
    discountPrice: 100000,
  },
  {
    id: 2,
    title: 'Gratis Ongkir',
    description: 'Gratis ongkos kirim untuk pembelian di atas Rp100.000.',
    image: 'https://picsum.photos/seed/promo2/600/200',
    originalPrice: 50000,
    discountPrice: 0,
  },
  {
    id: 3,
    title: 'Produk Terbaru',
    description: 'Lihat koleksi produk terbaru di toko kami.',
    image: 'https://picsum.photos/seed/promo3/600/200',
    originalPrice: 120000,
    discountPrice: 110000,
  },
]

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High quality sound, noise cancelling.',
    price: 99.99,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Track your fitness and notifications.',
    price: 149.99,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    description: 'Portable and powerful sound.',
    price: 59.99,
    image: 'https://picsum.photos/200/300',
  },
]

definePageMeta({
  layout: 'home',
})
</script>
