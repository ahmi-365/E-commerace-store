import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the output directory
  },
  server: {
    proxy: {
      '/api': 'https://e-commerace-store.onrender.com', // Use the Render URL
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
