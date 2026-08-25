# Mode démonstration

ANDRIA peut être déployée en **instance de démonstration** : une plateforme
publique, accessible sans compte, garnie de contenus fictifs et strictement en
consultation. Elle sert de vitrine, et permet à un visiteur de parcourir
l'interface de l'équipe pédagogique comme celle d'un apprenant.

## Principe

Le mode démonstration n'est pas une variante du code, c'est une **configuration
d'exécution** : la même image Docker, un `.env` différent, des bases dédiées.
Aucune donnée de production n'est donc atteignable depuis la démonstration.

Sur une instance ordinaire, `DEMO_MODE` reste à `false` et rien ne change. Il
suffit d'y renseigner `DEMO_URL` pour que le bouton « Mode démonstration »
apparaisse à côté du tutoriel guidé.

## Pourquoi le drapeau vient de l'API et non d'une variable `VITE_*`

Le front est construit une seule fois, dans l'étape `build` du `Dockerfile`, et
`front/.env.production` est versionné puis copié dans l'image. Une variable
`VITE_*` a donc **la même valeur sur toutes les instances** : elle ne peut pas
distinguer la production de la démonstration.

Le drapeau est par conséquent servi au moment de l'exécution par
`GET /v1/demo/config`, une route publique qui renvoie :

```json
{ "demoMode": true, "demoUrl": "", "exitUrl": "https://andria…", "aiDisabled": true }
```

`DemoProvider` (`front/src/store/DemoProvider.tsx`) la lit au démarrage et la
diffuse via `useDemoMode()`. C'est aussi par ce canal que passe `aiDisabled`,
pour la même raison.

Un seul appel est fait, au montage du provider, et son résultat vit dans le
contexte React pour toute la session. Les consommateurs — les deux layouts, les
hooks de quiz — lisent cette valeur ; aucun d'eux ne refait de requête.

