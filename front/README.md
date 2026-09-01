# Interface web ANDRIA

Ce dossier contient l’interface React du LXP.

Depuis la racine du dépôt, lancez l’API et le front avec :

```bash
npm run dev
```

Pour travailler seulement sur le front :

```bash
npm run dev --prefix front
```

## Commandes

| Action | Commande |
| --- | --- |
| Démarrer Vite | `npm run dev --prefix front` |
| Lancer les tests | `npm run test --prefix front` |
| Vérifier le code | `npm run lint --prefix front` |
| Créer le build | `npm run build --prefix front` |

Le fichier `front/.env` contient les adresses utilisées en développement. La
page [Variables d’environnement](../docs/variables-environnement.md#front)
explique chaque valeur.

Consultez [Structure du projet](../docs/structure-et-architecture.md#front)
pour les dossiers, les routes et les règles de rangement du code.
