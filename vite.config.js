import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit dari 500kb ke 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries untuk optimasi loading
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        }
      }
    }
  }
})
