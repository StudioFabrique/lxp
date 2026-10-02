# Règles du projet pour les agents IA

Lire ce fichier avant toute intervention dans le projet. Les conventions frontend s'appliquent à `front/` et à tous ses sous-répertoires ; les conventions backend s'appliquent à `api/` et à tous ses sous-répertoires. Les règles transversales et les conventions de modification s'appliquent à tout le projet.

Ces règles s'appliquent au code ajouté ou modifié. Les écarts présents dans le code historique ne constituent pas des modèles à reproduire et ne justifient pas une refonte globale hors de la demande.

## Organisation et références du projet

- Le frontend utilise React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind et DaisyUI. Le backend utilise Express, TypeScript ESM, `express-validator`, Zod, PostgreSQL via Prisma et MongoDB via Mongoose.
- Avant de créer un comportement, examiner une implémentation voisine, ses appels, ses types et ses tests. Préférer les abstractions existantes à une nouvelle bibliothèque ou à un nouveau système parallèle.
- Respecter les noms et les chemins du domaine : formation, parcours, module, cours, leçon, activité, groupe et utilisateur. Ne pas confondre leurs identifiants ni leurs périmètres d'accès.
- Conserver les imports relatifs et les conventions du répertoire. Dans le backend, conserver les extensions `.ts` des imports locaux conformément au code ESM existant.
- Ne pas modifier manuellement les fichiers générés, les bundles ou les dépendances installées. Modifier leur source et utiliser le script de génération du projet.

## TypeScript et contrats de données

- Donner des types explicites aux props, payloads, résultats et paramètres des fonctions exposées. Réutiliser les types du domaine avant d'en créer de nouveaux.
- Ne pas introduire de `any`, de `@ts-ignore` ou d'assertions destinées à masquer un problème de type. Traiter les données externes et les erreurs inconnues comme `unknown`, puis les vérifier avant utilisation.
- Un type TypeScript ou une assertion `as` ne valide pas une donnée à l'exécution. Valider les données aux frontières : requête HTTP, import, fichier, configuration et réponse d'un service externe.
- Distinguer valeurs de formulaire, payload API et données persistées lorsqu'ils ont des formes différentes. Construire les payloads explicitement avec les champs autorisés.
- Définir le sens de `undefined`, `null`, chaîne vide et tableau vide pour les champs optionnels, notamment en modification : absence de changement, effacement ou valeur vide. Ne pas les convertir indistinctement.
- Ne pas muter les props, les objets du cache ou les données partagées. Utiliser des mises à jour immuables et des clés stables dans les listes React.

## Frontend : architecture et état

- Organiser le code métier dans `front/src/features/<domaine>/` : composants, hooks, API, schémas et helpers selon les conventions voisines. Réserver `components/`, `hooks/` et `utils/` aux éléments réellement partagés.
- Garder les composants centrés sur le rendu et les interactions. Extraire la logique métier, les appels API et les traitements complexes dans les hooks, modules API et helpers adaptés.
- Utiliser TanStack Query pour les données serveur et les mutations. Réutiliser les clés de requête du domaine, inclure les paramètres qui changent le résultat et invalider les données concernées après une écriture réussie.
- Utiliser le client HTTP partagé `front/src/lib/axios.ts` pour les appels à l'API du projet. Ne pas recréer la gestion des cookies, du renouvellement de session, des permissions ou du mode démo dans les composants.
- Réserver l'état local aux interactions de l'interface. Ne pas recopier les données serveur dans un état local sans besoin d'édition et stratégie explicite de synchronisation.
- Éviter les effets pour calculer une valeur dérivable ou déclencher une action liée à un clic. Nettoyer abonnements, timers et connexions créés par un effet ; respecter les dépendances des hooks.
- Prévoir les états chargement, erreur, liste vide et traitement en cours. Ne pas afficher une réussite avant la confirmation serveur ni faire disparaître une erreur sans retour utile.
- Réutiliser les guards et les capacités CASL existants pour l'affichage des actions et les routes. Les contrôles frontend complètent les contrôles serveur sans les remplacer.

## Frontend : formulaires avec React Hook Form et Zod

