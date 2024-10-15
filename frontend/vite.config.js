import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Importando o caminho do módulo 'path'
import path from 'path';

// Definindo a configuração do Vite
export default defineConfig({
  // Especificando o diretório de entrada
  root: path.resolve(__dirname, 'frontend'), // Caminho para a pasta 'frontend'
  plugins: [react()],
  // Configuração para o diretório de saída
  build: {
    outDir: path.resolve(__dirname, 'frontend', 'dist'), // Caminho para a pasta 'dist' dentro de 'frontend'
  },
  server: {
    port: 3000, // Porta do servidor de desenvolvimento
  },
});
