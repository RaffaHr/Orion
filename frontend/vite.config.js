import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), 
    },
  },
  build: {
    outDir: 'output', // A pasta onde o Vercel espera os arquivos de build do frontend
    emptyOutDir: true, 
  },
  server: {
    port: 3000, // Porta preferida
  }
});
