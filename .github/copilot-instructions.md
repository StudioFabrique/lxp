# Copilot Instructions for LXP Project

## Vue d'ensemble de l'architecture
- **Monorepo** structuré en plusieurs dossiers :
  - `api/` : Backend Node.js/TypeScript (Express, Prisma)
  - `api-ia/` : Microservice Python (FastAPI, IA)
  - `front/` : Frontend React (Vite, TypeScript)
- Communication entre services via API REST et fichiers partagés (uploads, certs).
- Utilisation intensive de Docker et docker-compose pour l'orchestration locale et CI/CD.

## Workflows de développement
- **Démarrage local** :
  - Utiliser `docker-compose.yml` ou `dev-docker-compose.yml` à la racine pour lancer tous les services.
  - Pour le backend seul : `cd api && docker-compose up`.
  - Pour l'IA : `cd api-ia && ./start-dev.sh`.
  - Pour le front : `cd front && npm run dev`.
- **Tests backend** :
  - `cd api && npm run test` (Jest)
  - Jeux de données : `npm run fixtures` (voir `src/fixtures*.ts`)
- **Migrations Prisma** :
  - `npx prisma migrate dev --create-only --name <nom>` puis `npx prisma migrate deploy`
  - Résolution de désynchronisation : voir section "Migration" du `readme.md`

## Conventions et patterns spécifiques
- **Backend** :
  - Structure Express classique, routes dans `src/routes/`, logique métier dans `src/services/`, modèles Prisma dans `prisma/schema.prisma`.
  - Utilisation de middlewares personnalisés dans `src/middleware/`.
  - Les scripts de fixtures sont dans `src/fixtures*.ts`.
- **Frontend** :
  - React + Vite, composants dans `src/components/`, vues dans `src/views/`.
  - Utilisation de hooks personnalisés dans `src/hooks/`.
- **IA** :
  - FastAPI, endpoints dans `app/routes/`, logique métier dans `app/repositories/` et `app/models/`.

## Intégrations et dépendances externes
- **Prisma** pour ORM côté Node.js.
- **FastAPI** pour le microservice IA Python.
- **Docker** pour l'orchestration, y compris en CI/CD (GitHub Actions).
- **Secrets et déploiement** : voir section "Déploiement" du `readme.md` pour la gestion des secrets et du SSH.

## Exemples de fichiers clés
- `api/prisma/schema.prisma` : Modèle de données principal.
- `api/src/routes/` : Définition des endpoints backend.
- `api-ia/app/routes/` : Endpoints IA.
- `front/src/components/` : Composants UI réutilisables.

## Conseils pour agents IA
- Respecter la structure existante pour chaque service.
- Privilégier les scripts npm/yarn existants pour build/test/fixtures.
- Toujours vérifier les dépendances croisées (ex : modifications du schéma Prisma → migration + régénération client).
- Pour toute modification majeure, documenter dans le `readme.md` du dossier concerné.
