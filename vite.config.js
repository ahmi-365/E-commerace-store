import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the production build
  },
  resolve: {
    alias: {
      '@': '/src', // Setting up path alias for cleaner imports
    },
  },
  server: {
    port: 5173, // Optional: Specify port for development server if needed
  },
});
