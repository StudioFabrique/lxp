#!/usr/bin/env bash
. ./deployment/database-urls.sh

restore_data=false
demo_mode=false
# Dossier des données à restaurer. Le jeu de démonstration vit à part et est
# versionné, contrairement aux dumps de travail qui restent locaux.
dump_dir="./dumps"

. ./init-scripts/ui.sh
# Les scripts appelés ici n'affichent pas leur propre en-tête.
export ANDRIA_INIT=1

case "${1:-}" in
  "") ;;
  --with-data) restore_data=true ;;
  --demo)
    restore_data=true
    demo_mode=true
    dump_dir="./dumps/demo"
    ;;
  *)
    echo "Usage : npm run init [-- --with-data | --demo]"
    exit 1
    ;;
esac

if [ "$demo_mode" = true ]; then init_mode="demonstration"
elif [ "$restore_data" = true ]; then init_mode="avec données"
else init_mode="installation à partir de zéro"; fi
box "$c_cyan$c_bold" "ANDRIA  Initialisation du projet" "Mode : $init_mode"
show_cancel_hint

install_dependencies() {
  label="$1"
  directory="$2"
  shift 2

  if [ -d "$directory/node_modules" ] \
    && npm ls --depth=0 --prefix "$directory" > /dev/null 2>&1; then
    ok "Dépendances $label à jour"
    return
  fi

  info "Installation des dépendances $label"
  npm ci "$@" || { fail "Installation des dépendances $label"; exit 1; }
}

read_env_value() {
  key="$1"
  file="$2"
  value=$(grep -E "^${key}=" "$file" | tail -n 1 | cut -d'=' -f2-)
  value=${value#\"}
  value=${value%\"}
  printf '%s' "$value"
}

write_env_value() {
  key="$1"
  value="$2"
  file="$3"
  temporary_file="${file}.tmp"
  escaped_value=${value//\\/\\\\}
  escaped_value=${escaped_value//\"/\\\"}
  found=false
  : > "$temporary_file"

  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      "$key="*)
        printf '%s="%s"\n' "$key" "$escaped_value" >> "$temporary_file"
        found=true
        ;;
      *) printf '%s\n' "$line" >> "$temporary_file" ;;
    esac
  done < "$file"

  if [ "$found" = false ]; then
    printf '%s="%s"\n' "$key" "$escaped_value" >> "$temporary_file"
  fi
  mv "$temporary_file" "$file"
}

prompt_env_value() {
  key="$1"
  label="$2"
  secret="${3:-false}"
  file="$4"
  optional="${5:-false}"
  current_value=$(read_env_value "$key" "$file")

  while true; do
    if [ -n "$current_value" ]; then
      prompt="$key — $label [$current_value] : "
    else
      prompt="$key — $label : "
    fi

    if [ "$secret" = true ]; then
      read -r -s -p "$prompt" entered_value
      echo
    else
      read -r -p "$prompt" entered_value
    fi

    value="${entered_value:-$current_value}"
    if [ -n "$value" ] || [ "$optional" = true ]; then
      write_env_value "$key" "$value" "$file"
      return
    fi
    warn "Une valeur est requise pour $key"
  done
}

configure_development_mailer() {
  file="$1"
  if [ ! -t 0 ]; then
    fail "la configuration du mailer en développement nécessite un terminal interactif."
    exit 1
  fi

  while true; do
    read -r -p "Souhaitez-vous activer le mailer et obliger la vérification par mail des comptes utilisateurs ? [y/N] : " enable_mailer
    case "$enable_mailer" in
      o|O|oui|Oui|OUI|y|Y|yes|YES)
        # Conserver le mailer désactivé tant que sa configuration est incomplète.
        # Ainsi, une interruption relancera l'assistant au prochain `npm run init`.
        write_env_value "MAILER_DISABLED" "true" "$file"
        break
        ;;
      ""|n|N|non|Non|NON|no|NO)
        write_env_value "MAILER_DISABLED" "true" "$file"
        ok "Mailer désactivé : les comptes sont activés sans vérification par email."
        ok "Configuration enregistrée dans api/.env"
        return
        ;;
      *) echo "Répondez par y ou n." ;;
    esac
  done
  prompt_env_value "MAILER_EMAIL" "Compte email SMTP" false "$file"
  prompt_env_value "MAILER_PASSWORD" "Mot de passe SMTP" true "$file"
  prompt_env_value "MAILER_SMTP" "Serveur SMTP" false "$file"
  prompt_env_value "MAILER_DEV_RECIPIENT" "Destinataire des emails en développement" false "$file"
  prompt_env_value "MAILER_SMTP_PORT" "Port SMTP" false "$file"
  prompt_env_value "MAILER_FROM" "Expéditeur (nom et adresse)" false "$file"
  write_env_value "MAILER_DISABLED" "false" "$file"
  ok "Configuration enregistrée dans api/.env"
}

