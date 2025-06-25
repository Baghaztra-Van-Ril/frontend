<template>
  <div class="login-form-container">
    <div class="login-box">
      <h2 class="login-title">LOGIN</h2>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            type="email"
            v-model="email"
            placeholder="email"
            required
            class="input-field"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            v-model="password"
            placeholder="password"
            required
            class="input-field"
          />
        </div>

        <button type="submit" class="btn primary-btn">Login</button>
      </form>

      <div class="or-divider">OR</div>

      <button @click="handleGoogleLogin" class="btn google-btn">
        <img src="/assets/icons/icons8-google.svg" alt="Google Icon" class="google-icon" />
        Login with google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Menggunakan Composition API dengan setup script

// Deklarasi state reaktif untuk input form
const email = ref('');
const password = ref('');

// Fungsi untuk menangani klik tombol "Login"
const handleLogin = () => {
  // Hanya menampilkan di konsol dan alert, tanpa mengirim ke backend
  console.log('--- Form Login Data ---');
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  alert(`Anda mencoba login dengan:\nEmail: ${email.value}\nPassword: ${password.value}\n\n(Ini hanya simulasi frontend!)`);
  // Di sini nanti tempat untuk memanggil API login ke backend
};

// Fungsi untuk menangani klik tombol "Login with Google"
const handleGoogleLogin = () => {
  // Hanya menampilkan di konsol dan alert
  console.log('Tombol "Login with Google" diklik');
  alert('Anda mencoba login dengan Google!\n\n(Ini hanya simulasi frontend!)');
  // Di sini nanti tempat untuk memulai proses Google OAuth
};

// Fungsi untuk menangani klik link "I don't have account"
const goToRegister = () => {
  // Hanya menampilkan di konsol dan alert
  console.log('Link "I don\'t have account" diklik');
  alert('Anda akan diarahkan ke halaman registrasi!\n\n(Ini hanya simulasi frontend!)');
  // Di sini nanti tempat untuk navigasi menggunakan Nuxt Router
  // Contoh: useRouter().push('/register'); // Jika Anda sudah punya halaman register
};
</script>

<style scoped>
/* Styling CSS untuk komponen ini */
.login-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Memastikan form di tengah vertikal di seluruh tinggi viewport */
  background-image: url('/assets/images/image 6.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  box-sizing: border-box; /* Memastikan padding tidak menambah lebar/tinggi */
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9); /* Latar belakang semi-transparan */
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Efek bayangan */
  width: 100%;
  max-width: 400px; /* Lebar maksimum form */
  text-align: center;
}

.login-title {
  font-size: 2.2em;
  font-weight: bold;
  margin-bottom: 30px;
  text-transform: uppercase;
  color: #f7931e; /* Warna orange dari gambar */
}

.input-group {
  margin-bottom: 20px;
}

.input-field {
  width: calc(100% - 20px); /* 100% lebar dikurangi padding horizontal */
  padding: 15px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  outline: none; /* Hilangkan outline default saat fokus */
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #f7931e; /* Warna border saat fokus */
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Jarak antara ikon dan teks (untuk tombol Google) */
}

.primary-btn {
  background-color: #f7931e; /* Warna orange */
  color: white;
  margin-top: 10px;
}

.primary-btn:hover {
  background-color: #e08215; /* Warna orange sedikit lebih gelap saat hover */
  transform: translateY(-2px); /* Efek naik sedikit saat hover */
}

.or-divider {
  margin: 25px 0;
  font-size: 0.9em;
  color: #666;
  position: relative; /* Penting untuk pseudo-elemen */
}

/* Garis di kiri "OR" */
.or-divider::before,
.or-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%; /* Lebar garis */
  height: 1px;
  background-color: #ddd;
}

.or-divider::before {
  left: 0;
}

.or-divider::after {
  right: 0;
}

.google-btn {
  background-color: #4285f4; /* Warna biru Google */
  color: white;
  margin-bottom: 20px;
}

.google-btn:hover {
  background-color: #357ae8; /* Warna biru Google lebih gelap saat hover */
  transform: translateY(-2px);
}

.google-icon {
  width: 20px;
  height: 20px;
}

.no-account {
  font-size: 0.9em;
}

.no-account a {
  color: #f7931e; /* Warna orange */
  text-decoration: none; /* Hilangkan underline default */
  transition: color 0.3s;
}

.no-account a:hover {
  text-decoration: underline; /* Munculkan underline saat hover */
  color: #e08215;
}
</style>