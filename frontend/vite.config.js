import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000,
    host: true, // Allow external connections
    // Proxy configuration for development
    // Routes API requests to backend server
    // Note: Proxy only matches exact API paths, not frontend routes
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Ensure proper handling of SPA routing
  build: {
    rollupOptions: {
      input: './index.html'
    }
  }
})