- **Tout nouveau formulaire métier et tout formulaire métier refactorisé doit utiliser React Hook Form avec un schéma Zod et `zodResolver` de `@hookform/resolvers/zod`.** Cela inclut les saisies à enregistrer sans balise `<form>`, les modales, les formulaires par étapes et la sauvegarde automatique.
- Un sous-composant de champs peut recevoir les méthodes ou valeurs du formulaire parent ; ne pas créer un `useForm` indépendant pour chaque section. Les contrôles de recherche, pagination, filtres locaux et les formulaires `method="dialog"` sans données métier n'exigent pas ce dispositif.
- Placer les schémas dans les fichiers `*.schema.ts` du domaine. Dériver les types avec `z.infer` ; utiliser `z.input` et `z.output` lorsque des transformations distinguent les valeurs saisies des valeurs validées.
- Réutiliser les champs de `front/src/utils/validation/fields.ts` lorsque leur sémantique correspond au besoin. Ne pas recopier des regex ni inventer des restrictions de format ou de longueur incompatibles avec le backend.
- Utiliser `front/src/features/formation/hooks/useFormationForm.ts` et `front/src/features/formation/formation.schema.ts` comme références pour l'intégration RHF/Zod, les mutations et la construction du payload. Réutiliser les composants de `front/src/components/form/` et `useFormField` lorsque leurs interfaces conviennent.
- RHF doit rester la source des valeurs à enregistrer. Utiliser `register` pour les champs natifs, `Controller` pour les composants contrôlés lorsque nécessaire, `useFormField` pour les adaptations existantes et `useFieldArray` pour les collections éditables. Ne pas doubler les mêmes valeurs dans des `useState` indépendants.
- Définir des `defaultValues` cohérents pour tous les champs. Synchroniser les données chargées ou le changement d'entité avec `reset` ou `values`, sans écraser les modifications en cours lors d'un rafraîchissement du cache.
- Valider le payload complet : champs obligatoires et optionnels renseignés, collections et leurs éléments, fichiers, valeurs énumérées et relations entre champs. Utiliser les raffinements Zod pour les contraintes croisées et rattacher l'erreur au champ concerné.
- Normaliser les textes avant de contrôler leur caractère obligatoire lorsque le domaine le prévoit : une chaîne composée uniquement d'espaces n'est pas un texte obligatoire valide. Ne pas appliquer de `trim()` ou de transformation à un mot de passe.
- Passer par `handleSubmit` pour toute soumission, y compris les boutons externes et les sauvegardes automatiques. Envoyer les valeurs validées fournies par RHF, pas une copie non validée issue d'un état local ou de `getValues()`.
- Pour un formulaire par étapes, valider les champs de l'étape avant d'avancer, puis l'ensemble du schéma avant l'écriture finale. Les contrôles des étapes ne remplacent pas la validation finale.
- Afficher les erreurs près des champs avec `aria-invalid`, `aria-describedby` et un message associé. Réutiliser `showFormErrors` si un retour global est nécessaire. Conserver les valeurs saisies après un échec serveur et rattacher les erreurs serveur aux champs lorsque possible.
- Utiliser une vraie soumission de formulaire pour conserver la touche Entrée ; donner `type="button"` aux actions secondaires et éviter les formulaires imbriqués. Bloquer les soumissions concurrentes avec les états RHF et/ou les mutations.
- Pour la sauvegarde automatique, réutiliser `front/src/hooks/useAutoSave.ts` : transmettre une promesse qui rejette en cas d'échec, valider avant l'appel API et surveiller tous les champs persistés. Ne pas marquer les changements comme enregistrés avant la réussite ; préserver les changements survenus pendant une sauvegarde et permettre une nouvelle tentative.
- La validation frontend sert au retour utilisateur. Toute contrainte de sécurité et toute règle métier doivent également être appliquées côté serveur.

## Classes CSS : utilisation obligatoire de `cn()`

- Utiliser l'utilitaire existant `front/src/utils/cn.ts` pour **toute classe conditionnelle et toute combinaison dynamique de classes** dans `className`.
- La syntaxe JSX attendue est `className={cn(...)}`. Importer `cn` avec un chemin relatif adapté au fichier.
- Placer les classes communes en premier, les classes conditionnelles ensuite et la prop `className` en dernier lorsqu'elle doit permettre une personnalisation.
- Utiliser `condition && "classe"` pour une classe optionnelle, et `condition ? "classe-a" : "classe-b"` pour deux variantes, à l'intérieur de `cn()`.
- Ne pas construire ces listes de classes par concaténation (`+`), interpolation de chaînes, ou assemblage de tableaux avec `filter().join()` ; ne pas remplacer `cn()` par un appel direct à `clsx` ou `twMerge`.
- Cette obligation s'applique aussi aux variables et fonctions intermédiaires qui produisent les classes. Une variable déjà calculée avec `cn()` peut être transmise directement à `className`.
- Les classes entièrement statiques peuvent rester sous la forme `className="..."`. Une prop `className` simplement transmise peut rester sous la forme `className={className}`.
- Conserver les noms complets des classes Tailwind dans le code pour permettre leur détection à la compilation. Préférer une table de variantes explicites à la construction d'un nom comme `bg-${color}`.
- `cn()` fusionne les classes Tailwind incompatibles : vérifier l'ordre des arguments pour conserver la priorité souhaitée.

