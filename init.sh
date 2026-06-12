#!/bin/bash
echo "Installation des dépendances"
npm i

echo "Copie des variables d’environnement dans .env"
cp ./env.example ./.env && cp ./api/env.example ./api/.env && cp ./front/env.example ./front/.env

echo "Démarrage des containers..."
cd api && docker compose up -d

echo "Génération des modèles prisma"
npx prisma generate

echo "Migrations bdd"
npx prisma migrate deploy

echo "Insertions des données"
docker cp ./dumps/dump.sql lxp-prisma:.
docker cp ./dumps/dump-mongo lxp-mongo:.
docker exec -it lxp-prisma PGPASSWORD=postgres psql -U postgres -d lxp < dump.sql
docker exec -it lxp-mongodb mongorestore --db lxp dump-mongo
