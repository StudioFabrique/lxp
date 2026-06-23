FROM node:22-alpine

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY front/package*.json front/
COPY api/package*.json api/
COPY api/prisma/ api/prisma/

# Installation des dépendances
RUN npm run install-client
RUN npm run install-server

# Génération du client Prisma intégré à l'image
RUN npm run generate

# Copie du reste du code source
COPY front/ front/
COPY api/ api/

# Build du Front (Vite) et du Back (TypeScript)
RUN npm run deploy

# Copie des assets statiques dans le dossier dist
RUN mkdir -p api/dist/src/public api/dist/uploads && \
    cp -r api/src/public/* api/dist/src/public/ 2>/dev/null || true && \
    cp -r api/uploads/* api/dist/uploads/ 2>/dev/null || true

# Démarrage de l'application
CMD ["npm", "run", "start"]
