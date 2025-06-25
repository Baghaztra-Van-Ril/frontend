export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')
  const role = useCookie('role')
  if (!token.value) {
    return navigateTo('/login')
  }
  if (role.value !== 'admin') {
    return navigateTo('/forbidden')
  }
})
