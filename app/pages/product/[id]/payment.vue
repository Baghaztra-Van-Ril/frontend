<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 flex justify-center items-center">
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-10">

      <!-- Product Info Manual -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/2">
        <img
          :src="productData.imageUrl"
          :alt="productData.name"
          class="w-full h-64 object-cover rounded-md mb-4"
        />
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ productData.name }}</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-1">{{ productData.description }}</p>
        <p class="text-gray-700 dark:text-gray-200 font-semibold mt-4">Harga: Rp.{{ productData.price.toLocaleString('id-ID') }}</p>
        <p class="text-gray-700 dark:text-gray-200">Stok: {{ productData.stock }}</p>
      </div>

      <!-- Payment Form -->
      <div class="bg-orange-500 rounded-xl text-white p-6 w-full md:w-1/2 shadow-md flex flex-col gap-4">
        <div class="flex justify-between">
          <span class="font-semibold">Stok Total:</span>
          <span>{{ productData.stock }}</span>
        </div>

        <div class="flex justify-between items-center">
          <label class="font-semibold">Jumlah Beli:</label>
          <input
            type="number"
            v-model.number="quantity"
            @input="validateQuantity"
            min="1"
            :max="productData.stock"
            class="w-24 text-black rounded-md px-2 py-1"
          />
        </div>

        <hr class="border-white/50 my-2" />

        <div class="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>Rp.{{ calculateTotal.toLocaleString('id-ID') }},-</span>
        </div>

        <button
          @click="confirmPayment"
          class="bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 rounded-lg mt-4 transition"
        >
          Konfirmasi
        </button>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // Import computed dan watch
import { useRoute } from 'vue-router';
import ProductCard from '~/components/ProductCard.vue'; // ProductCard tetap digunakan

const route = useRoute();
const productId = ref(null);
const productData = ref({ // Default kosong untuk menghindari error di template sebelum data dimuat
  id: null,
  name: '',
  description: '',
  imageUrl: '',
  stock: 0,
  price: 0
});

// Data produk dummy
const dummyProducts = {
  '123': {
    id: '123',
    name: 'Nama Produk',
    description: 'Deskripsi Produk',
    imageUrl: 'https://mills.co.id/cdn/shop/products/14c626bd-cc27-4871-b5df-4dba4f49991e-sportage-cl-04.jpg?v=1706085072',
    stock: 100,
    price: 950000
  }
};

// State dan logika untuk form pembayaran, dipindahkan dari PaymentForm.vue
const quantity = ref(1);

const calculateTotal = computed(() => {
  return productData.value.price * quantity.value;
});

// Watcher untuk memastikan kuantitas tidak melebihi stok atau kurang dari 1
watch(() => productData.value.stock, (newStock) => {
  if (quantity.value > newStock && newStock > 0) {
    quantity.value = newStock;
  } else if (newStock === 0 && quantity.value > 0) {
    quantity.value = 0; // Jika stok 0, quantity juga 0
  }
});

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1;
  } else if (quantity.value > productData.value.stock) {
    quantity.value = productData.value.stock;
  }
};

const confirmPayment = () => {
  if (quantity.value <= 0) {
    alert('Jumlah beli harus lebih dari 0!');
    return;
  }
  if (quantity.value > productData.value.stock) {
    alert(`Maaf, stok hanya tersedia ${productData.value.stock} unit.`);
    return;
  }

  // Logika konfirmasi pembayaran
  const paymentDetails = {
    productId: productData.value.id,
    qty: quantity.value,
    total: calculateTotal.value,
  };
  console.log('Detail Pembayaran Dikonfirmasi:', paymentDetails);
  alert(`Pembayaran sejumlah Rp.${paymentDetails.total.toLocaleString('id-ID')} dikonfirmasi untuk ${paymentDetails.qty} item!\n(Simulasi Frontend)`);
  // Di sini nanti Anda akan mengirim detail pembayaran ke backend
};

onMounted(() => {
  productId.value = route.params.id;
  if (dummyProducts[productId.value]) {
    productData.value = dummyProducts[productId.value];
    // Pastikan quantity diinisialisasi ulang jika produk berubah dan stok berbeda
    validateQuantity();
  } else {
    console.error(`Produk dengan ID ${productId.value} tidak ditemukan.`);
    productData.value = { // Reset ke nilai default jika tidak ditemukan
      id: null,
      name: 'Produk Tidak Ditemukan',
      description: 'Mohon periksa ID produk.',
      imageUrl: 'https://via.placeholder.com/150/CCCCCC/000000?text=Not+Found',
      stock: 0,
      price: 0
    };
    quantity.value = 0; // Set quantity ke 0 jika produk tidak ditemukan
  }
});

definePageMeta({
  layout: 'home'
});
</script>

<style scoped>
.payment-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0e0e0; /* Warna abu-abu terang */
  padding: 20px;
  box-sizing: border-box;
}

.page-content {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
}

.product-detail-section,
.payment-form-section {
  flex-shrink: 0;
  width: 350px; /* Lebar tetap untuk kedua bagian */
  max-width: 100%;
}

/* Styling untuk form pembayaran (dipindahkan dari PaymentForm.vue) */
.payment-form {
  background-color: #ff9933; /* Warna orange sesuai mockup */
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
}

.label {
  font-weight: bold;
}

.value {
  text-align: right;
}

.quantity-input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  text-align: center;
  color: #333;
}

.divider {
  border-top: 1px dashed rgba(255, 255, 255, 0.5);
  margin: 15px 0;
}

.total-row {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 10px;
}

.total-amount {
  color: white;
}

.confirm-btn {
  background-color: white;
  color: #ff9933;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 25px;
  transition: background-color 0.3s, color 0.3s;
}

.confirm-btn:hover {
  background-color: #f0f0f0;
  color: #e07b22;
}

/* Responsiveness dasar */
@media (max-width: 768px) {
  .page-content {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
  }
  .product-detail-section,
  .payment-form-section {
    width: 100%;
  }
}
</style>