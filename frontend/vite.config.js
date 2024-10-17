import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // Altera 'src' se sua estrutura de pastas for diferente
      },
    },
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000 // ou qualquer porta que você prefira
  }
});
