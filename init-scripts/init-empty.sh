#!/bin/bash
echo "Nettoyage de données existantes..."
./init-scripts/clean-project-data.sh

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
# de syntaxe sur des lignes comme SMTP ou FROM qui ne sont pas du bash).
if [ -f "./api/.env" ]; then
  POSTGRES_USER=$(grep '^POSTGRES_USER=' ./api/.env | cut -d'=' -f2)
  POSTGRES_PASSWORD=$(grep '^POSTGRES_PASSWORD=' ./api/.env | cut -d'=' -f2)
  POSTGRES_DB=$(grep '^POSTGRES_DB=' ./api/.env | cut -d'=' -f2)
fi

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

echo "🔧 Notification des triggers pour le serveur IA..."
npm run notify-triggers || { echo -e "\033[1;31m Échec: Notification des triggers"; exit 1; }

echo "Génération de la clé JWT de la création du premier utilisateur admin..."
npm run generate-activation-key

echo -e "\033[0;32mConfiguration du projet (à partir de bases de données vide) ANDRIA terminée avec succès.\033[0m"
echo -e "\033[30;47m Prochaine étape => Lancer la commande \`npm run dev\` à la racine du projet. \033[0m"
