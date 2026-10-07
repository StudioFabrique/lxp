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

Chaque sélection termine sur sa dernière scène de fonctionnalité, sans séquence de logo. Après 0,3 seconde, le panneau tourne automatiquement vers la qualité suivante. Avec le mouvement réduit, la dernière scène s’affiche immédiatement et la rotation automatique est désactivée.

Le mode `?mode=logo` joue uniquement la construction originale en grille de pixels, puis conserve le logo assemblé. Le composant `AuthAnimatedLogo` l’utilise sur le login et les onboardings des apprenants, formateurs et administrateurs. Il reprend la transition d’apparition de l’onboarding apprenant, transmet la couleur `primary` et le fond du thème actif et conserve le lecteur lors des changements de thème. Le mouvement réduit affiche directement le logo assemblé.

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

Le lecteur utilise `zoom` CSS pour ajuster sa scène au viewport : les textes et cartes 3D sont rendus à la résolution de l’aperçu, ce qui évite le flou de la réduction par `transform: scale`. Le centrage tient compte du zoom, en tuile, en plein écran et en mode logo. Les navigateurs sans prise en charge de `zoom` conservent le redimensionnement par transformation.

Les accueils de première configuration, administrateur, formateur et apprenant partagent une introduction de 3,6 secondes. Le grand logo se trouve au centre de l’écran complet : le panneau droit est masqué et la colonne gauche est décalée de 25 vw sur desktop. Après l’introduction, les colonnes glissent simultanément pendant 1,1 seconde ; le panneau droit arrive et pousse visuellement le logo vers le centre de la colonne gauche. La grille conserve ses dimensions pendant cette animation afin de ne pas recalculer les iframes et les tuiles à chaque image. La connexion conserve son animation.

Le chatbot entre depuis la droite une seconde après le début de l’allumage, affiche « Je serai là pour vous aider. » et cligne des yeux. Un clic sur le personnage rejoue le salut, sans fond ni effet de survol. Le chatbot présente les descriptions des étapes dans une bulle avec une pointe tournée vers le personnage : activation root, choix du thème, suivi des apprenants et questionnaire d’apprentissage. Le premier message de configuration apparaît après le déplacement du panneau, puis les actions sont révélées. Les états de chargement des onboardings réservent le fond sans afficher le skeleton du formulaire de connexion. Le mouvement réduit affiche immédiatement les instructions et omet les déplacements.

`brand.html` utilise les SVG originaux extraits par `export.py`, avec `brand.css` et une timeline limitée aux pixels du logo et au salut du chatbot. Cette animation conserve les temps et les easing Hyperframes, sans charger les fixtures, le bundle de thèmes ni la timeline de la présentation complète. Aucun logo statique n’est affiché avant le lecteur ; la zone reste réservée jusqu’à son initialisation. Le déplacement horizontal de la colonne utilise une transition CSS de transformation plutôt qu’une variable recalculée par JavaScript à chaque image. Les scènes du lecteur ne changent de visibilité qu’au passage à une autre scène.

Le dialogue flotte en dehors des cartes de formulaire, sans réserver de hauteur dans leurs wrappers. Son emplacement est choisi parmi cinq ancrages verticaux près du bord droit du panneau actif, en restant dans le viewport et à distance des contrôles. Le nouveau point diffère du précédent lorsqu’un autre ancrage est disponible. Un changement d’étape déclenche un glissement de 700 ms ; environ un tiers des déplacements ajoutent un tour de 360° du personnage en 800 ms. Le mouvement réduit omet ces transitions. Sur mobile, le dialogue est placé sous la carte, en dehors de son défilement interne.

Le lecteur Hyperframes du chatbot propose quatre gestes : salut, hochement, regard latéral et double clignement. Chaque apparition choisit un geste différent du précédent ; tous reviennent à une pose neutre. Ces variantes sont définies dans `brand-timeline.js`, exportées avec le lecteur et sélectionnées par le paramètre `gesture`.

Le personnage se déplace librement par glisser-déposer, avec des limites calculées depuis sa position réelle dans le viewport. Un déplacement ne déclenche pas le clic d’ouverture. Un liseré de contraste distingue son disque des tuiles de même couleur.

Un clic ouvre trois questions indépendantes, en pilules de couleur secondaire, dans un éventail proche de 90° orienté vers l’espace disponible. Elles apparaissent par opacité avec un délai de 120 ms entre chaque item et suivent le personnage pendant le déplacement. La question sélectionnée utilise la couleur accent ; sa réponse remplace le message dans la bulle principale, sans agrandir ni superposer les items radiaux. Chaque choix déclenche un geste Hyperframes différent du précédent, dans le lecteur existant, sans recharger l’iframe.

Le chatbot est hébergé par le layout partagé : le changement d’étape remplace ses instructions et son ancrage sans démonter le personnage ni son iframe. Lors d’un choix de question, les items se referment et la bulle affiche trois points animés pendant 750 ms avant la réponse. Sa taille évolue avec une transition de 400 ms ; le texte précédent est retiré immédiatement pour éviter sa réorganisation dans une bulle étroite. Si l’éventail doit se placer du côté du dialogue et le recouvre, la bulle s’efface tant que les questions sont ouvertes, puis revient à la sélection.

En plein écran, le bouton Réduire occupe le coin supérieur droit du panneau et remplace la croix ; le contrôle inférieur est masqué. Le contour du personnage reste fin, y compris en thème sombre.

Le lecteur et son iframe reçoivent aussi le `color-scheme` du thème actif : Chrome conserve ainsi la transparence en mode sombre sans ajouter un halo blanc autour du personnage.
