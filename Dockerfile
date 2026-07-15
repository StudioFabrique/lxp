FROM node:22-alpine AS build

WORKDIR /app

# Install build dependencies from each subproject lockfile.
COPY front/package.json front/package-lock.json ./front/
COPY api/package.json api/package-lock.json ./api/
COPY api/prisma ./api/prisma
RUN npm ci --prefix front
RUN npm ci --prefix api

# Build the API first; Vite then writes the frontend into api/dist/public.
COPY front ./front
COPY api ./api
RUN npm run build --prefix api && npm run build --prefix front

# Seed uploads in the same runtime path used by the API and production volume.
RUN mkdir -p api/dist/uploads && \
    if [ -d api/uploads ]; then cp -R api/uploads/. api/dist/uploads/; fi

FROM node:22-alpine AS api-production-dependencies

WORKDIR /app/api

# Keep Prisma as a runtime dependency for `npx prisma migrate deploy`, while
# omitting API development dependency groups from the production install.
COPY api/package.json api/package-lock.json ./
COPY api/prisma ./prisma
RUN npm ci --omit=dev && npx --no-install prisma generate

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Root scripts remain the stable runtime/deployment entry points.
COPY package.json package-lock.json ./
COPY api/package.json api/package-lock.json ./api/
COPY --from=api-production-dependencies /app/api/node_modules ./api/node_modules
COPY --from=build /app/api/dist ./api/dist
COPY --from=build /app/api/prisma ./api/prisma

CMD ["npm", "run", "start"]
