#!/usr/bin/env bash
. ./init-scripts/ui.sh
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

box "$c_cyan$c_bold" "ANDRIA  Sauvegarde des données" "Destination : api/dumps"
show_cancel_hint

step "PostgreSQL"

# Identifiants : Infisical si le mode est actif, sinon api/.env.
load_secrets || { fail "Chargement des secrets Infisical"; exit 1; }
load_api_env_file
apply_local_defaults

# Création du dossier de destination s'il n'existe pas
mkdir -p ./api/dumps

# SAUVEGARDE POSTGRESQL
info "Export des données PostgreSQL"
lxp_compose exec -T -e PGPASSWORD="$POSTGRES_PASSWORD" db-pg pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -a --exclude-table-data=public._prisma_migrations > ./api/dumps/dump-pgsql.sql || { fail "Dump PostgreSQL"; exit 1; }
ok "Dump PostgreSQL réussi"

# SAUVEGARDE MONGODB
step "MongoDB"
info "Export des données MongoDB"

# Nettoyage de l'ancien dump local s'il existe pour éviter les conflits
rm -rf ./api/dumps/dump-mongo

# Création du dump à l'intérieur du conteneur
lxp_compose exec -T db-mongo mongodump --username "$MONGO_ADMIN_USERNAME" --password "$MONGO_ADMIN_PASSWORD" --authenticationDatabase admin --db "$MONGO_DATABASE" --out /dump-mongo || { fail "Génération du dump MongoDB"; exit 1; }

# Copie du dump vers le repo
lxp_compose cp db-mongo:/dump-mongo ./api/dumps/ || { fail "Copie du dump MongoDB"; exit 1; }

# Nettoyage du dossier temporaire dans le conteneur pour libérer de l'espace
lxp_compose exec -T db-mongo rm -rf /dump-mongo

ok "Dump MongoDB réussi"

# SAUVEGARDE DES FICHIERS D'ACTIVITÉS
step "Fichiers d'activités"
if [[ -d "./api/uploads/activities" ]]; then
  rm -rf ./api/dumps/activities
  cp -R ./api/uploads/activities ./api/dumps/ || { fail "Dump activités"; exit 1; }
  ok "Dump activités réussi"
else
  warn "Dossier ./api/uploads/activities introuvable, sauvegarde ignorée"
fi

echo
box "$c_green$c_bold" "SAUVEGARDE TERMINÉE" "Données enregistrées dans ./api/dumps/"
