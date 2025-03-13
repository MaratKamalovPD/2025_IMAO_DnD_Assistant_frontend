import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/2025_IMAO_DnD_Assistant_frontend/',
  server: {
    port: 5173,
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
