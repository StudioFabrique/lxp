# Structure et architecture

Le dépôt est un monorepo à deux applications, pilotées depuis le
`package.json` racine :

```bash
lxp/
├── api/               # API Node.js / Express (TypeScript, ESM natif)
├── front/             # Application React (Vite, TypeScript)
├── deployment/        # Fichiers de déploiement (Caddy, compose)
├── docs/              # Documentation du projet
├── init-scripts/      # Scripts d'initialisation et de purge des données
└── package.json       # Scripts transverses (install, dev, build, test)
```

En production, l'API sert le build du front (voir `api/src/app.ts`).

Le code du service IA est présent dans un dépôt séparé (`ia-lxp`), les requêtes vers ce service se font depuis `api/src/services/ai/`.

Voir [Service IA et synchronisation en développement](developpement-ia.md).

# 1. Structure et architecture front

## L'arborescence globale du projet

```bash
front/src/
├── app/               # Point d'entrée applicatif et routeurs racine
│   ├── App.tsx        # Uniquement les Providers globaux
│   ├── router.tsx     # Assemble les routes auth, admin et apprenant
│   ├── router.admin.tsx
│   └── router.student.tsx
├── assets/            # Images, logos, fichiers statiques
├── components/        # UI générique et transverse (voir ci-dessous)
├── config/            # Constantes, URLs, thèmes, schémas de validation
├── features/          # Les modules métiers (voir ci-dessous)
├── hooks/             # Hooks React réutilisables (pagination, upload...)
├── lib/               # Configuration des librairies tierces
│   ├── axios.ts       # Client HTTP + refresh de session automatique
│   └── react-query.ts # QueryClient TanStack Query
├── rbac/              # Gestion des droits (CASL) : ability et Provider
├── store/             # État global : Auth, Theme, Chatbot (Context React)
├── test/              # Setup Vitest
├── utils/             # Fonctions pures et interfaces de domaine partagées
├── index.css          # Feuille Tailwind + DaisyUI
└── main.tsx           # Point de montage React (createRoot)
```

## Les composants transverses (/src/components)

`components/` ne contient que ce qui est réutilisable hors d'une feature :

```bash
components/
├── UI/                # Briques génériques (modales, tables, uploads...)
├── form/              # Champs de formulaire partagés
├── guards/            # Garde-fous de routes (RouteGuard, RequireAbility...)
├── sidebar/           # Navigation principale
├── tiptap-editor/     # Éditeur de contenu riche
└── wrappers/          # Enveloppes et layouts
    └── layouts/       # AdminLayout, StudentLayout, ErrorBoundary
```

Un composant utilisé par une seule feature reste dans cette feature.

## La structure interne d'une Feature (/src/features)

```bash
features/parcours/
├── api/               # Accès HTTP à l'API
│   ├── parcours.api.ts   # Fonctions axios typées (aucun hook ici)
│   └── parcours.keys.ts  # Fabrique de query keys TanStack Query
├── components/        # Composants UI spécifiques à la feature
├── helpers/           # Fonctions pures propres à la feature
├── hooks/             # Hooks TanStack Query et logique React locale
├── interfaces/        # Types TypeScript propres à la feature
├── views/             # Les pages (ex: ParcoursHome.tsx, ParcoursEdit.tsx)
├── parcours.schema.ts # Schémas de validation Zod des formulaires
└── routes.tsx         # Le sous-routeur de cette feature
```

La convention est de séparer strictement les trois couches :

1. `api/*.api.ts` : appels réseau, typés, sans React ;
2. `hooks/` : `useQuery` / `useMutation` construits sur ces appels, avec les
   clés de `api/*.keys.ts` ;
3. `views/` et `components/` : affichage, qui ne consomme que les hooks.

## Le routage

`app/router.tsx` assemble trois ensembles de routes : `authRoutes` (exporté
par la feature `auth`), `adminRoutes` et `studentRoutes`. Chaque groupe
compose les `routes.tsx` des features concernées sous son layout
(`AdminLayout` ou `StudentLayout`), et les protège avec les gardes de
`components/guards/`.

## Les droits (RBAC)

Les permissions sont portées par CASL. `rbac/ability.ts` définit les actions
et les sujets, `rbac/AbilityProvider.tsx` expose l'ability de l'utilisateur
connecté. Le front s'en sert pour masquer ou désactiver l'interface ; la
décision qui fait autorité reste celle de l'API.

# 2. Structure et architecture back

## L'arborescence globale du projet

