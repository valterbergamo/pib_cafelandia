import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Site servido na RAIZ do domínio → base absoluta. Assets sempre em /assets/...
  // (com base relativa as rotas aninhadas tipo /admin/eventos quebram os assets no F5)
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/pib': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        // backend serve em /odata, /upload, /files — remove o prefixo /api/pib
        rewrite: (path) => path.replace(/^\/api\/pib/, '')
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
