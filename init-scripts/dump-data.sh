#!/bin/bash

echo -e "\033[1;34mDémarrage de la procédure de sauvegarde des données...\033[0m"

# Chargement des variables d'environnement
if [ -f "./api/.env" ]; then
  set -o allexport
  source ./api/.env
  set +o allexport
else
  echo -e "\033[1;33m Fichier ./api/.env introuvable. Utilisation des valeurs par défaut (postgres/lxp).\033[0m"
fi

# Création du dossier de destination s'il n'existe pas
mkdir -p ./api/dumps

# SAUVEGARDE POSTGRESQL
echo "Sauvegarde de PostgreSQL en cours..."
docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma pg_dump -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" -a > ./dumps/dump-pgsql.sql || { echo -e "\033[1;31m ❌ Échec: Dump PostgreSQL"; exit 1; }
echo -e "\033[0;32m Dump PostgreSQL réussi.\033[0m"

# SAUVEGARDE MONGODB
echo "Sauvegarde de MongoDB en cours..."

# Nettoyage de l'ancien dump local s'il existe pour éviter les conflits
rm -rf ./api/dumps/dump-mongo

# Création du dump à l'intérieur du conteneur
docker exec -i lxp-mongo mongodump --db "${POSTGRES_DB:-lxp}" --out /dump-mongo || { echo -e "\033[1;31m ❌ Échec: Génération du dump MongoDB"; exit 1; }

# Copie du dump vers le repo
docker cp lxp-mongo:/dump-mongo ./api/dumps/ || { echo -e "\033[1;31m ❌ Échec: Copie du dump MongoDB"; exit 1; }

# Nettoyage du dossier temporaire dans le conteneur pour libérer de l'espace
docker exec -i lxp-mongo rm -rf /dump-mongo

echo -e "\033[0;32m Dump MongoDB réussi.\033[0m"

echo -e "\033[1;32m Les données ont été sauvegardées avec succès dans le dossier ./api/dumps/ \033[0m"
