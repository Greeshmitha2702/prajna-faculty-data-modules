import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/modules/faculty data module/UI'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
