#!/bin/bash
echo "Installation des dépendances racine..."
# Le script lifecycle racine `install` installe aussi les sous-projets. On le
# désactive ici, puis on lance chaque installation explicitement une seule fois.
npm ci --ignore-scripts || { echo -e "\033[1;31m Échec: Installation des dépendances racine"; exit 1; }

echo "Installation des dépendances API..."
npm run install-server || { echo -e "\033[1;31m Échec: Installation des dépendances API"; exit 1; }

echo "Installation des dépendances frontend..."
npm run install-client || { echo -e "\033[1;31m Échec: Installation des dépendances frontend"; exit 1; }

echo "Copie des fichiers .env..."
cp ./api/env.example ./api/.env && \
cp ./front/env.example ./front/.env || { echo -e "\033[1;31m Échec: Copie des variables d'environnement"; exit 1; }

# Chargement des variables d'environnement
set -o allexport
source ./api/.env
set +o allexport

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
echo "Restauration des données fictives..."

# Restauration PostgreSQL
if [[ -f "./dumps/dump-pgsql.sql" ]]; then
  echo "Dump PostgreSQL trouvé, injection en cours..."
  docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" lxp-prisma psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-lxp}" < ./dumps/dump-pgsql.sql || { echo -e "\033[1;31m Échec: Import SQL"; exit 1; }
else
  echo "Aucun fichier ./dumps/dump-pgsql.sql trouvé. L'import PostgreSQL est ignoré."
fi

# Restauration MongoDB
if [[ -d "./dumps/dump-mongo" ]]; then
  echo "Dossier de dump MongoDB trouvé, injection en cours..."
  docker cp ./dumps/dump-mongo lxp-mongo:/dump-mongo || { echo -e "\033[1;31m Échec: Copie du dump Mongo"; exit 1; }
  docker exec -i lxp-mongo mongorestore --nsInclude="lxp.*" /dump-mongo || { echo -e "\033[1;31m Échec: Import MongoDB"; exit 1; }
else
  echo "Aucun dossier ./dumps/dump-mongo trouvé. L'import MongoDB est ignoré."
fi

echo "Copie des fichiers d'activités en html..."
if [ -d "../init-scripts/activities" ]; then
  mkdir -p ./uploads/
  cp -R ../init-scripts/activities ./uploads/ || { echo -e "\033[1;31m Échec: Copie fichiers texte html"; exit 1; }
else
  echo "\033[1;33m Dossier ../init-scripts/activities introuvable, copie ignorée."
fi

echo "🔧 Notification des triggers pour le serveur IA..."
npm run notify-triggers || { echo -e "\033[1;31m Échec: Notification des triggers"; exit 1; }

echo -e "\033[0;32mConfiguration du projet ANDRIA terminée avec succès.\033[0m"
echo -e "\033[30;47m Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet. \033[0m"
