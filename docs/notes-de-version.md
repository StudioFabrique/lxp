# Notes de version des patchs

La carte « Nouveautés » et la fenêtre « Notes de version » lisent
`front/src/config/release-notes.json`. La première entrée est celle affichée
par défaut ; la liste déroulante permet de consulter les cinq dernières
versions. Le bandeau GitHub mène au code de la version sélectionnée. Le style
de la fenêtre est défini dans
`front/src/components/UI/ReleaseNotesModal.tsx`.

## Génération sur une branche de release

1. Créer une branche depuis `beta`, nommée `release/0.9.1` ou
   `release/v0.9.1`, puis y pousser les corrections du patch. Le workflow
   `.github/workflows/release-notes.yml` se lance sur chaque push de cette branche.
2. Le workflow télécharge et lance localement le modèle libre
   `qwen2.5:3b-instruct` avec Ollama. Aucun compte ni clé API d'IA n'est requis.
   Le script résume les commits visibles pour les utilisateurs entre le point de
   divergence avec `beta` et la
   tête de la branche. Il donne leurs titres, descriptions et noms de fichiers
   modifiés au modèle, sans lui donner le code. Il écrit une à quatre cartes en
   français avec des titres de 28 caractères et des descriptions de 78 caractères
   au maximum, puis le workflow crée un commit sur la même branche si les notes
   ont changé. Le nom réel de cette branche est conservé avec la note.
3. Relire et corriger si besoin `release-notes.json` avant de fusionner la
   branche. La fenêtre affichera la nouvelle première entrée après la fusion et
   le déploiement du front.

Le workflow ne crée pas de notes si la branche ne contient encore aucun commit
de patch. Le téléchargement du modèle prend environ 2 Go à chaque exécution
avec des commits à résumer. Un push qui corrige le texte de la version
courante ne relance pas le modèle ; un changement du numéro de version le fait.
Un commit créé avec `GITHUB_TOKEN` ne relance pas ce
workflow. Le modèle ne demande aucun crédit API ; les minutes GitHub Actions
restent soumises au quota du dépôt s'il est privé.
La branche doit accepter les pushes du workflow (`contents: write`) ; si elle
est protégée contre ces pushes, le job échouera et il faudra adapter la règle
de protection ou reporter manuellement le fichier généré.

Pour vérifier le générateur sans appel API :

```sh
node .github/scripts/generate-release-notes.test.mjs
```
