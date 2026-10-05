# Séquences ANDRIA pour les tuiles de connexion

Les tuiles jouent les scènes de la version **enregistrée dans Hyperframes**. Elles sont intégrées sous forme d’animations vectorielles, avec le DOM et la timeline GSAP du montage. Le lecteur est local ; il ne charge pas le Studio et n’effectue aucun appel IA/API.

| Qualité | Scènes |
|---|---|
| Accessible | Niveaux pédagogiques et thèmes |
| Novatrice | Chatbot contextualisé et pilotage IA |
| Dynamique | Éditeur / activités et quiz |
| Réactive | Calendrier, ressources et accompagnement / décrochage |
| Intuitive | Sidebar 3D, dashboards progressifs, structure pédagogique et organisation |
| Adaptative | Reprise, avancement et profil d’apprentissage |

Chaque sélection termine sur **la première scène de la timeline**, à sa pose lisible à 2,1 secondes. Le logo prend la couleur exacte de la tuile (`primary`, `secondary`, `accent`), y compris après un changement de thème. Après 1,2 seconde sur le logo, le panneau tourne automatiquement vers la qualité suivante. « Revoir » annule cette transition. Avec le mouvement réduit, le logo s’affiche immédiatement, la lecture reste volontaire et la rotation automatique est désactivée.

Le bouton « Plein écran » agrandit le panneau stable : la rotation suivante conserve le plein écran. Son en-tête devient compact et le cadre coloré laisse place à une surface de lecture neutre. Le pied du lecteur indique les fonctionnalités présentées et propose lecture/pause, relecture et retour au panneau.

## Actualiser après des retouches Studio

Sauvegarder dans Hyperframes, puis depuis la racine du dépôt :

```sh
python3 brag-output/login-embed/export.py
```

L’export lit `brag-output/composition/index.html` sans le réécrire. Il publie le lecteur et ses assets dans `front/public/presentations/andria/`, repris automatiquement par Vite. Les scènes sont identifiées par leur `id`, leurs temps sont lus depuis les `data-start` et `data-duration` actuels. `manifest.json` contient le hash exact du fichier source et les sélections exportées.

`player.js` et `player.css` ici sont les sources du lecteur. Le JavaScript est servi dans des fichiers locaux externes, compatible avec la CSP de production ; aucun `eval` et aucune dépendance frontend supplémentaire.

## Vérifications

Build TypeScript/Vite, lint ciblé, tests des tuiles, du lecteur et du logo. Contrôle Chrome sur la page de connexion, les six fins de séquence et le chargement avec la CSP de production. Un test existant de `AuthLayout.test.tsx` sur le titre des notes de version échoue indépendamment : il attend le texte « ANDRIA » dans un h2 dont le contenu actuel est un logo. Ce test et les notes de version n’ont pas été modifiés.

Le lecteur reçoit aussi la palette de la page et de la tuile : accents, icônes, boutons, halos, sidebar et surfaces s’adaptent à cette couleur. Les états critiques conservent leur couleur métier. Les aperçus de thèmes continuent de changer leurs surfaces avec un accent cohérent avec la tuile.
