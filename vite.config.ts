import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy removed in favor of absolute API URL to resolve CORS issues
  },
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Router
          'router': ['react-router-dom'],
          // Data fetching
          'query': ['@tanstack/react-query'],
          // State management
          'state': ['zustand'],
          // HTTP client
          'http': ['axios'],
          // Icons (large library, isolate it)
          'icons': ['lucide-react'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
    // Source maps for production debugging (disable for performance)
    sourcemap: false,
  },
  // Optimize deps pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand', 'axios'],
  },
})
