# Use uma imagem base para Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências
RUN npm install

# Instale 'concurrently' globalmente para rodar frontend e backend
RUN npm install -g concurrently

# Defina o diretório de trabalho para o frontend
WORKDIR /app

# Exponha as portas necessárias
EXPOSE 3000 5000

# Comando para iniciar ambos os serviços
CMD ["npm", "run", "start-all"]
