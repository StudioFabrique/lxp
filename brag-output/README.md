# Présentation ANDRIA LXP

Version actuelle : **1 min 36,5**, 1920 × 1080, sans audio. Voir `brag-plan.md` pour le déroulé et les composants repris.

Ouvrir `composition/` dans Hyperframes. Les retouches précédentes sont archivées dans `revisions/user-edit-20261005/`. Les MP4 dans `composition/renders/` sont conservés ; ils ne comprennent pas ces dernières retouches. La version actuelle est visible dans le Studio et dans les tuiles de connexion.

## Sources et reconstruction

Pour reprendre le workflow sur une autre machine, versionner `brag-output/` et
`front/public/presentations/andria/` avec les composants du login. Le `.gitignore`
exclut les anciens rendus MP4, les captures de validation et les caches Hyperframes.
Ces fichiers restent disponibles localement et peuvent être régénérés ; ils ne
sont pas nécessaires pour ouvrir le montage dans Studio ou afficher les tuiles.
Les assets, les fixtures, la configuration Hyperframes et les archives des
retouches utilisateur sont conservés dans Git.

`composition/index.html` contient le montage actuel, y compris les modifications
Studio. Pour créer une nouvelle séquence, repartir de ce montage et des composants
existants, puis synchroniser `style.css`, `motion.js`, `source.html.in` et
`.build-sha256` après les retouches Studio. Exporter ensuite les tuiles depuis la
racine avec `python3 brag-output/login-embed/export.py`. Ne pas relancer le
générateur historique `presentation.py` sur le montage actuel.

- `composition/presentation.py` : scènes et contenu de démonstration.
- `composition/ui-fixtures.tsx` : imports des vrais composants du LXP.
- `composition/build-ui.mjs` : pré-rendu des composants et compilation Tailwind/DaisyUI.
- `composition/style.css`, `composition/motion.js` : mise en page et timeline.
- `composition/source.html.in` : document assemblé avant injection CSS/JS.
- `composition/build.py` : sortie `index.html`, avec protection des modifications Studio.

Depuis `composition/` :

```sh
# Nécessaire seulement après modification des composants ou de leurs fixtures.
# HYPERFRAMES_ESBUILD désigne le module esbuild déjà installé avec Hyperframes.
HYPERFRAMES_ESBUILD=/chemin/vers/esbuild/lib/main.js node build-ui.mjs
python3 build.py
npx --yes hyperframes check
npx --yes hyperframes@0.8.130 preview --background --port 3017
```

Si `build.py` détecte une retouche Studio, il s’arrête. Sauvegarder cette retouche, la reporter dans les sources puis réconcilier le hash ; ne pas forcer une reconstruction sur une modification non relue.

Les données sont fictives. Aucun appel à l’IA ou à l’API du LXP, aucun envoi et aucune modification des bases. Les mêmes scènes sont exportées dans `front/public/presentations/andria/`. Aucun backend modifié ni dépendance applicative ajoutée.

Le nouvel export MP4 attend la revue de cette timeline, conformément au workflow brag. Le poster sera actualisé depuis une image validée du nouveau montage.

Les sources actuelles reprennent les retouches enregistrées dans Studio. `presentation.py` reste le générateur historique : ne pas le relancer sur ces sources. Après une retouche Studio, réconcilier les sources avant `build.py`, puis lancer `python3 brag-output/login-embed/export.py` depuis la racine.

Dernières retouches : logo continu révélé par un masque de cases animé sans traits visibles, sept niveaux pédagogiques en 14 secondes avec transitions 3D, icône Rocket pour Parcours, morphing des humeurs avec curseur et profondeur, calendrier sans Timeline, suggestion de quiz dans le flux du chatbot, curseurs contextuels sur les scènes interactives.

La scène `dashboards` construit les espaces apprenant et pédagogique pendant 13 secondes : sidebar réelle pré-rendue via `SidebarItem` et `sidebarItems`, passage compact/complet, caméra continue sans rebonds, cartes dévoilées progressivement. Les badges DaisyUI indiquent les rôles avec les icônes Lucide du LXP. Les clics superflus ont été retirés ; les clics du chatbot et du calendrier ouvrent des aperçus. La hiérarchie comporte six clics sur la droite, avec des lignes différentes et de courts déplacements locaux.

Les curseurs n’apparaissent désormais que pour des actions avec un résultat visible et disparaissent pendant la lecture. Les scènes de statistiques et de construction d’interface ne comportent plus de pauses de curseur sans action.

Le dashboard est présenté sans cadre global, comme le `PageWrapper` du LXP. Le lanceur du chatbot est pré-rendu depuis `ChatbotButton` par `composition/chatbot-fixture.tsx`, sans appel à l’IA. Une caméra commune rapproche l’avatar à la fin de la scène, puis l’identité ANDRIA termine la présentation à 96,5 secondes.

La fin du dashboard reprend la bulle d’aide native à sa propre échelle, avec le texte original. Un seul clignement bref utilise deux masques SVG centrés sur les yeux natifs, sans déplacer ni tourner leurs tracés. Les cartes se construisent avec un décalage de 350 ms.

Les pauses finales des scènes éditeur, évaluation, devoirs, organisation, progression, accompagnement et consommation IA sont raccourcies par `compactTime`, sans accélérer les mouvements. `sourceSceneClocks` garde les coordonnées temporelles du montage pour les interactions et les halos ; les métadonnées HTML portent les temps de présentation. L’avatar de la scène chatbot reprend le salut et le clignement du lanceur. La prise en compte de l’alerte utilise les couleurs `success` et affiche sa confirmation.
