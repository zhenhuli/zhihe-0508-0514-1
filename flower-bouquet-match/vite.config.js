import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: parseInt(process.env.PORT) || 8080,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
