import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Caminhos relativos no build (./assets/...) — evita erro de assets no Apache
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/pib': {
        target: 'http://localhost:4004',
        changeOrigin: true
      },
      // Keycloak (login do admin) — encaminha para o servidor real em dev
      '/keycloak': {
        target: 'https://pibcafelandia.com.br',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
