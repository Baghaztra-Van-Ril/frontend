<template>
  <footer class="bg-gray-700 text-gray-50 dark:bg-gray-500 py-8 mt-10">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Kelompok Info -->
      <div>
        <h2 class="text-lg font-bold mb-2">Kelompok 1</h2>
        <ul class="text-sm space-y-1">
          <li>Baghaztra Van Ril - <span class="italic">Project Leader</span></li>
          <li>Firman Ardiansyah - <span class="italic">Backend Developer</span></li>
          <li>Aditya Ahmad Alfarison - <span class="italic">Frontend Developer</span></li>
          <li>Muhammad Amir Shafwan - <span class="italic">Backend Developer</span></li>
          <li>Sultan Maulana Ichiro - <span class="italic">Frontend Developer</span></li>
        </ul>
      </div>

      <!-- Email Kontak -->
      <div>
        <h2 class="text-lg font-bold mb-2">Kontak Email</h2>
        <ul class="text-sm space-y-1 break-words">
          <li>baghaztra21@gmail.com</li>
          <li>ardiansyahfirman2004@gmail.com</li>
          <li>adityaalfarison33@gmail.com</li>
          <li>muhammadamirshafwan@gmail.com</li>
          <li>smaulanaichiro@gmail.com</li>
        </ul>
      </div>

      <!-- Alamat dan Copyright -->
      <div>
        <h2 class="text-lg font-bold mb-2">Alamat</h2>
        <p class="text-sm mb-4">Politeknik Negeri Padang (PNP), Sumatera Barat, Indonesia</p>
        <p class="text-xs text-gray-400">© {{ new Date().getFullYear() }} Kelompok 1. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
