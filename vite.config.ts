import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: { // Move proxy under the server block
    proxy: {
      '/api': {
        target: 'https://gutghjvgdvzmklwubsuj.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/functions/v1'),
      },
    },
  },
});
