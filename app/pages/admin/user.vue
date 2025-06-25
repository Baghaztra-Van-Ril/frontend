<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-primary">User</h1>

    <UTable
      :columns="columns"
      :rows="products"
      class="bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <!-- Gambar Produk -->
      <template #imageUrl-data="{ row }">
        <img
          :src="row.imageUrl"
          alt="sepatu"
          class="w-16 h-16 rounded-md object-cover border"
        />
      </template>

      <!-- Harga Produk -->
      <template #price-data="{ row }">
        <span class="text-green-600 font-semibold">
          Rp {{ row.price.toLocaleString("id-ID") }}
        </span>
      </template>

      <!-- Tombol Aksi (Contoh) -->
      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton size="xs" color="primary" variant="solid">Edit</UButton>
          <UButton size="xs" color="red" variant="outline">Hapus</UButton>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const columns = [
  { key: 'id', label: 'ID', id: 'id' },
  { key: 'name', label: 'Nama', id: 'name' },
  { key: 'description', label: 'Deskripsi', id: 'description' },
  { key: 'imageUrl', label: 'Gambar', id: 'imageUrl' },
  { key: 'stock', label: 'Stok', id: 'stock' },
  { key: 'size', label: 'Ukuran', id: 'size' },
  { key: 'price', label: 'Harga', id: 'price' },
  { key: 'visitCount', label: 'Kunjungan', id: 'visitCount' },
  { key: 'actions', label: 'Aksi', id: 'actions' }, // Kolom aksi untuk admin
]

const products = [
  {
    id: 1,
    name: 'Sepatu Keren',
    description: 'Sepatu running nyaman dan stylish',
    imageUrl: 'https://picsum.photos/200/200?1',
    stock: 20,
    size: 42,
    price: 350000,
    visitCount: 132,
  },
  {
    id: 2,
    name: 'Sneakers Putih',
    description: 'Cocok untuk sehari-hari',
    imageUrl: 'https://picsum.photos/200/200?2',
    stock: 15,
    size: 41,
    price: 275000,
    visitCount: 98,
  },
  {
    id: 3,
    name: 'Sepatu Kulit',
    description: 'Elegan untuk acara formal',
    imageUrl: 'https://picsum.photos/200/200?3',
    stock: 10,
    size: 43,
    price: 500000,
    visitCount: 54,
  },
]
</script>
