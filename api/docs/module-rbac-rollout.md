# Déploiement Module plat et CASL

## Avant le déploiement

1. Sauvegarder PostgreSQL et MongoDB.
2. Exécuter `npm run test:migration` sur l’environnement de validation.
3. Vérifier qu’aucun module legacy n’est orphelin :

   ```sql
   SELECT m.id, m.title
   FROM "Module" m
   LEFT JOIN "ModuleMetadata" mm ON mm."moduleId" = m.id
   WHERE mm.id IS NULL;
   ```

   Le résultat doit être vide. La migration refusera également de s’exécuter
   dans le cas contraire.
4. Vérifier que chaque instance module/parcours appartient à une formation
   présente dans `ModulesOnFormation`.

## Ordre de déploiement

1. Suspendre brièvement les écritures sur les modules.
2. Exécuter `prisma migrate deploy`. La migration PostgreSQL est
   transactionnelle : toute erreur conserve le schéma et les données legacy.
3. Exécuter `npm run rbac:migrate` pour recopier les éventuelles références
   historiques `Permission.roles` vers `Role.permissions`, vérifier chaque
   référence, puis retirer le tableau inverse.
4. Déployer ensemble l’API et le frontend.
5. Réactiver les écritures après les vérifications ci-dessous.

Les JWT d’accès déjà émis restent acceptés pendant cette transition, mais
l’API ignore leurs rôles et recharge toujours l’utilisateur actif, ses rôles
et ses permissions depuis MongoDB. Tous les nouveaux JWT contiennent seulement
l’identité et le type de jeton.

## Vérifications après déploiement

- Création d’un module avec formation et parcours cohérents.
- Duplication dans le même parcours et dans un autre parcours de la même
  formation ; refus vers une autre formation.
- Modification et suppression de chaque copie sans impact sur sa source.
- Cours, leçons, activités, contacts, compétences et quiz sans relation
  orpheline.
- Cours dupliqués avec `courseSlug = null` et fonctions IA de cours désactivées.
- Quiz préliminaire d’un module existant par `moduleId`.
- Réponses `401` sans session, `403` sans capacité, et prise en compte
  immédiate d’un changement de rôle avec un JWT déjà émis.
- Connexion Socket.IO avec cookie valide et refus des événements sans capacité.
- `npm run audit:routes`, build API et build frontend.

Une restauration après un déploiement déjà validé nécessite les sauvegardes :
la migration supprime volontairement les tables legacy après ses contrôles.
