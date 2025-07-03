import axios from "axios";
export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig();
  const backendURL = config.public.BACKEND_URL_1;
  const isAuthenticated = ref(false);
  const isCheckingAuth = ref(false);
  const checkAuthenticated = async () => {
    if (isCheckingAuth.value) return isAuthenticated.value;

    isCheckingAuth.value = true;

    try {
      const res = await axios.get(`${backendURL}/auth/me`, {
        withCredentials: true,
      });
      console.log(res);

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
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
