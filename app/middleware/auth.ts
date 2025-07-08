// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  const backendURL1 = config.public.BACKEND_URL_1

  // Skip middleware on server-side
  if (process.server) return

  try {
    // Check if user is logged in
    const response = await $fetch(`${backendURL1}/auth/me`, {
      credentials: 'include'
    })

    // If user is logged in, allow access
    if (response) {
      return
    }
  } catch (error) {
    // If not logged in, redirect to Google Auth with current path as state
    const encodedPath = encodeURIComponent(to.fullPath)
    
    // Use navigateTo for client-side redirect, or return redirect for server-side
    if (process.client) {
      window.location.href = `${backendURL1}/auth/google?state=${encodedPath}`
      return
    } else {
      return navigateTo(`${backendURL1}/auth/google?state=${encodedPath}`, { external: true })
    }
  }
})