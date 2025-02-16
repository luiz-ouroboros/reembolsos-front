# Use uma imagem Node.js leve
FROM node:23.8.0-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta do Vite
EXPOSE 5173

# Comando para rodar o Vite
CMD ["npm", "run", "dev"]