```bash
api/
├── prisma/
│   ├── schema.prisma  # Modèle relationnel PostgreSQL
│   └── migrations/    # Migrations versionnées
├── public/            # Build du front servi en production
├── uploads/           # Fichiers déposés (activités, logo entreprise)
├── tests/             # Tests d'intégration Jest (base Docker dédiée)
└── src/
    ├── app.ts         # Montage Express : sécurité, statique, routeur v1
    ├── server.ts      # Serveur HTTP, Socket.IO, connexion MongoDB
    ├── config/        # Configuration et constantes serveur
    ├── controllers/   # Un fichier http-*.ts par endpoint
    ├── helpers/       # Fonctions pures métier (slugify, progression...)
    ├── middleware/    # Auth, permissions, validation, uploads, logs
    ├── models/        # Accès aux données (Prisma et Mongoose)
    ├── routes/v1/     # Déclaration des routes et de leurs validateurs
    ├── scripts/       # Scripts utilitaires (clé d'activation, triggers SQL)
    ├── services/      # Services applicatifs (IA, mailer, quiz)
    ├── socket/        # Événements temps réel Socket.IO
    └── utils/         # Prisma client, RBAC, logs, interfaces, services
```

L'API est écrite en TypeScript exécuté nativement par Node (les imports
portent l'extension `.ts`). En développement, `node --watch src/server.ts` ;
en production, le build `tsc` est lancé depuis `dist/`.

## La chaîne de traitement d'une requête

Chaque endpoint traverse toujours les mêmes couches, une responsabilité par
fichier :

```text
routes/v1/<domaine>/<domaine>.router.ts   déclaration de la route
  └── <domaine>-validator.ts              règles express-validator
  └── middleware/check-permissions.ts     authentification + RBAC (CASL)
  └── controllers/<domaine>/http-*.ts     lecture de la requête, codes HTTP
        └── models/<domaine>/*.ts         accès base de données
```

Concrètement, pour `GET /v1/parcours/:parcoursId` :

```bash
routes/v1/parcours/parcours.router.ts      # route + validateur + permission
controllers/parcours/http-get-parcours-by-id.ts  # req/res uniquement
models/parcours/get-parcours-by-id.ts      # requête Prisma et mise en forme
```

Un contrôleur ne contient jamais de requête base de données, et un modèle ne
manipule jamais `req` ni `res`. Les contrôleurs sont nommés d'après le verbe
HTTP et l'intention (`http-post-duplicate-parcours.ts`), les modèles d'après
l'opération métier (`create-parcours.ts`).

`routes/v1/v1.router.ts` monte tous les sous-routeurs sous le préfixe `/v1`.

## Les middlewares

`src/middleware/` regroupe les préoccupations transverses :

- `check-permissions.ts` : vérifie le cookie de session puis l'ability CASL.
  L'action est déduite de la méthode HTTP (GET → `read`, POST → `write`,
  PUT/PATCH → `update`, DELETE → `delete`) ;
- `check-token.ts`, `refresh-tokens.ts`, `require-session.ts` : cycle de vie
  des jetons, transmis par cookies `httpOnly` ;
- `check-validation.ts` : rejette les requêtes invalides après
  express-validator ;
- `upload-activity-*.ts`, `fileUpload.ts` : dépôts de fichiers via multer,
  avec des tailles maximales déclarées dans `config/images-sizes.ts` ;
- `request-logger.ts` et `response-handler.ts` : journalisation Winston et
  format de réponse homogène.

## La persistance

Deux bases de données coexistent :

- **PostgreSQL via Prisma** porte le domaine pédagogique : formations,
  parcours, modules, cours, leçons, activités, quiz, groupes, compétences,
  suivi de lecture et de progression. Le schéma est dans
  `prisma/schema.prisma`, le client partagé dans `src/utils/db.ts` ;
- **MongoDB via Mongoose** porte les données annexes et volatiles :
  utilisateurs et rôles, jetons révoqués, dialogues du chatbot, statistiques
  de prompts, informations de connexion, feedbacks apprenants. Les schémas
  sont dans `src/utils/interfaces/db/`, la connexion dans
  `src/utils/services/db/mongo-connect.ts`.

Un modèle de `src/models/` peut donc viser l'une ou l'autre base ; c'est la
seule couche autorisée à le faire.

## Le temps réel

`src/socket/socket.ts` initialise Socket.IO à partir du serveur HTTP. La
session est lue depuis le cookie `accessToken` au moment du handshake, et
chaque événement sensible repasse par l'ability CASL (`authorizeSocket`). Le
canal sert principalement aux feedbacks apprenants, au comptage des
connectés et aux félicitations envoyées par un formateur.

## Les services

- `services/ai/ai-api-client.ts` : point d'entrée unique vers le service IA
  externe. Il centralise la configuration, la signature JWT et la traduction
  des erreurs HTTP, y compris les réponses en flux (`text/event-stream`) ;
- `services/quiz/` : génération et correction des questions ;
- `services/mailer.ts` : envoi des courriels (activation, invitations).

## Les tests

Le front utilise Vitest (`npm run test --prefix front`), en colocalisant les
fichiers `*.test.ts(x)` à côté du code testé.

L'API utilise Jest en tests d'intégration : `npm test` démarre une base
PostgreSQL Docker dédiée, applique les migrations, charge les fixtures, puis
exécute les scénarios de `api/tests/` en série avant de tout arrêter.
