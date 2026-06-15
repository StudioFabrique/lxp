#!/bin/bash
echo "Installation des dépendances..."
npm i || { echo "\033[1;31mÉchec: Installation des dépendances"; exit 1; }

echo "Copie des fichiers .env..."
cp ./api/env.example ./api/.env && \
cp ./front/env.example ./front/.env || { echo "\033[1;31mÉchec: Copie des variables d'environnement"; exit 1; }

echo "Démarrage des containers Docker..."
cd api && docker compose up -d || { echo "\033[1;31mÉchec: Démarrage des containers"; exit 1; }

echo "Génération des modèles Prisma..."
npx prisma generate || { echo "\033[1;31mÉchec: Génération Prisma"; exit 1; }

echo "Exécution des migrations..."
npx prisma migrate deploy || { echo "\033[1;31mÉchec: Migrations"; exit 1; }

echo "Restauration des données..."
docker cp ./dumps/dump.sql lxp-prisma:. || { echo "\033[1;31mÉchec: Copie du dump SQL"; exit 1; }
docker cp ./dumps/dump-mongo lxp-mongo:. || { echo "\033[1;31mÉchec: Copie du dump Mongo"; exit 1; }
docker exec -it lxp-prisma PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d lxp < dump.sql || { echo "\033[1;31mÉchec: Import SQL"; exit 1; }
docker exec -it lxp-mongodb mongorestore --db lxp dump-mongo || { echo "\033[1;31mÉchec: Import MongoDB"; exit 1; }

echo -e "\033[0;32mConfiguration du projet ANDRIA terminée avec succès."
echo "Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet"
