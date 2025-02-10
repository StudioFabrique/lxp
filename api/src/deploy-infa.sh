#!/bin/bash

set -e  # Arrête le script en cas d'erreur
set -u  # Empêche l'utilisation de variables non définies
set -o pipefail  # Arrête le script si une commande dans un pipeline échoue

echo "🚀 Déploiement des migrations Prisma..."
npx prisma migrate deploy

echo "📦 Exécution des fixtures..."
npx ts-node src/fixtures-infa.ts

echo "✅ Déploiement terminé avec succès !"