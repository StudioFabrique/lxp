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

echo "Attente de l'initialisation complète de PostgreSQL..."
until docker exec lxp-prisma pg_isready -U postgres > /dev/null 2>&1; do
  echo "PostgreSQL n'est pas encore prêt..."
  sleep 2
done

echo "Exécution des migrations..."
npx prisma migrate deploy || { echo -e "\033[1;31m Échec: Migrations"; exit 1; }

echo "Restauration des données..."
# PostgreSQL
echo "PostgreSQL est prêt !"

docker exec -i -e PGPASSWORD=postgres lxp-prisma psql -U postgres -d lxp < ./dumps/dump-pgsql.sql || { echo -e "\033[1;31m Échec: Import SQL"; exit 1; }
# MongoDB
docker cp ./dumps/dump-mongo lxp-mongo:/dump-mongo || { echo -e "\033[1;31m Échec: Copie du dump Mongo"; exit 1; }
docker exec -i lxp-mongo mongorestore --nsInclude="lxp.*" /dump-mongo || { echo -e "\033[1;31m Échec: Import MongoDB"; exit 1; }

echo "Copie des fichiers d'activités en html..."
cp -R ../init/activities ./uploads/ || { echo -e "\033[1;31m Échec: Copie fichiers texte html"; exit 1; }

echo -e "\033[0;32m Configuration du projet ANDRIA terminée avec succès."
echo "Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet"
