#!/bin/bash
. ./deployment/database-urls.sh

restore_data=false
demo_mode=false
# Dossier des données à restaurer. Le jeu de démonstration vit à part et est
# versionné, contrairement aux dumps de travail qui restent locaux.
dump_dir="./dumps"

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

if [ "$restore_data" = false ]; then
  echo "Nettoyage des données existantes..."
  ./init-scripts/clean-project-data.sh || { echo -e "\033[1;31m Échec: Nettoyage des données"; exit 1; }
fi

echo "Installation des dépendances racine..."
npm ci --ignore-scripts || { echo -e "\033[1;31m Échec: Installation des dépendances racine"; exit 1; }

echo "Installation des dépendances API..."
npm ci --prefix api || { echo -e "\033[1;31m Échec: Installation des dépendances API"; exit 1; }

echo "Installation des dépendances frontend..."
npm ci --prefix front || { echo -e "\033[1;31m Échec: Installation des dépendances frontend"; exit 1; }

echo "Copie des fichiers .env..."
# If .env in api does not exist, copy .env.example to .env
if [ ! -f "./api/.env" ]; then
  cp ./api/env.example ./api/.env || { echo -e "\033[1;31m Échec: Copie des variables d'environnement"; exit 1; }
fi
cp ./front/env.example ./front/.env || { echo -e "\033[1;31m Échec: Copie des variables d'environnement"; exit 1; }

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

echo "Démarrage des containers Docker..."
docker compose up -d || { echo -e "\033[1;31m Échec: Démarrage des containers"; exit 1; }

echo "Génération des modèles Prisma..."
npx prisma generate || { echo -e "\033[1;31m Échec: Génération Prisma"; exit 1; }

echo "Attente de l'initialisation complète de PostgreSQL..."
# Utilisation de la variable POSTGRES_USER issue du .env (avec "postgres" comme fallback)
tries=0
max_tries=30
until docker exec lxp-prisma pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  tries=$((tries + 1))
  if ! docker inspect -f '{{.State.Running}}' lxp-prisma 2>/dev/null | grep -q true; then
    echo -e "\033[1;31mÉchec: le conteneur PostgreSQL lxp-prisma n'est pas en cours d'exécution.\033[0m"
    docker compose logs --tail=80 db-pg
    exit 1
  fi
  if [ "$tries" -ge "$max_tries" ]; then
    echo -e "\033[1;31mÉchec: PostgreSQL n'est pas prêt après $((max_tries * 2)) secondes.\033[0m"
    docker compose logs --tail=80 db-pg
    exit 1
  fi
  echo "PostgreSQL n'est pas encore prêt..."
  sleep 2
done

echo "Exécution des migrations..."
npx prisma migrate deploy || { echo -e "\033[1;31m Échec: Migrations"; exit 1; }

echo "PostgreSQL est prêt !"
if [ "$restore_data" = true ]; then
  echo "Restauration des données de démonstration..."

  # Restauration PostgreSQL
  if [[ -f "$dump_dir/dump-pgsql.sql" ]]; then
    echo "Dump PostgreSQL trouvé, injection en cours..."
    docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" < "$dump_dir/dump-pgsql.sql" || { echo -e "\033[1;31m Échec: Import SQL"; exit 1; }
  else
    echo "Aucun fichier $dump_dir/dump-pgsql.sql trouvé. L'import PostgreSQL est ignoré."
  fi

  # Restauration MongoDB
  if [[ -d "$dump_dir/dump-mongo" ]]; then
    echo "Dossier de dump MongoDB trouvé, injection en cours..."
    docker cp "$dump_dir/dump-mongo" lxp-mongo:/dump-mongo || { echo -e "\033[1;31m Échec: Copie du dump Mongo"; exit 1; }
    docker exec -i lxp-mongo mongorestore --username "${MONGO_ADMIN_USERNAME:-root}" --password "${MONGO_ADMIN_PASSWORD:-root}" --authenticationDatabase admin --nsInclude="lxp.*" /dump-mongo || { echo -e "\033[1;31m Échec: Import MongoDB"; exit 1; }
  else
    echo "Aucun dossier $dump_dir/dump-mongo trouvé. L'import MongoDB est ignoré."
  fi

  echo "Restauration des fichiers d'activités..."
  if [[ -d "$dump_dir/activities" ]]; then
    mkdir -p ./uploads/
    rm -rf ./uploads/activities
    cp -R "$dump_dir/activities" ./uploads/ || { echo -e "\033[1;31m Échec: Copie fichiers activités"; exit 1; }
    echo -e "\033[0;32m Activités restaurées.\033[0m"
  else
    echo -e "\033[1;33m Dossier $dump_dir/activities introuvable, restauration ignorée."
  fi
fi

if [ "$demo_mode" = true ]; then
  echo "Préparation des comptes de démonstration..."
  npm run demo:seed || { echo -e "\033[1;31m Échec: Comptes de démonstration"; exit 1; }
fi

echo "🔧 Notification des triggers pour le serveur IA..."
npm run notify-triggers || { echo -e "\033[1;31m Échec: Notification des triggers"; exit 1; }

if [ "$restore_data" = false ]; then
  echo "Génération de la clé JWT de la création du premier utilisateur admin..."
  npm run generate-activation-key || { echo -e "\033[1;31m Échec: Génération de la clé d'activation"; exit 1; }
fi

if [ "$demo_mode" = true ]; then
  echo -e "\033[0;32mInstance de démonstration ANDRIA prête.\033[0m"
elif [ "$restore_data" = true ]; then
  echo -e "\033[0;32mConfiguration du projet ANDRIA avec les données de démonstration terminée avec succès.\033[0m"
else
  echo -e "\033[0;32mConfiguration du projet ANDRIA à partir de bases de données vides terminée avec succès.\033[0m"
fi
echo -e "\033[30;47m Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet. \033[0m"
