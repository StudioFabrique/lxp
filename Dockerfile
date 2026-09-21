FROM node:22-alpine AS build

WORKDIR /app

# Install build dependencies from each subproject lockfile.
COPY front/package.json front/package-lock.json ./front/
COPY api/package.json api/package-lock.json ./api/
RUN npm ci --prefix front
RUN npm ci --prefix api

# Build the API first; Vite then writes the frontend into api/dist/public.
COPY front ./front
COPY api ./api
RUN npm run build --prefix api && npm run build --prefix front
RUN mkdir -p api/dist/mail-assets && \
    cp front/src/assets/andria-logo/logo-darkmode-email.png api/dist/mail-assets/andria-logo.png && \
    cp front/src/assets/andria-logo/logo-lightmode-email.png api/dist/mail-assets/andria-logo-light.png

# Seed uploads in the same runtime path used by the API and production volume.
RUN mkdir -p api/dist/uploads && \
    if [ -d api/uploads ]; then cp -R api/uploads/. api/dist/uploads/; fi

FROM node:22-alpine AS api-production-dependencies

WORKDIR /app/api

# Keep Prisma as a runtime dependency for `npx prisma db migrate`, while
# omitting API development dependency groups from the production install.
COPY api/package.json api/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Root scripts remain the stable runtime/deployment entry points.
COPY package.json package-lock.json ./
COPY api/package.json api/package-lock.json ./api/
COPY --from=api-production-dependencies /app/api/node_modules ./api/node_modules
COPY --from=build /app/api/dist ./api/dist
COPY --from=build /app/api/migrations ./api/migrations
COPY --from=build /app/api/prisma.config.ts ./api/prisma.config.ts
COPY --from=build /app/api/src/config/database-urls.ts ./api/src/config/database-urls.ts
COPY --from=build /app/api/src/prisma ./api/src/prisma

CMD ["npm", "run", "start"]
