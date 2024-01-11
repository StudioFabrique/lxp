# Utilisation de l'image Node.js v20
FROM node:20

# Création du répertoire de travail dans l'image
WORKDIR /app

# Copie des fichiers nécessaires (package.json, package-lock.json, tsconfig.json)
COPY package*.json tsconfig.json .env ./

# Installation des dépendances
RUN npm install
RUN npm i -g nodemon

# Copie du code source dans l'image
COPY . /app

RUN npx prisma generate
# Transpilation du code TypeScript en JavaScript
RUN npm run build

