import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'https://miliva.vercel.app',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'https://miliva.vercel.app',
        changeOrigin: true
      }
    }
  }
});

