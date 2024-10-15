import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Certifique-se de que o diretório de saída esteja correto
  },
  server: {
    port: 3000, // Você pode escolher a porta que preferir
  },
});