configure_development_password() {
  file="$1"
  configured_password=$(read_env_value "DEV_TEMPORARY_USER_PASSWORD" "$file")
  if [ "$(read_env_value "MAILER_DISABLED" "$file")" != "true" ] \
    || { [ -n "$configured_password" ] && [ "$configured_password" != "false" ]; }; then
    return
  fi

  if (( BASH_VERSINFO[0] >= 4 )); then
    read -r -e -i "Abcdef@123456" -p "DEV_TEMPORARY_USER_PASSWORD — Mot de passe temporaire des utilisateurs : " entered_password
  else
    read -r -e -p "DEV_TEMPORARY_USER_PASSWORD — Mot de passe temporaire des utilisateurs [Abcdef@123456] : " entered_password
  fi
  write_env_value "DEV_TEMPORARY_USER_PASSWORD" "${entered_password:-Abcdef@123456}" "$file"
}

development_mailer_needs_configuration() {
  file="$1"
  if [ "$(read_env_value "MAILER_DISABLED" "$file")" != "false" ]; then
    return 0
  fi

  for key in MAILER_EMAIL MAILER_PASSWORD MAILER_SMTP MAILER_DEV_RECIPIENT MAILER_SMTP_PORT MAILER_FROM; do
    if [ -z "$(read_env_value "$key" "$file")" ]; then
      return 0
    fi
  done
  return 1
}

configure_development_env() {
  file="$1"
  environment=$(read_env_value "ENVIRONMENT" "$file")
  if [ "$environment" != "development" ]; then
    return
  fi
  if [ ! -t 0 ]; then
    fail "la création de api/.env en développement nécessite un terminal interactif."
    exit 1
  fi

  step "Services de développement"
  prompt_env_value "UNSPLASH_ACCESS_KEY" "Clé d'accès Unsplash (optionnel)" false "$file" true
  configure_development_mailer "$file"
  configure_development_password "$file"
}

if [ "$restore_data" = false ]; then
  # Une sauvegarde locale (npm run dump) permet de proposer sa récupération.
  # Sans terminal interactif, le nettoyage reste automatique comme avant.
  work_dump_dir="./api/dumps"
  has_backup=false
  if [ -f "$work_dump_dir/dump-pgsql.sql" ] || [ -d "$work_dump_dir/dump-mongo" ]; then
    has_backup=true
  fi

  # Sans volume Docker existant, il n'y a aucune donnée à perdre : pas de question.
  if [ -t 0 ] && has_project_volumes; then
    echo
    if [ "$has_backup" = true ]; then
      warn "Une sauvegarde de données a été détectée dans api/dumps"
      read -r -p "Supprimer toutes les données existantes ? [y/N] (N : récupérer les données sauvegardées) : " wipe_data
      if [[ ! "$wipe_data" =~ ^[Yy]$ ]]; then
        # Les volumes sont tout de même recréés : la restauration cible des bases vides.
        restore_data=true
        init_mode="avec données (sauvegarde récupérée)"
        info "Les données sauvegardées seront récupérées"
      fi
    else
      warn "Aucune sauvegarde réalisée"
      read -r -p "Êtes-vous sûr de réinitialiser les volumes des conteneurs ? [y/N] : " confirm_reset
      if [[ ! "$confirm_reset" =~ ^[Yy]$ ]]; then
        echo "Initialisation annulée, aucune donnée supprimée."
        exit 0
      fi
    fi
  fi

  step "Nettoyage des données existantes"
  ./init-scripts/clean-project-data.sh || { fail "Nettoyage des données"; exit 1; }