```tsx
import { cn } from "../../utils/cn";

<button
  className={cn(
    "btn",
    selected ? "btn-primary" : "btn-outline",
    disabled && "opacity-50",
    className,
  )}
/>

const inputClassName = cn("input input-bordered", hasError && "input-error");
<input className={inputClassName} />;
```

## Frontend : séparateurs visuels

- Ne pas utiliser de caractères textuels comme le point médian (`·`) ou le tiret cadratin (em dash, Unicode U+2014) pour séparer des informations dans l'interface.
- Utiliser de vrais éléments visuels : le composant DaisyUI `divider`, sa variante `divider-horizontal`, ou une bordure CSS sur un élément dédié, selon la disposition.
- Ne pas simuler ces séparateurs par le contenu textuel d'un pseudo-élément CSS.
- Pour une séparation purement décorative, utiliser `aria-hidden="true"`. Utiliser `<hr>` lorsqu'une séparation thématique du contenu est pertinente.

## Frontend : composants et couleurs DaisyUI

- Utiliser autant que possible les composants et classes DaisyUI : `btn`, `card`, `modal`, `input`, `select`, `badge`, `alert`, `tabs`, `divider`, etc.
- Réutiliser les composants du projet qui encapsulent ces éléments avant de créer un nouveau composant ou des styles spécifiques.
- Utiliser Tailwind pour la disposition, l'espacement et les adaptations nécessaires autour des composants DaisyUI.
- Utiliser les couleurs sémantiques du thème DaisyUI : `primary`, `secondary`, `accent`, `neutral`, `base-100`, `base-200`, `base-300`, `base-content`, `info`, `success`, `warning`, `error` et leurs couleurs de contenu associées.
- Associer les fonds et textes appropriés, par exemple `bg-primary text-primary-content` ou `bg-base-100 text-base-content`.
- Éviter les couleurs fixes pour les éléments de l'interface : valeurs hexadécimales, RGB/HSL et palettes Tailwind comme `gray-*` ou `blue-*`. Les couleurs propres aux logos, médias ou données métier peuvent être conservées lorsqu'elles portent une signification indépendante du thème.
- Si une couleur doit être passée à une bibliothèque ou à un style inline, utiliser les variables CSS du thème DaisyUI, par exemple `var(--color-primary)`.
- Vérifier que les choix de couleurs restent lisibles dans les thèmes clair et sombre.

## Frontend : un composant par fichier

- **Un composant React frontend = un fichier.** Ne pas déclarer plusieurs composants dans un même fichier, même si les composants secondaires ne sont pas exportés.
- Extraire chaque sous-composant dans son propre fichier et l'importer dans le composant parent.
- Nommer le fichier d'après le composant, en respectant la convention de nommage du répertoire.
- Les types des props, constantes locales et fonctions utilitaires propres au composant peuvent rester dans son fichier tant qu'ils ne constituent pas d'autres composants.
- Placer les hooks et utilitaires partagés dans des fichiers dédiés.
- Appliquer cette règle aux nouveaux composants et aux composants refactorisés, sans lancer une réorganisation globale non demandée.

## Frontend : accessibilité et interactions

- Relier chaque label à son contrôle avec `htmlFor` et un identifiant unique, par exemple `useId`. Donner un nom accessible aux boutons constitués uniquement d'une icône.
- Utiliser des éléments sémantiques : bouton pour une action, lien pour une navigation. Préserver la navigation clavier, le focus visible et les comportements de fermeture et de retour du focus des modales.
- Ne pas transmettre une information uniquement par la couleur, une icône ou un tooltip. Fournir un texte accessible pour les états et erreurs utiles.
- Réutiliser les icônes et composants existants. Vérifier les dispositions sur mobile, les contenus longs et les thèmes clair et sombre.
- Conserver les textes destinés aux utilisateurs en français et décrire les erreurs avec une action possible. Ne pas exposer de stack trace ou de détails techniques internes dans l'interface.

