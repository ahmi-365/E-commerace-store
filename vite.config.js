import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the output directory
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Adjust the port if your server runs on a different one
    },
  },
  // Adding fallback for non-root paths
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
