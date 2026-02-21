import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://eelepkal.com',
        changeOrigin: true,
        secure: false,
        xfwd: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Force the origin and referer to match the backend
            proxyReq.setHeader('Origin', 'https://eelepkal.com');
            proxyReq.setHeader('Referer', 'https://eelepkal.com/');
          });
        },
      },
    },
  },
})
