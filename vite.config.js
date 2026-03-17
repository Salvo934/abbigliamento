import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  optimizeDeps: {
    exclude: ['stripe'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
    warmup: {
      clientFiles: ['./index.html', './src/main.jsx', './src/App.jsx'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})