import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/2025_IMAO_DnD_Assistant_frontend/',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: 'entities',
        replacement: fileURLToPath(new URL('./src/entities', import.meta.url)),
      },
      {
        find: 'pages',
        replacement: fileURLToPath(new URL('./src/pages', import.meta.url)),
      },
      {
        find: 'shared',
        replacement: fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    ],
  },
});
