import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Altere 'src' se sua estrutura de pastas for diferente
    },
  },
  build: {
    outDir: 'output', // Altere para 'output' para corresponder ao que o Vercel espera
    emptyOutDir: true, // Garante que a pasta de saída seja limpa antes da build
  },
  server: {
    port: 3000, // ou qualquer porta que você prefira
  }
});
