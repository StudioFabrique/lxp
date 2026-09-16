# Indicateurs et retours sur les analyses

## Fonctionnement

L'application calcule les onze variables puis appelle `POST /indicators/predict`
sur ANDRIA. Une analyse réussie est enregistrée dans MongoDB avant d'être renvoyée
au navigateur. Elle conserve la période, les indicateurs, les raisons des valeurs
manquantes, les probabilités, les alertes, l'auteur et la version des calculs
`lxp-indicators-v2`. ANDRIA fournit aussi l'empreinte SHA-256 de son modèle.

Les routes LXP, sous `/v1/indicators`, sont :

- `POST /:userId/prediction?from=...&to=...` : calcule et enregistre l'analyse.
- `GET /:userId/analyses?before=...` : historique par pages de 20 analyses.
- `POST /:userId/analyses/:analysisId/feedback` : ajoute un retour daté, sans
  écraser les retours précédents ni modifier la prédiction.

Ces routes nécessitent une session disposant de `stats:read` et un rôle de rang
0, 1 ou 2, comme l'analyse existante. Les apprenants ne peuvent pas les consulter.
La liaison analyse/apprenant est vérifiée lors d'un retour. Le périmètre des
formateurs reste celui de la fonctionnalité existante ; aucun nouveau filtrage
par groupe n'est introduit.

Le retour contient `verdict` (`appropriate`, `overestimated`, `underestimated`,
`uncertain`), `comment` et `actionTaken` facultatifs (2 000 caractères maximum).
`observedOutcome` (`graduate`, `fail`, `dropout`) et `observedAt` sont facultatifs,
mais doivent être fournis ensemble. Le constat doit se situer entre l'analyse et
le moment de l'enregistrement. L'historique affiche les 20 derniers retours par
analyse ; tous les retours restent conservés.

## Calculs

- Les quiz sont comptés à leur terminaison, les devoirs à leur remise.
- Une note de devoir n'est utilisée que si `gradedAt <= to`.
- Le taux de réussite porte sur les évaluations notées, avec un seuil de 40 %.
  Une remise non notée compte dans la volumétrie, pas dans ce taux.
- La pente des notes utilise l'historique connu jusqu'à `to`, les dates réelles
  et des notes normalisées entre 0 et 1. Faute de coefficients pédagogiques dans
  LXP, chaque évaluation pèse 1. Le barème n'est pas utilisé comme coefficient.
  Moins de deux dates distinctes donne `null`. L'écart affiché dans la fiche reste
  un indicateur descriptif distinct.
- Le temps de lecture provient des intervalles `ContentReadCredit`, découpés aux
  bornes de la période. Le compteur cumulé reste conservé. L'incrément du compteur
  et l'écriture de l'intervalle sont atomiques ; deux battements simultanés ne
  créditent pas deux fois le même intervalle.

## Mise en service

1. Émettre le contrat avec `prisma contract emit`, puis appliquer les migrations
   LXP avec `prisma db migrate` dans `api` avant de compiler et démarrer l'API.
2. Déployer ensemble l'API, le front et ANDRIA pour disposer de l'empreinte modèle.
3. Le démarrage LXP crée les index des collections `indicatoranalyses` et
   `indicatoranalysisfeedbacks`.

Les anciens compteurs de lecture ne permettent pas de reconstituer des dates :
aucun historique artificiel n'est créé. Les périodes antérieures à la migration
peuvent donc manquer de temps de lecture, et une période chevauchant le déploiement
ne comporte que les nouveaux intervalles. Les anciennes prédictions, non
enregistrées, ne sont pas récupérables.

## Préparer l'amélioration du modèle

Dans ANDRIA, `python -m app.indicators.feedback_dataset --output fichier.jsonl`
lit les analyses et les constats depuis `LXP_MONGO_URL` et crée exclusivement un
nouveau fichier. Il n'entraîne ni ne remplace le modèle.

L'export exclut les avis sans résultat constaté, les résultats contradictoires,
les dates invalides et les analyses sans empreinte du modèle ou sans la version
de calcul attendue. Une même fenêtre pour un apprenant n'est exportée qu'une fois.
Les données exportées contiennent les identifiants techniques des apprenants ;
elles sont destinées au travail interne d'évaluation.

Avant réentraînement, il reste à valider les constats, définir le parcours auquel
le résultat se rapporte (les indicateurs actuels agrègent les parcours), préparer
des ensembles d'entraînement et de validation séparés par apprenant et par date,
puis comparer un modèle candidat sur des observations LXP indépendantes. Le JSONL
est un jeu candidat documenté, pas une entrée directe du réentraînement OULAD
existant. Un avis de formateur seul ne devient jamais une étiquette de résultat.

Le modèle existant reste entraîné sur OULAD. L'humeur déclarée, les interactions
chatbot, la pondération uniforme et les remises non notées diffèrent de ce jeu.
Les valeurs `null` restent explicites dans les analyses, mais le modèle existant
les remplace par zéro au cours de son traitement. Les règles d'alerte fixes ne
changent pas automatiquement à partir des retours.

## Vérification

Le test `api/tests/indicators-feedback.integration.spec.ts` nécessite
`INDICATORS_TEST_DB=1` et des URL PostgreSQL/MongoDB sur `127.0.0.1`, avec une base
nommée `indicators_test`. Il crée ses propres fixtures et appelle le service IA
simulé ; il ne teste pas la qualité statistique du modèle. Utiliser des bases
temporaires. Sans l'option explicite, cette suite est ignorée.
