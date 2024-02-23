FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

COPY front/package*.json front/
COPY front/tsconfig.node.json front/
COPY front/tsconfig.json front/
RUN npm run install-client

COPY api/package*.json api/
COPY api/tsconfig.json api/
COPY api/prisma/ api/
RUN npm run install-server


RUN npm run generate


COPY front/ front/

COPY api/ api/
COPY api/uploads/ api/dist/uploads
COPY api/src/uploads/ api/dist/src/uploads
RUN npm run deploy


CMD ["npm", "run", "start"]