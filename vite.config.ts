import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /*
  server: {
    proxy: {
      '/api': 'https://api.passpro.app:8894',
    },
  },
  */
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          pdf: ['jspdf', 'html2canvas'],
          qr: ['qrcode.react']
        }
      }
    }
  }
});