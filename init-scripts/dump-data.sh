#!/bin/bash

echo -e "\033[1;34mDémarrage de la procédure de sauvegarde des données...\033[0m"

# Chargement des variables d'environnement (sélectif pour éviter les erreurs
# de syntaxe sur des lignes comme SMTP ou FROM qui ne sont pas du bash).
if [ -f "./api/.env" ]; then
  POSTGRES_USER=$(grep '^POSTGRES_USER=' ./api/.env | cut -d'=' -f2)
  POSTGRES_PASSWORD=$(grep '^POSTGRES_PASSWORD=' ./api/.env | cut -d'=' -f2)
  POSTGRES_DB=$(grep '^POSTGRES_DB=' ./api/.env | cut -d'=' -f2)
  MONGO_ADMIN_USERNAME=$(grep '^MONGO_ADMIN_USERNAME=' ./api/.env | cut -d'=' -f2)
  MONGO_ADMIN_PASSWORD=$(grep '^MONGO_ADMIN_PASSWORD=' ./api/.env | cut -d'=' -f2)
fi

# Création du dossier de destination s'il n'existe pas
mkdir -p ./api/dumps

# SAUVEGARDE POSTGRESQL
echo "Sauvegarde de PostgreSQL en cours..."
docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma pg_dump -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" -a > ./api/dumps/dump-pgsql.sql || { echo -e "\033[1;31m ❌ Échec: Dump PostgreSQL"; exit 1; }
echo -e "\033[0;32m Dump PostgreSQL réussi.\033[0m"

# SAUVEGARDE MONGODB
echo "Sauvegarde de MongoDB en cours..."

# Nettoyage de l'ancien dump local s'il existe pour éviter les conflits
rm -rf ./api/dumps/dump-mongo

# Création du dump à l'intérieur du conteneur
docker exec -i lxp-mongo mongodump --username "${MONGO_ADMIN_USERNAME:-root}" --password "${MONGO_ADMIN_PASSWORD:-root}" --authenticationDatabase admin --db "${POSTGRES_DB:-lxp}" --out /dump-mongo || { echo -e "\033[1;31m ❌ Échec: Génération du dump MongoDB"; exit 1; }

# Copie du dump vers le repo
docker cp lxp-mongo:/dump-mongo ./api/dumps/ || { echo -e "\033[1;31m ❌ Échec: Copie du dump MongoDB"; exit 1; }

# Nettoyage du dossier temporaire dans le conteneur pour libérer de l'espace
docker exec -i lxp-mongo rm -rf /dump-mongo

echo -e "\033[0;32m Dump MongoDB réussi.\033[0m"

# SAUVEGARDE DES FICHIERS D'ACTIVITÉS
echo "Sauvegarde des fichiers d'activités..."
if [ -d "./api/uploads/activities" ]; then
  rm -rf ./api/dumps/activities
  cp -R ./api/uploads/activities ./api/dumps/ || { echo -e "\033[1;31m ❌ Échec: Dump activités"; exit 1; }
  echo -e "\033[0;32m Dump activités réussi.\033[0m"
else
  echo -e "\033[1;33m Dossier ./api/uploads/activities introuvable, sauvegarde ignorée.\033[0m"
fi

echo -e "\033[1;32m Les données ont été sauvegardées avec succès dans le dossier ./api/dumps/ \033[0m"
