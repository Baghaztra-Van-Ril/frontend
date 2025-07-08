<template>
  <div class="bg-gray-300 dark:bg-gray-800 shadow-md">
    <div class="flex items-center justify-between py-4 px-5">
      <div>
        <ULink
          to="/home"
          active-class="text-primary"
          class="hover:text-primary text-gray-700 dark:text-gray-200 font-bold text-xl"
        >
          TOKUS
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <ColorModeButton />

        <template v-if="isAuthenticated">
          <UButton color="primary" to="/favorit">Favorit</UButton>
          <UButton color="primary" to="/history">Riwayat</UButton>
          <UButton
            color="red"
            @click="logout"
            variant="solid"
            class="hover:bg-amber-700"
            :disabled="isLoading"
          >
            <template v-if="isLoading"> Loading... </template>
            <template v-else> Logout </template>
          </UButton>
        </template>

        <template v-else>
          <UButton color="primary" to="/login">Login</UButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import axios from "axios";

const isLoading = ref(false);
const router = useRouter();

// Reactive state untuk autentikasi
const isAuthenticated = ref(false);
const isCheckingAuth = ref(false);

// Get runtime config
const config = useRuntimeConfig();
const backendURL = config.public.BACKEND_URL_1;

// Fungsi untuk cek autentikasi
const checkAuthenticated = async () => {
  if (isCheckingAuth.value) return isAuthenticated.value;
  
  isCheckingAuth.value = true;
  
  try {
    const res = await axios.get(
      `${backendURL}/auth/me`,
      {
        withCredentials: true,
      }
    );
    console.log(res)
    
    if (res.status === 200) {
      isAuthenticated.value = true;
      return true;
    } else {
      isAuthenticated.value = false;
      return false;
    }
  } catch (error) {
    console.log("Auth check failed:", error);
    isAuthenticated.value = false;
    return false;
  } finally {
    isCheckingAuth.value = false;
  }
};

// Fungsi logout
const logout = async () => {
  console.log("Logout function called");
  console.log("Backend URL:", backendURL);

  isLoading.value = true;

  const result = await Swal.fire({
    title: 'Yakin ingin logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Logout',
    cancelButtonText: 'Batal',
  });

  if (!result.isConfirmed) {
    isLoading.value = false;
    return; 
  }

  try {
    console.log("Starting logout request to:", `${backendURL}/auth/logout`);

    const response = await axios.post(
      `${backendURL}/auth/logout`,
      {}, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    console.log("Logout response:", response);

    // Update state autentikasi setelah logout berhasil
    isAuthenticated.value = false;

    await router.push('/home');
    await Swal.fire('Berhasil', 'Berhasil logout.', 'success');
  } catch (err) {
    console.error("Logout error:", err);
    await Swal.fire('Error', `Terjadi kesalahan saat logout: ${err.message || 'Unknown error'}`, 'error');
    await navigateTo('/home');
  } finally {
    console.log("Logout process completed");
    isLoading.value = false;
  }
};

// Cek autentikasi saat component dimount
onMounted(async () => {
  await checkAuthenticated();
});

// Watch route changes untuk refresh auth status
watch(() => router.currentRoute.value.path, async () => {
  await checkAuthenticated();
});
</script>
