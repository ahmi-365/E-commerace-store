import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the output directory
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerace-store.onrender.com', // Use the Render URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // If your API server uses HTTPS and has a valid certificate, keep this as true.
        // If you encounter issues with self-signed certificates, you can set it to false during development.
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
