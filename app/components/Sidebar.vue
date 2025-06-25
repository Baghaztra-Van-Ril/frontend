 <template>
  <div class="h-screen w-48 text-grey-800 dark:text-gray-200 flex flex-col px-4 py-6">
    <!-- Judul / Branding -->
    <div class="text-xl font-bold mb-6 text-center">
      Toko Sepatu
    </div>

    <!-- Menu Navigasi -->
    <nav class="flex flex-col gap-3">
      <NuxtLink
        v-for="item in menu"
        :key="item.name"
        :to="item.to"
        class="rounded-lg px-3 py-2 text-sm hover:bg-primary-600 transition-colors"
        active-class="bg-primary-700"
      >
        {{ item.name }}
      </NuxtLink>
    </nav>

    <!-- Tombol Logout -->
    <div class="mt-auto pt-6">
      <UButton color="white" variant="ghost" class="w-full justify-center">
        Logout
      </UButton>
    </div>
  </div>
</template>

<script setup>
const menu = [
  { name: "Dashboard", to: "/admin" },
  { name: "Barang", to: "/admin/barang" },
  { name: "Promo", to: "/admin/promo" },
  { name: "Penjualan", to: "/admin/penjualan" },
  { name: "User", to: "/admin/user" },
];
</script>