## Backend : architecture et responsabilités

- Respecter la chaîne **routes → contrôleurs → modèles**, avec des services pour les traitements métier réutilisables et les intégrations externes. Le test `api/src/helpers/tests/backend-layering.spec.ts` formalise les dépendances à préserver.
- Les fichiers de `api/src/routes/v1/` déclarent les chemins, méthodes, validateurs et middlewares puis appellent les contrôleurs. Ils ne doivent importer ni modèles ni clients de persistance et ne doivent contenir aucun accès direct aux bases.
- Les contrôleurs de `api/src/controllers/` adaptent HTTP au métier : extraire les entrées validées et l'identité authentifiée, appeler les modèles ou services, traduire le résultat en statut et réponse. Ne pas y importer de routes, de clients Prisma/Mongoose ou de modèles de persistance issus de `utils/interfaces/db/`.
- Les fonctions de `api/src/models/` réalisent les opérations sur les données et les règles associées. Elles reçoivent des paramètres typés, retournent des résultats métier et restent indépendantes d'Express, des routes et des contrôleurs : pas de `req`, `res` ou réponse HTTP dans cette couche.
- Les services et helpers doivent rester indépendants du transport HTTP lorsque leur rôle le permet. Ne pas déplacer des requêtes de base dans un helper pour contourner la séparation des couches.
- Réutiliser les middlewares pour les préoccupations transversales : authentification, permissions, accès aux ressources, validation, uploads et limitations de requêtes. Garder les dépendances dans un seul sens et éviter les imports circulaires.
- Suivre l'organisation par domaine et par opération des fichiers existants. Ne pas introduire un framework, un conteneur d'injection ou une nouvelle couche d'abstraction sans besoin concret dans la demande.

## Backend : validation des entrées et règles métier

- **Toute entrée externe doit être validée côté serveur avant son utilisation dans une opération métier ou une écriture.** Couvrir `params`, `query`, `body`, JSON embarqué dans du multipart, fichiers, imports et événements Socket.IO concernés.
- Pour les routes HTTP, réutiliser les chaînes `express-validator` dans les fichiers de validateurs du domaine et les helpers de `api/src/helpers/custom-validators.ts`. Vérifier que leurs résultats sont effectivement traités par `checkValidatorResult` ou `validationResult` avant l'opération métier ; déclarer un validateur seul ne bloque pas une requête.
- Conserver Zod pour les frontières qui l'utilisent déjà, notamment la configuration et les imports structurés. Ne pas remplacer globalement les validateurs HTTP ni faire dépendre le backend des schémas de `front/`.
- Contrôler les types avant les conversions et utiliser `.bail()` lorsque les validations suivantes supposent un type valide. Une coercition ne doit pas transformer une donnée absente ou invalide en valeur métier valide.
- Valider les identifiants selon leur stockage : entier positif pour les identifiants SQL concernés, format MongoDB pour les identifiants Mongo concernés. Ne pas considérer `parseInt()` ou `Number()` comme une validation complète.
- Borner les tailles de texte, tableaux, fichiers et paginations selon le contrat métier. Contrôler les éléments imbriqués, les enums, les dates valides et les relations entre dates. Éviter les objets arbitraires et les listes de tri non autorisées.
- Construire les données de création et de mise à jour par sélection explicite des champs modifiables. Ne pas propager `req.body` directement à un modèle ou une mutation de base ; rejeter ou ignorer les champs supplémentaires selon le contrat de la route.
- Vérifier dans la couche métier l'existence des références, leurs relations et les invariants : unicité, appartenance à un groupe ou un parcours, état publié, disponibilité et possibilités de suppression. Une référence bien formée n'est pas nécessairement valide ou accessible.
- Maintenir l'alignement des validations frontend et backend lors d'un changement de contrat. Documenter les écarts nécessaires sans assouplir les contrôles serveur pour faire passer un formulaire.
- Distinguer texte brut, URL et contenu riche ; ne pas appliquer un échappement HTML global qui altère les données. Utiliser le traitement adapté au stockage et au rendu, et limiter les protocoles d'URL autorisés.

## Backend : authentification et autorisations

