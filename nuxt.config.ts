// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

   runtimeConfig: {
    public: {
      BACKEND_URL_1: process.env.NUXT_BACKEND_URL_1 || 'http://localhost:3010/api',
      BACKEND_URL_2: process.env.NUXT_BACKEND_URL_2 || 'http://localhost:3020/api',
    }
  },

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils'],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})