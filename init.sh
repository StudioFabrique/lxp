#!/bin/bash
echo "Installation des dépendances..."
npm i || { echo -e "\033[1;31m Échec: Installation des dépendances"; exit 1; }

echo "Copie des fichiers .env..."
cp ./api/env.example ./api/.env && \
cp ./front/env.example ./front/.env || { echo -e "\033[1;31m Échec: Copie des variables d'environnement"; exit 1; }

echo "Démarrage des containers Docker..."
cd api && docker compose up -d || { echo -e "\033[1;31m Échec: Démarrage des containers"; exit 1; }

echo "Génération des modèles Prisma..."
npx prisma generate || { echo -e "\033[1;31m Échec: Génération Prisma"; exit 1; }

echo "Exécution des migrations..."
npx prisma migrate deploy || { echo -e "\033[1;31m Échec: Migrations"; exit 1; }

echo "Restauration des données..."
docker cp ./dumps/dump-pgsq.sql lxp-prisma:. || { echo -e "\033[1;31m Échec: Copie du dump SQL"; exit 1; }
docker cp ./dumps/dump-mongo lxp-mongo:. || { echo -e "\033[1;31m Échec: Copie du dump Mongo"; exit 1; }
docker exec -it lxp-prisma PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d lxp < /dump-pgsq.sql || { echo -e "\033[1;31m Échec: Import SQL"; exit 1; }
docker exec -it lxp-mongodb mongorestore --db lxp /dump-mongo || { echo -e "\033[1;31m Échec: Import MongoDB"; exit 1; }

echo -e "\033[0;32m Configuration du projet ANDRIA terminée avec succès."
echo "Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet"
