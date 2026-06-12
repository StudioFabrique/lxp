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
docker exec -it lxp-prisma export PGPASSWORD=postgres psql -U postgres -d lxp < dump-fixtures.sql