- Toute nouvelle route privée doit utiliser les middlewares de session et/ou `checkPermissions` existants. Une route publique doit correspondre à un besoin explicite et ne retourner que les données nécessaires.
- Vérifier à la fois la capacité CASL pour l'action et l'accès à la ressource précise. Réutiliser `checkContentAccess`, `checkFormationAccess`, `checkGroupAccess` et les contrôles de périmètre utilisateur lorsque pertinents.
- Placer les contrôles avant les opérations et les effets de bord ; respecter leurs dépendances (session avant périmètre, parsing avant validation des données multipart). Ne pas créer de route alternative qui contourne ces contrôles.
- Tirer l'identité de l'appelant de la session vérifiée (`req.auth`), jamais d'un identifiant ou d'un rôle fourni dans le payload. Vérifier les règles de rang et de gestion des utilisateurs lors des changements de rôle.
- Préserver les conventions de non-divulgation des ressources hors périmètre, notamment les réponses 404 de `checkContentAccess`. Ne pas révéler l'existence d'un contenu privé dans un message d'erreur.
- Appliquer les mêmes droits aux exports, téléchargements, recherches, duplications et événements temps réel qu'aux lectures et écritures ordinaires. Ne pas diffuser un événement contenant des données privées hors de son périmètre.
- Préserver le middleware de lecture seule du mode démo et son allowlist. Une nouvelle exception doit être justifiée par le comportement demandé et rester cohérente avec le client frontend.

## Backend : persistance et cohérence

- Réutiliser le client partagé `api/src/utils/db.ts` et les modèles Mongoose existants. Ne pas créer une connexion ou un client de base par requête.
- Pour PostgreSQL, suivre l'API Prisma installée dans le projet (`prisma.orm.public`, `prisma.transaction`). Ne pas recopier les méthodes d'une autre version de Prisma sans vérifier leur compatibilité avec le code local.
- Le contrat Prisma est défini dans `api/src/prisma/contract.prisma` et les migrations dans `api/migrations/`. Régénérer les artefacts avec `npm run prisma-generate` depuis `api/` ; ne pas éditer `contract.json` ou `contract.d.ts` à la main.
- Lors d'une évolution du stockage, suivre le mécanisme de migration existant et préserver les données existantes. Décrire les impacts sur les valeurs par défaut, contraintes, index et données historiques ; ne pas lancer de réinitialisation de base pour contourner une migration.
- Regrouper les écritures SQL interdépendantes dans une transaction et utiliser le client transactionnel pour toutes ses opérations. Appuyer les invariants d'unicité sur des contraintes de base lorsque nécessaire, car un contrôle préalable seul peut subir une concurrence.
- PostgreSQL, MongoDB, les fichiers et les services externes ne partagent pas une transaction atomique. Prévoir l'ordre des opérations, le nettoyage ou la compensation d'un échec partiel ; ne pas présenter une transaction SQL comme couvrant les autres systèmes.
- Limiter les champs sélectionnés et paginer les collections susceptibles de croître. Éviter les requêtes répétées par élément lorsqu'une lecture groupée convient ; conserver les filtres d'accès dans les requêtes.
- Utiliser des requêtes paramétrées pour le SQL brut. Ne pas interpoler une entrée utilisateur dans le SQL, un filtre arbitraire ou un nom de colonne ; autoriser explicitement les colonnes de tri.
- Protéger les suppressions par un filtre précis et vérifier les relations et ressources partagées avant nettoyage. Réutiliser les helpers de gestion des médias pour éviter les fichiers orphelins ou la suppression d'un fichier encore utilisé.

## Backend : erreurs, configuration et effets externes

- Préserver le contrat des endpoints existants : statuts HTTP, enveloppe JSON, noms des champs et messages exploités par le frontend. Toute évolution doit être répercutée sur les consommateurs et tests concernés.
- Distinguer erreur de validation (400), session absente ou expirée (401), accès refusé (403 ou convention 404 du périmètre), ressource absente (404), conflit métier (409) et erreur interne (500), selon le contrat existant.
- Ne pas retourner directement le message d'une erreur interne, SQL ou d'un fournisseur externe. Journaliser le contexte utile côté serveur avec le logger existant et retourner un message public adapté.
- Ne pas absorber une erreur dans un `catch` vide ni convertir un échec en réussite. Attendre les opérations critiques, terminer la réponse une seule fois et utiliser le mécanisme de propagation d'erreur de la route concernée.
- Utiliser `api/src/config/env.ts` pour le chargement et la validation de la configuration applicative. Ajouter les nouvelles variables à ce schéma et aux exemples/documentations concernés ; ne pas multiplier les appels à `dotenv.config()`.
- Ne jamais versionner ni journaliser mots de passe, tokens, cookies, secrets, chaînes de connexion ou payloads contenant des données personnelles complètes. Réutiliser la gestion de session, de hachage et de tokens existante.
- Pour les uploads et archives, réutiliser les middlewares existants, contrôler taille et types autorisés côté serveur, traiter les noms et chemins comme non fiables et prévenir les sorties du répertoire de destination. Nettoyer les fichiers temporaires en cas de rejet ou d'échec.
- Pour les appels à des URL fournies par l'utilisateur, contrôler les destinations et redirections afin de ne pas accéder aux services internes. Réutiliser les protections existantes du domaine.
- Réutiliser les services existants pour l'email et l'IA, respecter les modes désactivés et les paramètres de l'instance, définir un délai d'attente et traiter les réponses invalides. Ne pas déclencher un envoi réel ou un appel payant dans un test.
- Pour les traitements différés ou répétés, prévoir l'idempotence, les doublons et la reprise après échec. Émettre les notifications de réussite après confirmation de l'opération correspondante.

