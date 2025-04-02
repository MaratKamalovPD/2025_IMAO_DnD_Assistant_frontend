import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const domain = process.env.VITE_DOMAIN || '127.0.0.1'
const port = parseInt(process.env.VITE_PORT || '5173') 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/2025_IMAO_DnD_Assistant_frontend/',
  server: {
    port: port,
    //host: '0.0.0.0', // Разрешить доступ с любых IP (если нужно)
    allowedHosts: [
      domain, // Разрешить домен
      'localhost', // Оставить локальный доступ
    ],
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
