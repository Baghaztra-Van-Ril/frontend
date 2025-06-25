// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

   runtimeConfig: {
    public: {
      BACKEND_URL: process.env.NUXT_BACKEND_URL || 'http://localhost:3000/api',
    }
  },

  devServer: {
    port: 3001,
    host: '0.0.0.0', // Opsional: biar bisa diakses dari jaringan lokal juga
  },

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils'],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})