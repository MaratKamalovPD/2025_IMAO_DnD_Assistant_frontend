import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/2025_IMAO_DnD_Assistant_frontend/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
      },
      '/generate_battle': {
        target: process.env.VITE_GENERATE_BATTLE_HOST,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      app: '/src/app',
      entities: '/src/entities',
      pages: '/src/pages',
      shared: '/src/shared',
    },
  },
});