fi

install_dependencies "racine" "." --ignore-scripts
install_dependencies "API" "api" --prefix api
install_dependencies "frontend" "front" --prefix front

step "Configuration de l'environnement"
# If .env in api does not exist, copy .env.example to .env
api_env_created=false
if [ ! -f "./api/.env" ]; then
  if grep -q '^ENVIRONMENT=development' ./api/env.example && [ ! -t 0 ]; then
    fail "la création de api/.env en développement nécessite un terminal interactif."
    exit 1
  fi
  cp ./api/env.example ./api/.env || { fail "Copie des variables d'environnement"; exit 1; }
  api_env_created=true
  configure_development_env "./api/.env"
fi
if [ "$api_env_created" = false ] \
  && [ "$(read_env_value "ENVIRONMENT" "./api/.env")" = "development" ] \
  && development_mailer_needs_configuration "./api/.env"; then
  step "Mailer de développement"
  configure_development_mailer "./api/.env"
  configure_development_password "./api/.env"
fi
cp ./front/env.example ./front/.env || { fail "Copie des variables d'environnement"; exit 1; }

# Chargement des variables d'environnement (sélectif pour éviter les erreurs
# de syntaxe sur des lignes comme MAILER_SMTP ou MAILER_FROM qui ne sont pas du bash).
if [ -f "./api/.env" ]; then
  POSTGRES_USER=$(grep '^POSTGRES_USER=' ./api/.env | cut -d'=' -f2)
  POSTGRES_PASSWORD=$(grep '^POSTGRES_PASSWORD=' ./api/.env | cut -d'=' -f2)
  POSTGRES_DB=$(grep '^POSTGRES_DB=' ./api/.env | cut -d'=' -f2)
  MONGO_ADMIN_USERNAME=$(grep '^MONGO_ADMIN_USERNAME=' ./api/.env | cut -d'=' -f2)
  MONGO_ADMIN_PASSWORD=$(grep '^MONGO_ADMIN_PASSWORD=' ./api/.env | cut -d'=' -f2)
fi

# Prisma a besoin de DATABASE_URL, mais le développeur ne conserve que les
# identifiants dans api/.env. La valeur n'existe que dans ce processus.
database_build_urls localhost 5500 localhost 27000

# Naviguer vers le repertoire api pour la suite
cd api

step_cmd "Conteneurs Docker"
docker compose --progress plain up -d || { fail "Démarrage des containers"; exit 1; }

step_cmd "Contrat Prisma"
npx prisma contract emit || { fail "Émission du contrat Prisma"; exit 1; }

step_cmd "Base de données PostgreSQL"
# Utilisation de la variable POSTGRES_USER issue du .env (avec "postgres" comme fallback)
tries=0
max_tries=30
until docker exec lxp-prisma pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  tries=$((tries + 1))
  if ! docker inspect -f '{{.State.Running}}' lxp-prisma 2>/dev/null | grep -q true; then
    fail "le conteneur PostgreSQL lxp-prisma n'est pas en cours d'exécution."
    docker compose logs --tail=80 db-pg
    exit 1
  fi
  if [ "$tries" -ge "$max_tries" ]; then
    fail "PostgreSQL n'est pas prêt après $((max_tries * 2)) secondes."
    docker compose logs --tail=80 db-pg
    exit 1
  fi
  info "PostgreSQL n est pas encore prêt"
  sleep 2
