import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirige les appels /api/* vers le serveur Express en dev
      '/api': 'http://localhost:3001',
    },
  },
});
