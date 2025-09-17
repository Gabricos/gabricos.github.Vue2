import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
   base: '/dna-dashboard/',
  server: {
    port: 3000, // o la porta che preferisci
    host: true, // per permettere connessioni esterne
    open: true // apre automaticamente il browser
  },
  root: '.', // assicurati che la root sia corretta
  publicDir: 'public' // directory per i file statici
})