done
ok "PostgreSQL prêt"

step_cmd "Migrations"
npx prisma db migrate || { fail "Migrations"; exit 1; }

if [ "$restore_data" = true ]; then
  step_cmd "Restauration des données"

  # Restauration PostgreSQL
  if [[ -f "$dump_dir/dump-pgsql.sql" ]]; then
    info "Injection du dump PostgreSQL"
    # Prisma 7 exposait Course.dates comme une liste non nullable, mais sa DDL
    # PostgreSQL autorisait encore NULL. Prisma 8 aligne le stockage sur le type.
    # La restauration normalise ces anciennes lignes dans une transaction unique.
    docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma \
      psql --single-transaction -v ON_ERROR_STOP=1 \
      -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" \
      -c 'ALTER TABLE public."Course" ALTER COLUMN "dates" DROP NOT NULL' \
      -f - \
      -c 'UPDATE public."Course" SET "dates" = ARRAY[]::jsonb[] WHERE "dates" IS NULL; ALTER TABLE public."Course" ALTER COLUMN "dates" SET NOT NULL' \
      < "$dump_dir/dump-pgsql.sql" || { fail "Import SQL"; exit 1; }
  else
    warn "Aucun fichier $dump_dir/dump-pgsql.sql, import PostgreSQL ignoré"
  fi

  # Restauration MongoDB
  if [[ -d "$dump_dir/dump-mongo" ]]; then
    info "Injection du dump MongoDB"
    docker cp "$dump_dir/dump-mongo" lxp-mongo:/dump-mongo || { fail "Copie du dump Mongo"; exit 1; }
    docker exec -i lxp-mongo mongorestore --username "${MONGO_ADMIN_USERNAME:-root}" --password "${MONGO_ADMIN_PASSWORD:-root}" --authenticationDatabase admin --nsInclude="lxp.*" /dump-mongo || { fail "Import MongoDB"; exit 1; }
  else
    warn "Aucun dossier $dump_dir/dump-mongo, import MongoDB ignoré"
  fi

  info "Restauration des fichiers d'activités"
  if [[ -d "$dump_dir/activities" ]]; then
    mkdir -p ./uploads/
    rm -rf ./uploads/activities
    cp -R "$dump_dir/activities" ./uploads/ || { fail "Copie fichiers activités"; exit 1; }
    ok "Activités restaurées"
  else
    warn "Dossier $dump_dir/activities introuvable, restauration ignorée"
  fi
fi

if [ "$demo_mode" = true ]; then
  step_cmd "Comptes de démonstration"
  npm run demo:seed || { fail "Comptes de démonstration"; exit 1; }
fi

step_cmd "Triggers du serveur IA"
npm run notify-triggers || { fail "Notification des triggers"; exit 1; }

if [ "$restore_data" = false ]; then
  step_cmd "Clé d'activation du premier administrateur"
  npm run generate-activation-key || { fail "Génération de la clé d'activation"; exit 1; }
fi

close_step
echo
if [ "$demo_mode" = true ]; then
  box "$c_green$c_bold" "TERMINÉ  Instance de démonstration ANDRIA prête"
elif [ "$restore_data" = true ]; then
  box "$c_green$c_bold" "TERMINÉ  ANDRIA configuré avec les données de démonstration"
else
  box "$c_green$c_bold" "TERMINÉ  ANDRIA configuré"
fi
cd ..
if [ ! -t 0 ]; then
  info "Prochaine étape : lancer npm run dev à la racine du projet"
  exit 0
fi

while true; do
  read -r -p "Lancer npm run dev maintenant ? [y/N] : " start_dev
  case "$start_dev" in
    o|O|oui|Oui|OUI|y|Y|yes|YES)
      exec npm run dev
      ;;
    ""|n|N|non|Non|NON|no|NO)
      info "Lancer npm run dev plus tard à la racine du projet"
      break
      ;;
    *) echo "Répondez par y ou n." ;;
  esac
done