## Vérifications et tests

- Choisir les vérifications selon les fichiers et comportements modifiés. Une modification exclusivement documentaire n'exige pas une compilation applicative ; relire les règles, chemins et commandes et exécuter `git diff --check`.
- Après une modification frontend, lancer depuis `front/` `npm run build`, le lint ciblé avec `npx eslint <fichiers-modifiés> --report-unused-disable-directives` et les tests concernés avec `npm run test -- --run <fichiers-de-test>`.
- Après une modification backend, lancer depuis `api/` `npm run build` et les tests concernés. Utiliser `npm run typecheck` lorsque la modification touche aussi les types ou fichiers exclus du build, notamment les tests.
- Pour des tests Jest ciblés, utiliser depuis `api/` `NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/dotenv -e .env.test -- ./node_modules/.bin/jest --runInBand --runTestsByPath <fichiers-de-test>`.
- Les tests d'intégration API nécessitent les bases de test et leurs fixtures : utiliser les scripts `test:setup`, `test:run` et `test:cleanup` lorsque ce périmètre est nécessaire. Vérifier que les connexions ciblent les bases de test avant toute opération sur les données ; ne jamais utiliser la base de développement ou de production comme base de test.
- Lors d'une évolution des dépendances entre couches backend, exécuter `api/src/helpers/tests/backend-layering.spec.ts`. Pour une évolution d'accès, couvrir les utilisateurs non authentifiés, autorisés et hors périmètre, ainsi que les identifiants devinés.
- Ajouter ou adapter un test de régression pour un changement de comportement significatif. Tester les résultats observables plutôt que les détails internes, avec les outils existants : Vitest côté frontend, Jest et Supertest côté API.
- Pour les formulaires, couvrir les valeurs invalides, les champs optionnels renseignés et invalides, l'absence d'appel API en cas d'erreur, les erreurs serveur et les cas de synchronisation ou sauvegarde automatique concernés.
- Pour les écritures et imports, couvrir les conflits, les références invalides et les échecs partiels lorsque pertinents. Nettoyer les fixtures et isoler les tests pour éviter leur dépendance à l'ordre d'exécution.
- Ne pas désactiver un test, une règle de lint ou une vérification de types pour masquer une régression. Signaler les commandes qui échouent ou ne peuvent pas être exécutées, avec la cause et le périmètre non vérifié.

## Conventions de modification

- Réutiliser les composants, hooks et utilitaires existants et respecter l'organisation du code autour du fichier modifié.
- Préserver les modifications en cours et limiter les changements à la demande.
- Conserver l'accessibilité des contrôles, notamment les labels, la navigation clavier et les états désactivés.
- Ne pas mélanger une correction ciblée avec une mise en forme générale, une migration de dépendances ou un renommage sans rapport avec la demande.
- Ne pas ajouter de dépendance si les outils installés répondent au besoin. Lorsqu'une dépendance est nécessaire, mettre à jour le manifeste et le lockfile du paquet concerné sans modification de versions sans rapport.
- Mettre à jour ensemble les contrats, consommateurs et documentation affectés par une modification. Commenter les décisions métier et les contraintes non évidentes, sans répéter ce que dit le code.
- Avant de terminer, relire le diff, vérifier l'absence de secrets et de fichiers générés involontaires, et exécuter les vérifications adaptées décrites ci-dessus.
- Indiquer dans le compte rendu ce qui a changé, les vérifications réalisées et les éventuelles limites restantes.