Le front n'a **pas** de variable `VITE_DISABLE_AI_FEATURES`. Elle a existé, et
elle donnait le même verdict sur toutes les instances : une instance sans couche
IA affichait quand même le chatbot dès lors que l'image avait été construite
avec le drapeau à `false`. Ne la réintroduisez pas — `DISABLE_AI_FEATURES` reste
côté API, et le front en hérite par `aiDisabled`.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DEMO_MODE` | `true` sur la seule instance de démonstration. Active le verrou lecture seule et l'ouverture de session publique. |
| `DEMO_URL` | Adresse de l'instance de démonstration, renseignée sur les **autres** instances pour proposer le lien. |
| `DEMO_EXIT_URL` | Où renvoyer un visiteur qui quitte la démonstration. |
| `ALTCHA_HMAC_KEY` | Clé de signature des défis anti-robot. À défaut, `SECRET` est utilisée. |
| `DEMO_ADMIN_EMAIL` | Compte emprunté pour l'interface équipe pédagogique. |
| `DEMO_STUDENT_EMAIL` | Compte emprunté pour l'interface apprenant. |

Elles sont déjà déclarées dans `deployment/direct/compose.yml` et
`deployment/caddy/compose.yml`. `DEMO_MODE` pilote en outre le choix des
fichiers Compose : sur `true`, la couche IA n'est pas déployée du tout.

## Le verrou lecture seule

`api/src/middleware/demo-read-only.ts` refuse tout verbe autre que `GET` et
répond `403 { code: "DEMO_READ_ONLY" }`.

Il est monté **devant** `/v1` (`api/src/app.ts`), et non à l'intérieur des
routeurs : `multer` y est déclaré au niveau des routes, donc un montage plus
tardif laisserait un fichier déposé atteindre le disque avant le refus.

Trois exceptions seulement, dans `api/src/config/demo-read-only-allowlist.ts` :

- `POST /v1/demo/session`, l'ouverture de session ;
- `POST /v1/user/group`, qui appelle `httpGetUsersByGroup` — une **lecture
  servie en POST**. Sans elle, les pages Groupes cassent.

Une quatrième route mérite d'être connue : `POST /v1/indicators/:userId/prediction`
est également une lecture (une inférence, sans écriture). Elle reste bloquée
parce que l'IA est coupée en démonstration ; l'autoriser suppose d'accepter le
coût des appels au fournisseur depuis une instance publique.

**Toute route non-GET ajoutée plus tard est refusée par défaut.** Le test
`api/tests/11_demo-read-only.spec.ts` parcourt la pile de routeurs Express et
échoue si une route échappe au verrou sans figurer dans la liste blanche : une
nouvelle lecture servie en POST forcera donc un arbitrage explicite plutôt que
de casser silencieusement la démonstration.

> Note : `chatbot.router.ts` et `resources.router.ts` font `import Router from "express"`,
> c'est-à-dire la fabrique d'**application** et non `express.Router()`. Ils sont
> montés comme des sous-applications et rangent leurs couches sous `_router` ;
> `api/src/utils/testing/express-routes.ts` en tient compte.

## Le captcha

Une preuve de travail dans l'esprit du protocole Altcha, écrite dans
`api/src/utils/services/demo/altcha.ts`. L'objectif n'est pas d'arrêter un
attaquant déterminé, mais d'éviter qu'un robot ouvre des milliers de sessions et
fasse travailler la base pour rien.

1. `GET /v1/demo/challenge` renvoie `sha256(salt + n)` pour un `n` que le serveur
   garde, la date d'expiration étant inscrite dans le `salt`, le tout signé en
   HMAC-SHA256.
2. Le navigateur retrouve `n` par balayage (`front/src/features/demo/lib/altcha-solver.ts`),
   pendant que le visiteur lit la page.
3. `POST /v1/demo/session` revérifie le hachage, la signature (comparaison à
   temps constant), l'expiration, et refuse toute solution déjà consommée.

Aucun composant tiers n'est chargé : la CSP de `api/src/app.ts` reste inchangée.

L'API de démonstration répond en 400, 429 ou 503, **jamais en 401 ni 403** :
l'intercepteur de `front/src/lib/axios.ts` ne réagit qu'à ces deux codes, en
tentant un rafraîchissement de session puis une déconnexion, ce qui n'aurait pas
de sens pour un visiteur anonyme.

## Les comptes de démonstration

Ils portent les **rôles ordinaires, avec toutes leurs permissions**. C'est
délibéré : `PermissionGuard` masque ce qu'il refuse, et une ability réduite à la
lecture ferait *disparaître* les boutons d'action au lieu de les afficher
inertes — ANDRIA donnerait l'image d'une interface amputée. Ce sont le verrou
API et la neutralisation côté front qui interdisent d'écrire, pas leurs droits.

Deux points de vigilance :

- le compte équipe pédagogique doit être de **rang ≤ 2**. `isRestrictedToEnrollment`
  (`api/src/utils/services/permissions/accessible-parcours.ts`) limiterait un rang
  supérieur à ses seules inscriptions, et l'espace d'administration paraîtrait vide ;
- le compte apprenant doit appartenir à un **groupe rattaché à un parcours publié**,
  faute de quoi `check-content-access.ts` répond 404 sur tout le contenu.

`npm run demo:seed` (`api/src/scripts/demo-seed.ts`) crée ou répare les deux
comptes, leurs miroirs PostgreSQL et l'inscription de l'apprenant. Il est
idempotent, et refuse de tourner si `DEMO_MODE` n'est pas actif.

## La consultation seule côté interface

L'exigence est que les boutons restent **visibles** et expliquent leur inaction,
plutôt que de disparaître.

- `DemoLock` (`front/src/features/demo/components/DemoLock.tsx`) intercepte le
  clic en phase de capture et pose un tooltip « Indisponible en mode démo ».
  Pas de `disabled` : un élément désactivé n'émet plus d'événement de survol, et
  le tooltip ne s'afficherait jamais.
- `PermissionGuard` enveloppe automatiquement dans `DemoLock` toute action
  `write`, `update` ou `delete`. Ce garde est utilisé dans une quarantaine de
  fichiers, autour des boutons d'ajout, de modification et de suppression : c'est
  le principal levier de couverture.
- L'intercepteur de requête d'`axios` arrête toute écriture **avant l'envoi**.
  C'est lui qui rattrape ce que les enveloppes manquent : réordonnancement par
  glisser-déposer, sauvegarde automatique, dépôt d'image depuis l'éditeur.
- Un écouteur `submit` en capture couvre les formulaires validés au clavier.

Reste non couvert : des boutons locaux à une fonctionnalité et non gardés par une
ability restent cliquables ; ils ouvrent un panneau, et l'enregistrement échoue
avec une notification. Un glisser-déposer bouge à l'écran puis revient en place
au prochain rafraîchissement des données.

## Ce qui est désactivé en démonstration

| Quoi | Pourquoi |
| --- | --- |
| Le temps réel (Socket.IO) | Ses gestionnaires écrivent en base sans passer par le verrou HTTP, et tous les visiteurs partagent un compte, donc les mêmes salons. Coupé dans `api/src/server.ts` et `front/src/store/AuthProvider.tsx`. |
| Les fonctionnalités IA | Chatbot et génération de quiz partent d'une session obtenue sans identifiants sur une instance publique, et consomment des jetons chez le fournisseur. |
| Le tutoriel d'onboarding | Il enregistre sa progression sur le compte, partagé : le premier visiteur à le terminer en priverait tous les suivants. `OnboardingTour` ne fournit plus qu'un contexte inerte, et la visite guidée est portée par `DemoTour`. |
| Le questionnaire bêta-testeurs | Sans objet pour un visiteur de passage. |

## La visite guidée

`DemoTour` (`front/src/features/demo/components/DemoTour.tsx`) démarre seul à
l'entrée dans la démonstration et se relance depuis « Tutoriel guidée » dans la
barre latérale.

Son état vit en `sessionStorage`, **jamais en base**, pour la raison ci-dessus :
chaque onglet a donc sa propre visite, et la démonstration commence toujours par
elle.

Les étapes sont dans `front/src/features/demo/demo-tour-steps.ts`. Chacune
déclare la page qu'elle ouvre ; la navigation passe par le hook `before` de
react-joyride, qui attend la résolution de la promesse avant d'afficher la bulle.
L'habillage est partagé avec les visites par page
(`front/src/components/headers/page-tour-options.ts`).

## Produire le jeu de contenus

1. Sur une instance locale vierge (`npm run init`), créer le premier
   administrateur puis **saisir le contenu via l'interface** : plusieurs
   formations, des parcours **publiés**, des modules, cours, leçons, activités,
   quiz, des groupes, quelques apprenants, et un peu de progression — seule
   `LessonRead.finishedAt` alimente les pourcentages affichés
   (`api/src/helpers/calculate-module-progress.ts`).
2. `npm run dump`, qui écrit dans `api/dumps/`.
3. Déplacer le résultat dans **`api/dumps/demo/`**, qui est versionné.

**Contrainte sur les médias.** Le SQL et le dump Mongo sont compacts et vont
sans problème dans le dépôt. Les fichiers d'activités, non : privilégier les
activités `iframe` (YouTube, Canva, Google Docs, déjà autorisés par la CSP) et
des images compressées, plutôt que des vidéos déposées localement.

## Déployer l'instance

Sur un poste de développement :

```bash
npm run init:demo   # restaure api/dumps/demo/ puis prépare les comptes
```

`init-scripts/init.sh` ne vaut que là : il installe les dépendances, copie les
`env.example` et parle aux conteneurs par leur nom local (`lxp-prisma`,
`lxp-mongo`). Sur un serveur, c'est le **pipeline** qui restaure le jeu de
démonstration, à chaque déploiement, dès que l'environnement porte
`DEMO_MODE=true` :

1. `DROP SCHEMA public CASCADE` sur la base LXP — le dump est un `pg_dump -a`,
   il ne se rejoue que sur un schéma vide ;
2. `prisma migrate deploy`, puis les triggers ANDRIA ;
3. `psql < api/dumps/demo/dump-pgsql.sql` ;
4. `mongorestore --drop` du dump Mongo, copié dans le conteneur au préalable ;
5. `rsync` de `api/dumps/demo/activities/` vers le volume `uploads` ;
6. `npm run demo:seed` dans le conteneur applicatif, qui prépare les deux
   comptes empruntés par les visiteurs.

La démonstration revient donc à l'état versionné à chaque déploiement. L'API y
étant en lecture seule, rien d'utile n'est perdu au passage. Sans l'étape 6,
`/demo` répond « La démonstration n'est pas configurée sur cette instance. » :
`getDemoUser` cherche en base les comptes désignés par `DEMO_ADMIN_EMAIL` et
`DEMO_STUDENT_EMAIL`.

Pour le reste, c'est le même socle `compose.yml`. Le déploiement utilise
l'environnement Infisical `dev` avec `INFISICAL_PATH_PREFIX=/demo`. Il hérite
des dossiers communs `/ci` et `/runtime`, tandis que `/demo/ci` et
`/demo/runtime` surchargent les valeurs propres à cette cible ; ce dernier porte
notamment `DEMO_MODE=true`. Les paramètres Jenkins définissent un `DEPLOY_PATH`
et un `LXP_DEPLOYMENT_NAME` distincts, et les bases utilisent des secrets
propres. L'overlay `compose.ai.yml` n'est pas
chargé, donc ni le service `ai`, ni sa base pgvector, ni le cache de modèles ne
sont déployés. Les pipelines s'en chargent seuls à partir de `DEMO_MODE` — voir
[`deployment/README.md`](../deployment/README.md).

Ces étapes sont identiques dans les trois pipelines : les deux `Jenkinsfile`
de `deployment/` et `.github/workflows/deploy-dev.yml`. Toutes pilotent le démon
Docker distant depuis la machine de déploiement, si bien que les dumps sont
poussés dans les conteneurs sans jamais être écrits sur le serveur.

## Entrée du visiteur

Le catch-all du routeur (`front/src/app/router.tsx`) passe par
`DefaultRedirect` : sur l'instance de démonstration, `/` et toute adresse
inconnue mènent à `/demo`, ailleurs à `/login`. Le composant attend
`isConfigLoaded` avant de trancher — le bundle étant commun à toutes les
instances, le mode n'est connu qu'après la réponse de `GET /v1/demo/config`.

## Après une migration Prisma

`pg_dump -a` n'exporte que les **données**, liées au schéma du moment. Toute
migration ajoutant une colonne obligatoire, renommant une colonne ou modifiant un
énuméré périme donc `api/dumps/demo/dump-pgsql.sql`, qu'il faut régénérer.

À terme, un jeu de fixtures écrit avec le client Prisma (sur le modèle de
`api/src/fixtures.ts`) suivrait le schéma automatiquement et supprimerait cette
servitude.
