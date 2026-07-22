#!/bin/bash
echo "Nettoyage de données existantes..."
./init-scripts/clean-project-data.sh

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
until docker exec lxp-prisma pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
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
