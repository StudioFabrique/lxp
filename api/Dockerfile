# Utilisation de l'image Node.js v20
FROM node:20

# Création du répertoire de travail dans l'image
WORKDIR /app

# Copie des fichiers nécessaires (package.json, package-lock.json, tsconfig.json)
COPY package*.json tsconfig.json .env ./

# Installation des dépendances
RUN npm install

# Copie du code source dans l'image
COPY . .

# Transpilation du code TypeScript en JavaScript
RUN npm run build
RUN npx prisma generate

# Définition du port sur lequel l'application va écouter
EXPOSE 5001

# Commande pour démarrer l'application
CMD ["npm", "run", "start:prod"]
