# Brief de composition : ANDRIA

108 s, 1920 × 1080, silencieux. Storyboard détaillé dans `brag-plan.md`.

Le film emploie les vrais thèmes DaisyUI compilés depuis `front/src/index.css`. `ui-fixtures.tsx` pré-rend les composants présentation du dépôt avec des données locales : CursorGlowCard, HierarchicalListCard, BoxWrapper, HeaderChatbot. Les icônes proviennent de Lucide. La géométrie du logo est celle conservée dans le montage Studio utilisateur.

Le DOM de CursorGlowCard est réellement issu du composant. Sa position lumineuse est ensuite pilotée par GSAP pour être déterministe lors d’un seek ou d’un export. Le comportement React de souris/spring n’est pas hydraté dans la vidéo. Les transitions CSS du navigateur sont supprimées à la compilation de la feuille vidéo et remplacées par la timeline.

Une timeline GSAP pausée `main`, douze scènes, profondeur CSS 3D, morphing SVG des humeurs et interpolation des variables des thèmes. Pas d’appel distant au rendu. Les scripts navigateur chargés sont GSAP et MorphSVG locaux.

Les scènes autres que les composants pré-rendus sont des vues éditoriales du produit, conçues depuis leurs implémentations existantes. Ce n’est pas un enregistrement d’une session authentifiée.

La source génératrice est `presentation.py`, la mise en page `style.css`, l’animation `motion.js`. `build.py` refuse d’écraser une modification Studio postérieure au dernier build.
