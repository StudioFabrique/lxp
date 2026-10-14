#!/usr/bin/env bash
. ./init-scripts/ui.sh

box "$c_cyan$c_bold" "ANDRIA  Sauvegarde des données" "Destination : api/dumps"
show_cancel_hint

step "PostgreSQL"

# Chargement des variables d'environnement (sélectif pour éviter les erreurs
# de syntaxe sur des lignes comme MAILER_SMTP ou MAILER_FROM qui ne sont pas du bash).
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
info "Export des données PostgreSQL"
docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma pg_dump -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" -a --exclude-table-data=public._prisma_migrations > ./api/dumps/dump-pgsql.sql || { fail "Dump PostgreSQL"; exit 1; }
ok "Dump PostgreSQL réussi"

# SAUVEGARDE MONGODB
step "MongoDB"
info "Export des données MongoDB"

# Nettoyage de l'ancien dump local s'il existe pour éviter les conflits
rm -rf ./api/dumps/dump-mongo

# Création du dump à l'intérieur du conteneur
docker exec -i lxp-mongo mongodump --username "${MONGO_ADMIN_USERNAME:-root}" --password "${MONGO_ADMIN_PASSWORD:-root}" --authenticationDatabase admin --db "${POSTGRES_DB:-lxp}" --out /dump-mongo || { fail "Génération du dump MongoDB"; exit 1; }

# Copie du dump vers le repo
docker cp lxp-mongo:/dump-mongo ./api/dumps/ || { fail "Copie du dump MongoDB"; exit 1; }

# Nettoyage du dossier temporaire dans le conteneur pour libérer de l'espace
docker exec -i lxp-mongo rm -rf /dump-mongo

ok "Dump MongoDB réussi"

# SAUVEGARDE DES FICHIERS D'ACTIVITÉS
step "Fichiers d'activités"
if [ -d "./api/uploads/activities" ]; then
  rm -rf ./api/dumps/activities
  cp -R ./api/uploads/activities ./api/dumps/ || { fail "Dump activités"; exit 1; }
  ok "Dump activités réussi"
else
  warn "Dossier ./api/uploads/activities introuvable, sauvegarde ignorée"
fi

echo
box "$c_green$c_bold" "SAUVEGARDE TERMINÉE" "Données enregistrées dans ./api/dumps/"
