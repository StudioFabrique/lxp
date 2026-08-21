# Contenus pédagogiques pour le mode démonstration

Ce document fournit un jeu de contenus directement saisissable dans le LXP. Il s’adresse à des adultes débutants en reconversion. Les durées correspondent à un travail actif, activité comprise. Les ressources pointent vers des sites publics ; les vidéos au format `youtube.com/embed` peuvent être ajoutées comme activité iframe sans fichier local.

## Table de synthèse

| Formation | Code | Parcours | Modules | Cours | Leçons | Évaluations |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| Développeur·se web full-stack | DEV-FS-101 | Fondamentaux du web et de l’intégration | 3 | 6 | 12 | 4 |
| Développeur·se web full-stack | DEV-FS-101 | Construire une application web full-stack | 3 | 6 | 12 | 4 |
| Commercial·e B2B : prospection et vente consultative | SAL-B2B-101 | Prospecter et qualifier des opportunités | 3 | 6 | 12 | 4 |
| Commercial·e B2B : prospection et vente consultative | SAL-B2B-101 | Conduire un cycle de vente consultative | 3 | 6 | 12 | 4 |
| **Total** |  | **4 parcours** | **12** | **24** | **48** | **16** |

---

## Formation 1 — Développeur·se web full-stack

**Code :** DEV-FS-101  
**Niveau :** Débutant  
**Description :** Apprenez à concevoir l’interface, la logique serveur et les données d’une petite application web. La formation alterne repères techniques, exercices courts et réalisation d’un projet utilisable.  
**Tags :** web, HTML, CSS, JavaScript, React, Node.js, API, base de données  
**Compétences visées :** structurer une page accessible ; styliser une interface responsive ; programmer des interactions ; créer et consommer une API ; modéliser des données ; publier une application simple.

### Parcours 1.1 — Fondamentaux du web et de l’intégration

**Description :** Découvrez le fonctionnement du Web puis réalisez une page claire, adaptable et interactive.  
**Objectifs pédagogiques :** identifier le rôle du navigateur et du serveur ; écrire du HTML sémantique ; mettre en forme avec CSS ; ajouter des comportements JavaScript simples.  
**Compétences :** intégration HTML/CSS, accessibilité de base, responsive design, manipulation du DOM.  
**Ordre des modules :** 1. Le Web et HTML ; 2. CSS et mise en page ; 3. JavaScript et qualité.  
**Évaluation finale :** quiz final DEV-P1-QF, après les trois modules.

#### Module 1.1.1 — Comprendre le Web et structurer une page

**Objectif :** Produire une page HTML lisible par le navigateur, les moteurs de recherche et les technologies d’assistance.  
**Description :** Vous repérez le trajet d’une requête puis vous organisez le contenu avec des balises qui portent du sens.  
**Durée indicative :** 1 h 30.

##### Cours 1.1.1.1 — Du navigateur au serveur

**Description :** Les repères nécessaires pour comprendre ce qui se passe entre une adresse web et une page affichée.

###### Leçon 1.1.1.1.1 — Suivre une requête web

Quand vous saisissez une adresse, votre navigateur demande une ressource à un serveur. Le nom de domaine aide à trouver ce serveur ; le protocole HTTPS protège ensuite les échanges. Le serveur renvoie une réponse, souvent un document HTML, puis le navigateur demande les fichiers cités dans ce document, comme une feuille CSS, une image ou un script. Le code 200 indique une réponse obtenue, 404 signale une ressource absente et 500 une erreur côté serveur. Ces codes ne servent pas à impressionner un recruteur : ils vous aident à localiser un problème. Ouvrez les outils de développement dès qu’une page semble lente ou incomplète. L’onglet Réseau montre les requêtes, leur statut et leur durée. Vous apprendrez ainsi à distinguer un défaut de lien, de style ou de serveur avant de modifier du code.

**Activité 1.1.1.1.1 — Lire le réseau**  
**Type :** exercice guidé avec ressource externe. **Durée :** 10 min.  
Ouvrez [la page de démonstration MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server), puis les outils de développement de votre navigateur. Rechargez la page, relevez une requête HTML et une requête CSS, leurs statuts et leurs types. Écrivez une phrase qui explique la différence entre les deux.

###### Leçon 1.1.1.1.2 — Choisir les bons outils de travail

Un projet web commence avec peu d’outils. Un éditeur de code vous aide à écrire et à retrouver les fichiers. Un navigateur affiche le résultat et ses outils de développement révèlent le HTML calculé, les styles actifs et les erreurs JavaScript. Git enregistre les versions importantes de votre travail ; il ne remplace pas les sauvegardes, mais il permet de revenir à un état connu. Créez un dossier par projet et donnez des noms explicites aux fichiers : `index.html`, `style.css` et `script.js` suffisent pour démarrer. Évitez de copier un dossier entier sans comprendre son contenu. Avant chaque séance, lancez la page, modifiez une seule chose, observez le résultat puis enregistrez un jalon Git. Cette boucle courte limite les erreurs accumulées. Elle rend aussi votre progression visible lorsque vous relisez un projet quelques semaines plus tard.

**Activité 1.1.1.1.2 — Préparer son espace de travail**  
**Type :** exercice guidé. **Durée :** 10 min.  
Suivez la [prise en main de GitHub Desktop](https://docs.github.com/fr/desktop/overview/getting-started-with-github-desktop). Créez un dossier `ma-premiere-page`, ajoutez les trois fichiers cités dans la leçon et faites un premier commit intitulé `Initialiser la page`. Notez dans votre carnet le rôle de l’éditeur, du navigateur et de Git.

##### Cours 1.1.1.2 — HTML sémantique et accessible

**Description :** Construisez une structure de contenu qui reste compréhensible sans mise en forme visuelle.

###### Leçon 1.1.1.2.1 — Donner du sens au contenu

HTML décrit la nature du contenu avant son apparence. Utilisez `header` pour l’en-tête, `nav` pour les liens de navigation, `main` pour le contenu principal et `footer` pour les informations de fin de page. Dans `main`, un `article` porte un contenu autonome tandis que `section` regroupe une partie qui possède son propre titre. Les titres suivent une hiérarchie : un `h1` présente le sujet de la page, puis les `h2` et `h3` organisent les sous-parties. Ne choisissez pas une balise de titre pour obtenir une taille de police. Les lecteurs d’écran et les moteurs de recherche s’appuient sur cette structure. Commencez donc par rédiger les titres, les paragraphes, les listes et les liens. Ajoutez les conteneurs génériques `div` seulement quand aucune balise sémantique ne convient. Votre CSS restera plus simple à lire et à maintenir.

**Activité 1.1.1.2.1 — Structurer une fiche métier**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez [les éléments de section MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements#contenu_de_section). Écrivez le squelette HTML d’une fiche « Développeur·se junior » avec un `header`, une `nav`, un `main`, deux `section` et un `footer`. Vérifiez que chaque section possède un titre.

###### Leçon 1.1.1.2.2 — Rendre les liens, images et formulaires utilisables

Un lien doit annoncer sa destination. Préférez « Consulter le programme du parcours » à « Cliquez ici ». Une image informative reçoit un texte alternatif qui décrit l’information utile ; une image décorative reçoit un attribut `alt` vide. Les formulaires demandent la même précision. Associez chaque champ à un élément `label`, indiquez le format attendu et affichez un message d’erreur compréhensible. Un champ obligatoire ne doit pas reposer sur la seule couleur ou sur un astérisque isolé. Testez votre page au clavier : la touche Tab doit atteindre les liens, les champs et les boutons dans un ordre logique. Vous n’avez pas besoin de connaître toutes les règles d’accessibilité dès le premier jour. Ces habitudes couvrent déjà des difficultés fréquentes et améliorent le confort de toutes les personnes qui visitent votre page, sur mobile comme avec un lecteur d’écran.

**Activité 1.1.1.2.2 — Contrôler l’accessibilité de base**  
**Type :** exercice guidé. **Durée :** 15 min.  
Ajoutez une image, un lien et un champ e-mail à votre fiche. Inspirez-vous du [guide MDN sur les formulaires accessibles](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form). Passez ensuite dans la page avec Tab. Corrigez tout élément qui ne reçoit pas le focus ou dont l’intitulé reste ambigu.

###### Quiz du module 1.1.1 — DEV-M1-Q

1. Quel code indique qu’une ressource demandée est introuvable ?  
   - A. 200  
   - B. 404  
   - C. 500  
   **Réponse correcte : B.** Le serveur utilise 404 quand il ne trouve pas la ressource demandée.
2. Quelle balise contient le contenu principal unique d’une page ?  
   - A. `main`  
   - B. `span`  
   - C. `footer`  
   **Réponse correcte : A.** `main` identifie la zone centrale de contenu.
3. Quel texte de lien aide le mieux un lecteur d’écran ?  
   - A. « Ici »  
   - B. « En savoir plus »  
   - C. « Télécharger le programme PDF »  
   **Réponse correcte : C.** Le texte annonce l’action et la destination sans contexte supplémentaire.

#### Module 1.1.2 — Mettre en page avec CSS

**Objectif :** Créer une interface lisible qui s’adapte aux écrans courants.  
**Description :** Vous reliez les styles à une structure HTML, puis vous organisez le contenu avec les outils de mise en page CSS.  
**Durée indicative :** 1 h 45.

##### Cours 1.1.2.1 — Sélecteurs, cascade et styles utiles

**Description :** Comprenez comment CSS cible les éléments et résout les styles concurrents.

###### Leçon 1.1.2.1.1 — Cibler sans compliquer

Une règle CSS associe un sélecteur à des propriétés. Le sélecteur `p` cible tous les paragraphes ; `.card` cible les éléments qui portent la classe `card` ; `#contact` cible un identifiant unique. Commencez avec des sélecteurs courts et proches du contenu. Une classe exprime un rôle visuel réutilisable, comme `button-primary` ou `card`. L’identifiant convient surtout aux ancres et aux associations de formulaire. Quand deux règles ciblent le même élément, CSS applique la plus spécifique ou la dernière règle de force égale. Cette cascade explique de nombreux styles qui semblent « ne pas marcher ». Ouvrez l’inspecteur du navigateur et regardez les règles barrées : il vous montre laquelle gagne. Évitez `!important` pendant vos premiers projets. Cette solution cache le conflit au lieu de vous apprendre à organiser vos styles.

**Activité 1.1.2.1.1 — Identifier la règle gagnante**  
**Type :** exercice guidé avec vidéo intégrable. **Durée :** 12 min.  
Visionnez la vidéo intégrable [CSS Crash Course](https://www.youtube.com/embed/yfoY53QXEnI). Dans votre page, créez deux règles qui donnent une couleur différente au même paragraphe, une avec `p` et une avec `.intro`. Observez la règle active dans l’inspecteur puis expliquez pourquoi elle gagne.

###### Leçon 1.1.2.1.2 — Composer une interface lisible

Une interface agréable dépend d’abord de choix simples et cohérents. Limitez votre palette à une couleur d’action, une couleur de texte et des surfaces neutres. Choisissez une police disponible sur le système ou une police web, puis définissez une taille de base confortable. Les espaces sont aussi importants que les éléments : une marge sépare deux blocs, un `padding` crée de l’air à l’intérieur d’un bloc. Réutilisez quelques valeurs, par exemple 8, 16 et 24 pixels, pour obtenir un rythme régulier. Vérifiez le contraste entre le texte et son fond, surtout pour les boutons et les informations secondaires. Ne copiez pas une maquette pixel par pixel quand vous débutez. Cherchez plutôt à rendre le contenu hiérarchisé : un titre se distingue, un bouton semble cliquable et une information longue reste facile à parcourir.

**Activité 1.1.2.1.2 — Créer une mini charte**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez le [contrôleur de contraste WebAIM](https://webaim.org/resources/contrastchecker/). Définissez trois variables CSS pour la couleur d’action, le texte et le fond. Appliquez-les à une carte de formation avec un titre, un paragraphe et un bouton. Testez le contraste du texte du bouton et notez le résultat.

##### Cours 1.1.2.2 — Flexbox, grille et responsive design

**Description :** Organisez les composants sans positionnement fragile et adaptez-les à la largeur disponible.

###### Leçon 1.1.2.2.1 — Aligner des éléments avec Flexbox

Flexbox organise des éléments sur une ligne ou une colonne. Ajoutez `display: flex` au conteneur, puis choisissez la direction avec `flex-direction`. La propriété `gap` crée un espace régulier entre les enfants. `justify-content` répartit les éléments sur l’axe principal ; `align-items` les aligne sur l’axe secondaire. Cette distinction paraît abstraite jusqu’au premier essai : si la direction est `row`, l’axe principal est horizontal. Utilisez Flexbox pour une barre de navigation, un groupe de boutons ou le contenu d’une carte. Activez `flex-wrap: wrap` lorsque les éléments peuvent passer à la ligne sur un écran étroit. Ne fixez pas des largeurs rigides par réflexe. Une base flexible, complétée par `min-width` ou `max-width`, produit souvent une interface plus robuste et réduit le nombre de corrections à prévoir sur mobile.

**Activité 1.1.2.2.1 — Construire une barre de navigation**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Suivez les exemples de [Flexbox sur MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Flexbox). Transformez votre `nav` en ligne de trois liens, avec un `gap` de 16 pixels. Réduisez la fenêtre : ajoutez le retour à la ligne si les liens se chevauchent. Conservez une capture avant et après.

###### Leçon 1.1.2.2.2 — Passer d’une colonne à plusieurs cartes

CSS Grid convient aux mises en page à deux dimensions. Vous pouvez définir des colonnes et des lignes, puis laisser les cartes s’y placer. La règle `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` crée autant de colonnes que la largeur le permet, sans vous obliger à connaître la taille de chaque écran. Cette approche propose une version mobile par défaut : une colonne lorsque l’espace manque, plusieurs lorsque la place augmente. Ajoutez une media query uniquement si la mise en page a besoin d’un changement net, comme masquer une barre latérale ou agrandir un titre. Testez votre page en faisant glisser la largeur de la fenêtre, pas seulement avec deux tailles d’écran. Regardez le moment où les lignes deviennent difficiles à lire ou les boutons trop serrés. Votre contenu doit guider les choix de mise en page, pas l’inverse.

**Activité 1.1.2.2.2 — Adapter une grille de cartes**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez [le guide Grid de web.dev](https://web.dev/learn/css/grid/). Créez trois cartes de formation dans un conteneur Grid avec la règle proposée dans la leçon. Vérifiez la page à 375, 768 et 1 280 pixels. Notez le nombre de colonnes visible à chaque largeur et ajustez la largeur minimale si nécessaire.

###### Quiz du module 1.1.2 — DEV-M2-Q

1. Quel sélecteur cible une classe nommée `card` ?  
   - A. `#card`  
   - B. `.card`  
   - C. `card()`  
   **Réponse correcte : B.** Le point introduit un sélecteur de classe.
2. Quelle propriété crée un espace régulier entre les enfants d’un conteneur flex ?  
   - A. `gap`  
   - B. `float`  
   - C. `z-index`  
   **Réponse correcte : A.** `gap` gère l’espace entre les éléments sans marge latérale répétée.
3. Pourquoi utiliser `minmax(220px, 1fr)` dans une grille ?  
   - A. Pour imposer une largeur fixe  
   - B. Pour conserver des cartes lisibles tout en partageant l’espace  
   - C. Pour cacher les cartes sur mobile  
   **Réponse correcte : B.** La grille respecte une largeur minimale puis répartit l’espace restant.

#### Module 1.1.3 — Ajouter du JavaScript et vérifier sa page

**Objectif :** Créer des interactions simples et repérer les défauts courants avant de livrer une page.  
**Description :** Vous manipulez le DOM, répondez à une action utilisateur et contrôlez la qualité de l’intégration.  
**Durée indicative :** 1 h 45.

##### Cours 1.1.3.1 — JavaScript dans la page

**Description :** Passez d’une page statique à une interaction courte et compréhensible.

###### Leçon 1.1.3.1.1 — Sélectionner et modifier le DOM

Le DOM représente votre page HTML sous forme d’objets que JavaScript peut lire et modifier. Avec `document.querySelector`, vous sélectionnez le premier élément qui correspond à un sélecteur CSS. Conservez ce résultat dans une constante claire, puis modifiez un texte, une classe ou un attribut. Par exemple, un bouton peut ajouter la classe `is-open` à une réponse masquée. Gardez le HTML pour le contenu, le CSS pour l’apparence et JavaScript pour le comportement. Cette séparation facilite le débogage. Vérifiez aussi qu’un élément existe avant de l’utiliser, surtout si votre script sert plusieurs pages. Un message d’erreur dans la console indique souvent une faute dans le sélecteur ou un script chargé avant le HTML. Placez votre balise `script` à la fin du `body` ou utilisez l’attribut `defer` pour éviter ce problème.

**Activité 1.1.3.1.1 — Afficher une réponse**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Parcourez [l’introduction MDN au DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction). Ajoutez un bouton « Afficher les prérequis » et un paragraphe masqué à votre page. Au clic, ajoutez une classe qui affiche le paragraphe. Testez le résultat dans la console avec un `console.log` sur l’élément ciblé.

###### Leçon 1.1.3.1.2 — Écouter une action et valider une saisie

Une interaction démarre par un événement : clic, saisie, envoi de formulaire ou touche du clavier. Attachez un écouteur avec `addEventListener` plutôt qu’un attribut JavaScript dans le HTML. Votre fonction reçoit un objet d’événement. Lors d’un envoi de formulaire de démonstration, `event.preventDefault()` évite le rechargement pendant que vous vérifiez les champs. Commencez par des règles simples : un champ vide, une adresse e-mail sans `@` ou une longueur minimale. Affichez le message près du champ concerné et retirez-le quand la correction est faite. Ne comptez pas sur JavaScript seul pour protéger des données réelles ; le serveur devra valider à nouveau les informations. Dans cette étape, vous cherchez surtout à aider la personne qui remplit le formulaire. Une validation claire réduit les essais inutiles et rend l’interface plus rassurante.

**Activité 1.1.3.1.2 — Valider une inscription fictive**  
**Type :** exercice guidé avec vidéo intégrable. **Durée :** 15 min.  
Visionnez [JavaScript Form Validation](https://www.youtube.com/embed/In0nB0ABaUk). Ajoutez un formulaire avec un champ e-mail et un bouton. À l’envoi, empêchez le rechargement et affichez « Saisissez une adresse e-mail valide » si le champ ne contient pas `@`. Essayez un champ vide puis une valeur correcte.

##### Cours 1.1.3.2 — Tester, déboguer et publier une première page

**Description :** Contrôlez le rendu, les erreurs et les règles de base avant de partager votre travail.

###### Leçon 1.1.3.2.1 — Déboguer avec méthode

Le débogage consiste à réduire une situation floue à un fait observable. Reproduisez d’abord le problème avec une action précise. Regardez ensuite la console : une erreur indique le fichier et souvent la ligne concernée. Inspectez l’élément qui pose problème pour confirmer son HTML et ses styles calculés. Modifiez une seule hypothèse à la fois. Si un bouton ne répond pas, vérifiez dans cet ordre : le script est-il chargé, le sélecteur trouve-il le bouton, l’écouteur se déclenche-il, puis la fonction modifie-t-elle le bon élément ? Ajoutez un `console.log` temporaire à chaque étape. Retirez ces traces avant de partager le projet. Ne passez pas directement à une réécriture complète. Une correction minimale vous apprend la cause et réduit le risque d’introduire une erreur différente. Cette méthode reste valable pour React, Node ou une application plus grande.

**Activité 1.1.3.2.1 — Réparer un bouton silencieux**  
**Type :** exercice guidé avec ressource externe. **Durée :** 12 min.  
Utilisez le [guide de débogage JavaScript de MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Testing/JavaScript). Changez volontairement le sélecteur de votre bouton pour qu’il soit faux. Suivez les quatre vérifications de la leçon et notez le premier indice qui révèle l’erreur. Rétablissez ensuite le sélecteur.

###### Leçon 1.1.3.2.2 — Vérifier avant de partager

Une page terminée mérite une courte revue avant sa publication. Relisez les titres et les textes de lien ; un contenu exact évite des corrections plus coûteuses qu’un ajustement visuel. Testez les liens, le clavier et la page sur une largeur étroite. Passez votre HTML dans un validateur : il détecte des balises mal imbriquées ou des attributs incomplets. Un outil de performance peut signaler une image trop lourde ou un contraste insuffisant. Ces outils donnent des pistes, pas une note définitive. Décidez si chaque remarque concerne votre page et corrigez ce qui gêne l’usage. Enfin, demandez à une personne de retrouver une information précise sans votre aide. Si elle hésite, observez son parcours avant de défendre votre choix. Cette vérification croise contenu, technique et expérience utilisateur. Elle devient une habitude utile dès les premiers projets et dans une équipe professionnelle.

**Activité 1.1.3.2.2 — Faire une revue de page**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Soumettez votre HTML au [validateur W3C](https://validator.w3.org/). Corrigez au moins une erreur ou confirmez qu’aucune erreur ne remonte. Puis ouvrez [PageSpeed Insights](https://pagespeed.web.dev/) sur une page publique de votre choix et relevez une recommandation liée à l’accessibilité ou aux performances.

###### Quiz du module 1.1.3 — DEV-M3-Q

1. Quelle méthode sélectionne le premier élément qui correspond à un sélecteur CSS ?  
   - A. `document.querySelector()`  
   - B. `document.createPage()`  
   - C. `window.listen()`  
   **Réponse correcte : A.** Cette méthode renvoie le premier élément correspondant.
2. Quel rôle joue `preventDefault()` lors de l’envoi d’un formulaire de démonstration ?  
   - A. Il efface les champs  
   - B. Il évite l’action native, comme le rechargement  
   - C. Il envoie le formulaire plus vite  
   **Réponse correcte : B.** Vous pouvez alors contrôler les champs avant toute suite.
3. Quelle première action aide à déboguer un bouton inactif ?  
   - A. Réécrire toute la page  
   - B. Reproduire le problème et lire la console  
   - C. Ajouter `!important`  
   **Réponse correcte : B.** Une erreur de console donne souvent un indice direct sur le fichier ou la ligne.

###### Quiz final du parcours 1.1 — DEV-P1-QF

1. Pourquoi choisir une balise HTML sémantique ?  
   - A. Pour obtenir une couleur automatique  
   - B. Pour décrire le rôle du contenu  
   - C. Pour éviter le CSS  
   **Réponse correcte : B.** La structure aide les navigateurs, les moteurs et les technologies d’assistance.
2. Quel outil convient à une rangée de boutons qui peut revenir à la ligne ?  
   - A. Flexbox avec `flex-wrap`  
   - B. Une image unique  
   - C. Un tableau HTML  
   **Réponse correcte : A.** Flexbox aligne le groupe puis le laisse se répartir sur plusieurs lignes.
3. Dans quel ordre analyser un problème JavaScript ?  
   - A. Modifier au hasard puis publier  
   - B. Vérifier chargement, sélection, écouteur et effet  
   - C. Changer de navigateur sans lire les erreurs  
   **Réponse correcte : B.** Cette séquence isole rapidement la cause du défaut.

### Parcours 1.2 — Construire une application web full-stack

**Description :** Assemblez une interface React, une API Node.js et une base de données autour d’un même besoin.  
**Objectifs pédagogiques :** découper une interface en composants ; gérer l’état et les requêtes ; concevoir une API REST ; stocker des données ; sécuriser les accès de base ; déployer un projet.  
**Compétences :** React, Node.js, Express, API REST, SQL, authentification, déploiement.  
**Ordre des modules :** 1. Interface React ; 2. API Node.js ; 3. Données, sécurité et mise en ligne.  
**Évaluation finale :** quiz final DEV-P2-QF, après les trois modules.

#### Module 1.2.1 — Construire une interface avec React

**Objectif :** Décomposer une interface en composants et faire circuler les données nécessaires.  
**Description :** Vous construisez une petite liste de tâches et rendez l’écran réactif aux actions de la personne utilisatrice.  
**Durée indicative :** 2 h.

##### Cours 1.2.1.1 — Composants et propriétés

**Description :** Organisez l’interface en morceaux réutilisables dont le rôle reste clair.

###### Leçon 1.2.1.1.1 — Découper une interface en composants

React vous invite à découper l’écran en composants. Un composant regroupe un morceau d’interface et reçoit les données dont il a besoin. Pour une liste de tâches, vous pouvez créer `TaskList`, `TaskItem` et `AddTaskForm`. Ce découpage ne vise pas à créer beaucoup de fichiers. Il sert à donner un rôle simple à chaque partie et à éviter les répétitions. Commencez par dessiner votre écran, puis entourez les blocs qui peuvent être compris séparément. Un composant parent garde la vue d’ensemble et passe des propriétés, appelées props, à ses enfants. L’enfant lit ces props sans les modifier. Cette circulation à sens unique facilite le suivi des données : vous savez où chercher lorsqu’un titre ou un statut semble faux. Donnez des noms métier aux composants et aux props. `task.title` explique mieux votre intention que `data.value`.

**Activité 1.2.1.1.1 — Cartographier les composants**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez [Décrire l’interface de React](https://react.dev/learn/describing-the-ui). Dessinez l’écran d’une liste de tâches et nommez trois composants. Pour chacun, écrivez les données qu’il reçoit. Créez ensuite un composant `TaskItem` qui affiche une prop `title` et une prop `done`.

###### Leçon 1.2.1.1.2 — Afficher une collection de données

Une application affiche souvent une collection : tâches, produits, messages ou inscriptions. En React, vous transformez un tableau JavaScript en éléments avec `map`. Chaque élément rendu doit recevoir une prop `key` stable, liée à son identité dans les données. Utilisez l’identifiant de la tâche lorsque vous en avez un. Évitez l’index du tableau dès que la liste peut changer d’ordre ou perdre un élément ; React risque alors d’associer un ancien affichage à la mauvaise donnée. Préparez aussi les états utiles autour de la liste : aucune tâche, chargement et erreur. Une page qui affiche une zone vide ne dit pas à la personne si elle doit agir ou attendre. Un message court, comme « Aucune tâche pour le moment », transforme une absence de données en consigne claire. Cette attention facilite la suite, quand l’API remplacera votre tableau local.

**Activité 1.2.1.1.2 — Rendre une liste de tâches**  
**Type :** exercice guidé avec vidéo intégrable. **Durée :** 15 min.  
Visionnez [React JS Crash Course](https://www.youtube.com/embed/w7ejDZ8SWv8). Créez un tableau de trois tâches avec un `id`, un `title` et un booléen `done`. Utilisez `map` pour rendre un `TaskItem` par tâche. Affichez « Terminée » ou « À faire » selon la valeur de `done`.

##### Cours 1.2.1.2 — État, événements et formulaires

**Description :** Faites évoluer l’interface quand la personne ajoute, coche ou filtre une tâche.

###### Leçon 1.2.1.2.1 — Gérer un état sans le modifier directement

L’état contient les données qui changent pendant l’utilisation d’un composant. Le hook `useState` fournit une valeur et une fonction pour demander sa mise à jour. Ne modifiez jamais directement un tableau ou un objet placé dans l’état. Créez une nouvelle version avec `map`, `filter` ou l’opérateur de décomposition. React peut alors comparer l’ancienne valeur et la nouvelle, puis mettre à jour l’écran. Pour cocher une tâche, passez son identifiant à une fonction qui reconstruit le tableau. La tâche concernée reçoit un statut inversé ; les autres restent inchangées. Cette écriture paraît plus longue qu’une modification directe, mais elle évite des comportements imprévisibles. Gardez aussi l’état au niveau du plus proche parent commun aux composants qui en ont besoin. Vous éviterez de dupliquer la même information dans plusieurs endroits de l’interface.

**Activité 1.2.1.2.1 — Cocher une tâche**  
**Type :** exercice guidé avec ressource externe. **Durée :** 18 min.  
Suivez [la mise à jour d’objets et tableaux dans l’état](https://react.dev/learn/updating-arrays-in-state). Ajoutez une case à cocher à `TaskItem`. Dans le parent, créez une fonction qui reçoit l’identifiant et recrée le tableau avec le statut modifié. Vérifiez que seule la tâche cochée change d’affichage.

###### Leçon 1.2.1.2.2 — Contrôler un formulaire React

Un champ contrôlé reçoit sa valeur depuis l’état React et la renvoie par un gestionnaire `onChange`. Cette relation vous permet de valider, réinitialiser ou préremplir le champ de façon prévisible. Pour ajouter une tâche, gardez le texte saisi dans un état `draft`. À l’envoi, empêchez le comportement natif, retirez les espaces inutiles et refusez une valeur vide. Créez ensuite une nouvelle tâche avec un identifiant temporaire, ajoutez-la au tableau et videz le champ. Le formulaire ne doit pas perdre le texte de la personne à cause d’une erreur de réseau ou d’une validation imprécise. Affichez le message près de la zone concernée. Quand plusieurs champs dépendent les uns des autres, ne cherchez pas une abstraction trop tôt. Un état par champ reste lisible dans un petit formulaire. Vous regrouperez les données plus tard si le besoin le justifie.

**Activité 1.2.1.2.2 — Ajouter une tâche par formulaire**  
**Type :** exercice guidé avec ressource externe. **Durée :** 18 min.  
Consultez [les champs contrôlés de React](https://react.dev/reference/react-dom/components/input). Créez un champ et un bouton « Ajouter ». Refusez une saisie vide avec un message. Pour une saisie valide, ajoutez la tâche en tête de liste puis effacez le champ. Testez trois ajouts successifs.

###### Quiz du module 1.2.1 — DEV-M4-Q

1. Quel est le rôle principal d’un composant React ?  
   - A. Stocker toute la base de données  
   - B. Regrouper une partie d’interface avec son rôle  
   - C. Remplacer le navigateur  
   **Réponse correcte : B.** Un composant isole une partie d’écran et les données utiles à son rendu.
2. Quelle valeur sert de `key` dans une liste qui peut changer ?  
   - A. Un identifiant stable de la donnée  
   - B. La couleur du texte  
   - C. L’index du tableau dans tous les cas  
   **Réponse correcte : A.** React suit ainsi le bon élément même si la liste évolue.
3. Pourquoi créer un nouveau tableau pour modifier un état ?  
   - A. Pour que React détecte la nouvelle valeur  
   - B. Pour éviter les props  
   - C. Pour supprimer les événements  
   **Réponse correcte : A.** Une nouvelle référence permet à React de déclencher le rendu attendu.

#### Module 1.2.2 — Exposer une API avec Node.js

**Objectif :** Créer une API REST qui reçoit, valide et renvoie des données dans un format prévisible.  
**Description :** Vous reliez une interface à un serveur Express autour des tâches du projet.  
**Durée indicative :** 2 h.

##### Cours 1.2.2.1 — Routes HTTP et réponses JSON

**Description :** Donnez à l’interface une porte d’entrée stable vers les données.

###### Leçon 1.2.2.1.1 — Concevoir des routes compréhensibles

Une API REST expose des ressources par des adresses cohérentes. Pour des tâches, `GET /tasks` liste les tâches et `GET /tasks/:id` renvoie une tâche précise. `POST /tasks` crée une tâche ; `PATCH /tasks/:id` modifie un champ ; `DELETE /tasks/:id` la retire. Le verbe HTTP décrit l’intention, tandis que l’URL désigne la ressource. Renvoyez du JSON avec un statut adapté : 200 pour une lecture réussie, 201 après une création, 400 quand la requête est invalide, 404 si la ressource manque. Ne mélangez pas un statut 200 et un message d’erreur dans le même format. L’interface pourra alors traiter le résultat sans deviner. Écrivez d’abord les routes et des exemples de réponse avant de brancher une base de données. Cette petite conception évite des noms confus et vous aide à expliquer l’API à une autre personne de l’équipe.

**Activité 1.2.2.1.1 — Dessiner le contrat d’API**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez [les méthodes HTTP sur MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Methods). Rédigez un tableau de quatre routes pour les tâches : méthode, URL, action et statut de succès. Ajoutez un exemple JSON pour `POST /tasks`, avec un titre et un statut `done`.

###### Leçon 1.2.2.1.2 — Traiter une requête Express

Express relie une méthode HTTP et un chemin à une fonction de traitement. Cette fonction reçoit `req`, qui contient les paramètres, le corps et les en-têtes, puis `res`, qui construit la réponse. Dans une première version, gardez les tâches dans un tableau mémoire. Créez `app.get('/tasks', ...)` pour renvoyer ce tableau avec `res.json`. Pour créer une tâche, lisez `req.body`, contrôlez que le titre existe et renvoyez une réponse 201. Une application réelle perd ce tableau à chaque redémarrage ; vous ajouterez une base de données dans le module suivant. Le but ici reste de comprendre le trajet d’une information. Testez chaque route avec un client HTTP ou depuis votre interface. Si le serveur renvoie une erreur, lisez le message dans le terminal avant de toucher au composant React. Le défaut se situe parfois côté serveur, même si vous le voyez dans le navigateur.

**Activité 1.2.2.1.2 — Créer deux routes Express**  
**Type :** exercice guidé avec ressource externe. **Durée :** 20 min.  
Suivez le [guide de démarrage Express](https://expressjs.com/fr/starter/hello-world.html). Créez une route `GET /tasks` qui renvoie un tableau de deux tâches et une route `POST /tasks` qui ajoute une tâche si son titre existe. Testez les deux requêtes avec l’extension ou le client HTTP de votre choix.

##### Cours 1.2.2.2 — Valider et consommer l’API

**Description :** Protégez le serveur des données incomplètes puis affichez le résultat dans React.

###### Leçon 1.2.2.2.1 — Valider à la frontière du serveur

Le navigateur facilite la saisie, mais le serveur doit vérifier chaque donnée reçue. Une personne peut modifier une requête dans ses outils de développement, appeler l’API depuis un autre programme ou contourner un formulaire. Définissez donc les règles dans la route ou dans une fonction dédiée : le titre doit être une chaîne non vide, `done` doit être un booléen et un identifiant doit respecter le format attendu. Renvoyez une réponse 400 avec un message utile quand la donnée échoue au contrôle. Ne renvoyez pas le détail interne d’une erreur de base de données. Journalisez cette erreur côté serveur et donnez à l’interface un message sûr. La validation ne remplace pas une règle métier. Une tâche peut être techniquement valide mais impossible à modifier après archivage. Séparez ces deux questions : d’abord la forme de la requête, puis l’autorisation de l’action dans votre logique métier.

**Activité 1.2.2.2.1 — Refuser une tâche invalide**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Parcourez les [codes d’état HTTP de MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status). Dans `POST /tasks`, renvoyez 400 et `{ "error": "Le titre est requis" }` quand le titre est vide. Envoyez une requête valide puis une requête invalide. Relevez le statut et le corps reçus dans chaque cas.

###### Leçon 1.2.2.2.2 — Afficher un chargement, un succès et une erreur

Quand React demande des données à une API, la réponse n’arrive pas dans le même instant que le clic. Votre interface doit rendre visible cette attente. Créez un état pour les données, un état de chargement et un état d’erreur. Lancez la requête dans `useEffect` au chargement du composant ou dans un gestionnaire après une action. Si la réponse échoue, affichez un message qui aide à poursuivre : « Impossible de charger les tâches. Réessayez. » Évitez de laisser l’écran vide ou de montrer l’erreur technique brute. Après une création, deux stratégies existent : ajouter la réponse reçue à l’état local ou relancer la liste depuis l’API. Pour votre premier projet, choisissez l’approche la plus lisible et gardez une seule source de vérité. Testez aussi une erreur volontaire en arrêtant le serveur. Vous vérifierez que le message s’affiche sans casser toute la page.

**Activité 1.2.2.2.2 — Brancher la liste à l’API**  
**Type :** exercice guidé avec ressource externe. **Durée :** 20 min.  
Lisez [Synchroniser avec des effets dans React](https://react.dev/learn/synchronizing-with-effects). Remplacez le tableau local par un `fetch` vers `GET /tasks`. Affichez « Chargement… » avant la réponse et un message d’erreur si la requête échoue. Coupez le serveur une fois pour vérifier le scénario d’erreur.

###### Quiz du module 1.2.2 — DEV-M5-Q

1. Quelle route liste des tâches dans une API REST ?  
   - A. `GET /tasks`  
   - B. `POST /list-tasks-now`  
   - C. `DELETE /tasks`  
   **Réponse correcte : A.** GET lit la collection de ressources désignée par `/tasks`.
2. Quel statut convient après la création réussie d’une tâche ?  
   - A. 201  
   - B. 404  
   - C. 500  
   **Réponse correcte : A.** 201 signale qu’une ressource a été créée.
3. Pourquoi valider les données côté serveur ?  
   - A. Le navigateur empêche toutes les requêtes invalides  
   - B. Toute requête peut contourner le formulaire  
   - C. Pour supprimer les messages d’erreur  
   **Réponse correcte : B.** Le serveur reste responsable de contrôler les données qu’il reçoit.

#### Module 1.2.3 — Données, sécurité et déploiement

**Objectif :** Persister les données, limiter les accès et publier une version simple de l’application.  
**Description :** Vous passez du prototype local à un projet dont les données et les choix de sécurité restent cohérents.  
**Durée indicative :** 2 h.

##### Cours 1.2.3.1 — Modéliser et interroger les données

**Description :** Choisissez une structure de données adaptée aux tâches et à leurs propriétaires.

###### Leçon 1.2.3.1.1 — Passer du besoin aux tables

Une base relationnelle organise les données dans des tables reliées. Avant d’écrire du SQL, partez des objets utiles à votre application. Pour une liste de tâches partagée, vous pouvez avoir une table `users` et une table `tasks`. Chaque tâche porte un titre, un statut, une date de création et un `user_id` qui indique son propriétaire. Donnez un identifiant unique à chaque ligne et choisissez des types cohérents : texte pour un titre, booléen pour un statut, date pour un horodatage. Une relation ne sert pas seulement à « ranger » les données. Elle évite d’écrire le même nom d’utilisateur dans chaque tâche et permet de supprimer ou protéger un compte selon des règles explicites. Dessinez votre modèle avec deux tables avant d’ouvrir l’outil de base. Cette étape révèle les champs manquants et les mots ambigus, comme « auteur » ou « responsable ».

**Activité 1.2.3.1.1 — Modéliser les tâches**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez [les notions relationnelles PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html). Dessinez deux tables, `users` et `tasks`, avec une clé primaire dans chacune. Ajoutez la clé étrangère `user_id` dans `tasks`. Écrivez une phrase qui décrit la relation entre les deux tables.

###### Leçon 1.2.3.1.2 — Lire sans tout exposer

Une requête SQL demande précisément les colonnes et les lignes utiles. `SELECT id, title, done FROM tasks WHERE user_id = $1` renvoie les tâches d’une personne sans exposer les autres comptes. N’utilisez pas `SELECT *` par réflexe : vous risquez de renvoyer une colonne sensible ajoutée plus tard, comme un jeton ou une note interne. Les paramètres comme `$1` séparent la requête des valeurs saisies ; ils empêchent qu’une chaîne hostile modifie votre SQL. Ajoutez des index seulement lorsque vous connaissez les recherches fréquentes et que les données le justifient. Au début, privilégiez un schéma clair et des requêtes correctes. Testez avec plusieurs utilisateurs fictifs. Votre API doit filtrer les tâches côté serveur ; cacher une ligne dans React ne protège pas la donnée. Cette règle prépare le travail d’autorisation du cours suivant.

**Activité 1.2.3.1.2 — Écrire une requête filtrée**  
**Type :** exercice guidé avec vidéo intégrable. **Durée :** 15 min.  
Visionnez [SQL Tutorial](https://www.youtube.com/embed/G3e-cpL7ofc). Écrivez une requête qui sélectionne l’identifiant, le titre et le statut des tâches de l’utilisateur 7. Remplacez 7 par un paramètre `$1` dans votre version finale. Expliquez pourquoi cette version protège mieux la requête.

##### Cours 1.2.3.2 — Sécuriser et mettre en ligne

**Description :** Appliquez les protections de base puis préparez une publication qui reste vérifiable.

###### Leçon 1.2.3.2.1 — Protéger les comptes et les secrets

Une application full-stack traite des données qui ne doivent pas circuler librement. Stockez les mots de passe sous forme de hachage adapté, jamais en texte lisible. Placez les clés d’API, mots de passe de base et secrets de session dans des variables d’environnement ; ne les envoyez pas dans Git. Après une connexion, le serveur doit identifier la personne puis vérifier ce qu’elle a le droit de faire. Être connecté ne donne pas le droit de modifier la tâche d’un autre compte. Contrôlez cette règle dans chaque route sensible à partir de l’identité du serveur, jamais d’un `userId` librement envoyé par le navigateur. Limitez aussi les messages d’erreur : un formulaire de connexion n’a pas besoin de révéler si une adresse existe. Ces pratiques ne remplacent pas un audit de sécurité, mais elles évitent des erreurs graves dans un projet débutant et installent de bons réflexes.

**Activité 1.2.3.2.1 — Établir une liste de contrôle sécurité**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez les [risques OWASP Top 10](https://owasp.org/www-project-top-ten/). Pour votre application, créez une liste de cinq contrôles : secrets hors de Git, mots de passe hachés, validation serveur, contrôle du propriétaire et HTTPS. Pour chacun, indiquez le fichier ou la couche où vous le vérifieriez.

###### Leçon 1.2.3.2.2 — Déployer une version que vous pouvez expliquer

Déployer consiste à rendre une version précise accessible sur une adresse publique. Préparez d’abord votre application : variables d’environnement documentées, commandes de démarrage fiables et journal d’erreurs lisible. Le front React produit des fichiers statiques ; le serveur Node reçoit les requêtes d’API et se connecte à la base. Choisissez une plateforme adaptée à votre exercice, puis renseignez les variables dans son espace sécurisé. Ne copiez pas les secrets dans le dépôt pour aller plus vite. Après la publication, testez le parcours principal : chargement de la liste, création contrôlée, affichage d’une erreur et accès depuis un téléphone. Notez l’URL, la version déployée et les réglages manuels dans un `README`. Cette trace permet de reproduire votre travail et aide un évaluateur à tester le projet. Un déploiement simple mais documenté vaut mieux qu’une démonstration locale difficile à lancer.

**Activité 1.2.3.2.2 — Préparer la livraison**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez le [guide de déploiement Vite](https://vite.dev/guide/static-deploy.html). Rédigez une section `Déploiement` pour votre README : prérequis, variables nécessaires, commande de build, commande de démarrage et trois tests à réaliser après publication. Faites relire cette section par une personne qui n’a pas suivi votre projet.

###### Quiz du module 1.2.3 — DEV-M6-Q

1. Quel champ relie une tâche à son propriétaire ?  
   - A. `user_id` dans `tasks`  
   - B. La couleur de la tâche  
   - C. Le titre de la tâche  
   **Réponse correcte : A.** Une clé étrangère référence l’identifiant de l’utilisateur propriétaire.
2. Pourquoi utiliser un paramètre SQL plutôt qu’une valeur concaténée ?  
   - A. Pour modifier le schéma  
   - B. Pour séparer les données de la requête et réduire les injections  
   - C. Pour remplacer l’authentification  
   **Réponse correcte : B.** Le paramétrage protège la structure de la requête.
3. Où conserver un secret de production ?  
   - A. Dans un commentaire Git  
   - B. Dans une variable d’environnement configurée sur la plateforme  
   - C. Dans le code React publié  
   **Réponse correcte : B.** Le secret reste hors du code distribué et du dépôt.

###### Quiz final du parcours 1.2 — DEV-P2-QF

1. Comment une donnée circule-t-elle dans un composant React enfant ?  
   - A. Par des props envoyées par le parent  
   - B. Par une route SQL directe  
   - C. Par le fichier CSS  
   **Réponse correcte : A.** Le parent transmet les informations nécessaires au rendu de l’enfant.
2. Quel statut une API renvoie-t-elle pour une requête invalide ?  
   - A. 201  
   - B. 400  
   - C. 404 dans tous les cas  
   **Réponse correcte : B.** 400 indique que la requête ne respecte pas le contrat attendu.
3. Quel contrôle protège les tâches de plusieurs comptes ?  
   - A. Cacher le bouton dans le navigateur  
   - B. Vérifier côté serveur le propriétaire de la tâche  
   - C. Changer le nom de la table  
   **Réponse correcte : B.** Le serveur doit vérifier l’autorisation avant toute lecture ou modification sensible.

---

## Formation 2 — Commercial·e B2B : prospection et vente consultative

**Code :** SAL-B2B-101  
**Niveau :** Débutant  
**Description :** Développez une prospection B2B respectueuse, qualifiez des besoins concrets et conduisez une vente qui aide le client à prendre une décision.  
**Tags :** vente B2B, prospection, CRM, découverte, qualification, négociation, relation client  
**Compétences visées :** définir une cible ; rechercher un compte ; écrire un premier contact ; qualifier une opportunité ; mener un rendez-vous ; construire une proposition ; négocier et suivre un client.

### Parcours 2.1 — Prospecter et qualifier des opportunités

**Description :** Construisez une prospection ciblée et transformez les premiers échanges en opportunités crédibles.  
**Objectifs pédagogiques :** choisir une cible prioritaire ; identifier des interlocuteurs ; préparer des messages utiles ; respecter le cadre de la prospection ; conduire une découverte ; enregistrer les informations dans un CRM.  
**Compétences :** segmentation, recherche de comptes, e-mail de prospection, appel d’approche, qualification, hygiène CRM.  
**Ordre des modules :** 1. Cible et préparation ; 2. Premier contact ; 3. Découverte et qualification.  
**Évaluation finale :** quiz final SAL-P1-QF, après les trois modules.

#### Module 2.1.1 — Définir sa cible et préparer sa prospection

**Objectif :** Choisir des comptes et des interlocuteurs pour lesquels votre offre peut résoudre un problème identifié.  
**Description :** Vous passez d’une liste large à une cible priorisée avec des critères vérifiables.  
**Durée indicative :** 1 h 45.

##### Cours 2.1.1.1 — Cible, segment et compte idéal

**Description :** Définissez qui contacter et pourquoi avant d’écrire le premier message.

###### Leçon 2.1.1.1.1 — Décrire un profil de client idéal

Un profil de client idéal décrit les entreprises qui tirent le plus de valeur de votre offre. Il ne s’agit pas d’inventer une entreprise parfaite. Appuyez-vous sur des critères observables : secteur, taille, zone géographique, équipement, cycle d’achat, contraintes réglementaires ou objectif de croissance. Pour un outil de gestion de planning, une cible peut être une société de services de 20 à 100 personnes dont les équipes travaillent sur plusieurs sites. Écrivez aussi les signaux qui rendent le besoin plus probable, comme une campagne de recrutement ou l’ouverture d’une agence. Ne mélangez pas le compte et la personne. Le compte est l’entreprise ; le décideur, l’utilisateur et le prescripteur y jouent des rôles différents. Un profil clair réduit le volume de messages inutiles et permet de préparer une approche qui paraît pertinente. Revoyez-le dès que les échanges réels montrent une tendance différente.

**Activité 2.1.1.1.1 — Rédiger votre ICP**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Utilisez le [modèle de buyer persona de HubSpot](https://offers.hubspot.com/persona-templates). Définissez un profil de client idéal pour une offre fictive de logiciel de planning : secteur, taille, problème, signal d’achat et frein probable. Limitez-vous à cinq critères qui aident réellement à sélectionner un compte.

###### Leçon 2.1.1.1.2 — Prioriser sans se fier à son intuition

Une liste de comptes devient utile quand vous pouvez expliquer son ordre. Créez une grille courte avec des critères liés à votre profil de client idéal. Donnez par exemple un point si le secteur correspond, un point si la taille convient, un point si un signal d’achat existe et un point si vous avez identifié un interlocuteur. Un score ne remplace pas votre jugement ; il évite que le dernier nom trouvé prenne toute votre attention. Classez les comptes en trois groupes : priorité immédiate, à nourrir, hors cible. Gardez la raison de chaque décision dans votre CRM ou tableau de suivi. Vous pourrez l’ajuster après les réponses obtenues. N’utilisez pas des informations personnelles inutiles pour attribuer un score. La prospection B2B a besoin de données liées au rôle professionnel et au besoin de l’entreprise, pas d’une surveillance des personnes.

**Activité 2.1.1.1.2 — Noter cinq comptes**  
**Type :** exercice guidé. **Durée :** 15 min.  
Créez un tableau avec les colonnes secteur, taille, signal, interlocuteur et score. Recherchez cinq entreprises fictives ou publiques dans un même secteur. Attribuez de zéro à quatre points à chacune, puis classez-les. Justifiez le premier compte en deux phrases et expliquez pourquoi un autre reste à nourrir.

##### Cours 2.1.1.2 — Recherche de compte et interlocuteurs

**Description :** Préparez un échange fondé sur des informations professionnelles utiles.

###### Leçon 2.1.1.2.1 — Chercher des informations actionnables

La recherche de compte sert à préparer une hypothèse, pas à réciter une fiche d’entreprise. Consultez le site, les offres d’emploi, les communiqués, les actualités et les publications professionnelles. Cherchez un fait qui peut influencer le besoin : un nouveau site, une équipe qui grandit, un changement d’outil annoncé ou une obligation métier. Notez la source et la date. Puis formulez une hypothèse prudente : « Votre ouverture à Lyon peut augmenter la complexité des plannings. » Cette phrase ouvre une discussion ; elle ne prétend pas connaître le problème mieux que le client. Évitez les détails personnels ou les données sensibles. Une recherche respectueuse se concentre sur l’activité publique de l’entreprise et le rôle de votre interlocuteur. Préparez deux questions qui confirment ou infirment l’hypothèse. Votre premier échange gagne en qualité lorsque vous écoutez la réponse au lieu d’enchaîner une présentation préparée.

**Activité 2.1.1.2.1 — Formuler une hypothèse de besoin**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez le [guide CNIL sur la prospection commerciale](https://www.cnil.fr/fr/la-prospection-commerciale). Choisissez une entreprise dont le site est public. Relevez deux informations professionnelles, indiquez leurs liens, puis écrivez une hypothèse de besoin et deux questions de vérification. Ne copiez aucune donnée personnelle dans votre livrable.

###### Leçon 2.1.1.2.2 — Cartographier les rôles d’achat

Une vente B2B implique rarement une seule personne. L’utilisateur décrit le travail quotidien, le responsable métier porte le résultat attendu, les achats cadrent la négociation et la direction peut valider le budget. Votre interlocuteur initial peut aussi jouer le rôle de relais interne sans signer lui-même. Cartographiez ces rôles dès les premiers échanges, sans chercher à joindre tout le monde en même temps. Demandez qui utilise la solution, qui porte le projet, qui valide le budget et qui doit donner son accord. Dessinez une carte simple : nom ou fonction, rôle, intérêt probable, niveau d’influence et prochaine action. Cette carte révèle les absences. Une opportunité qui dépend d’un acheteur non identifié reste fragile. Respectez le rythme de votre interlocuteur : il peut préférer vous présenter lui-même aux autres personnes. Votre rôle consiste à faciliter cette coordination, pas à contourner les relations établies dans le compte.

**Activité 2.1.1.2.2 — Dessiner le comité d’achat**  
**Type :** exercice guidé avec ressource externe. **Durée :** 12 min.  
Consultez [le module Salesforce sur le processus de vente](https://trailhead.salesforce.com/content/learn/modules/sales-process-basics). Pour l’entreprise choisie, dessinez quatre rôles : utilisateur, responsable métier, achats et décideur. Pour chacun, notez une attente possible et une question à poser. Entourez le rôle que vous avez déjà identifié.

###### Quiz du module 2.1.1 — SAL-M1-Q

1. Quel élément décrit le mieux un profil de client idéal ?  
   - A. Des critères d’entreprise liés à la valeur de l’offre  
   - B. Une liste de toutes les entreprises disponibles  
   - C. Les loisirs d’un contact  
   **Réponse correcte : A.** L’ICP aide à reconnaître les comptes où l’offre répond à un besoin probable.
2. Pourquoi attribuer un score aux comptes ?  
   - A. Pour remplacer tout échange humain  
   - B. Pour expliquer et organiser les priorités  
   - C. Pour collecter plus de données personnelles  
   **Réponse correcte : B.** Un score rend la sélection visible et révisable.
3. Quel rôle utilise la solution au quotidien ?  
   - A. L’utilisateur  
   - B. Le concurrent  
   - C. Le transporteur  
   **Réponse correcte : A.** L’utilisateur apporte une vision directe du travail concerné.

#### Module 2.1.2 — Obtenir un premier échange

**Objectif :** Écrire et conduire des prises de contact qui donnent une raison claire de répondre.  
**Description :** Vous choisissez un canal, formulez une accroche liée à un contexte et organisez des relances mesurées.  
**Durée indicative :** 1 h 45.

##### Cours 2.1.2.1 — E-mail et message de prospection

**Description :** Rédigez un message bref, spécifique et honnête sur sa finalité.

###### Leçon 2.1.2.1.1 — Écrire une accroche qui mérite une réponse

Un premier e-mail B2B aide une personne occupée à décider si un échange vaut son temps. L’objet reste court et lié au contexte du compte. Dans le corps, mentionnez un fait professionnel vérifiable, formulez une hypothèse modeste puis reliez-la à un résultat que votre offre peut soutenir. Évitez les phrases génériques sur « l’optimisation » ou « l’innovation ». Présentez-vous en une ligne, sans raconter toute l’entreprise. Terminez par une demande simple : vingt minutes pour vérifier le sujet, ou l’autorisation d’envoyer un exemple. Votre message doit pouvoir se lire sur mobile. Relisez-le en supprimant les promesses que vous ne pouvez pas démontrer. N’imitez pas une relation personnelle que vous n’avez pas. Une personnalisation utile montre que vous avez préparé l’échange ; elle ne transforme pas un message commercial en faveur à accepter.

**Activité 2.1.2.1.1 — Rédiger un premier e-mail**  
**Type :** exercice guidé. **Durée :** 15 min.  
Écrivez un e-mail de 90 mots maximum pour le compte prioritaire : objet, fait observé, hypothèse, bénéfice crédible et demande de créneau. Relisez-le en retirant deux formules génériques. Gardez une version prête à copier dans un CRM. Faites-le lire à un binôme qui doit retrouver le contexte et l’action demandée en moins d’une minute.

###### Leçon 2.1.2.1.2 — Respecter le cadre de la prospection

Une prospection utile respecte aussi les règles qui protègent les destinataires. En B2B, vous devez informer la personne de l’origine des données utilisées, de la finalité commerciale du contact et de son droit d’opposition. Utilisez une adresse professionnelle obtenue de façon loyale et adaptée à sa fonction. Donnez un moyen simple de ne plus recevoir vos messages, puis traitez cette demande sans délai. Ne conservez pas des données qui ne servent plus à la relation commerciale. Le RGPD n’interdit pas de prospecter ; il vous demande de pouvoir expliquer votre démarche et de respecter le choix des personnes. Vérifiez les règles de votre pays, de votre secteur et les consignes de votre entreprise avant une campagne. Une pratique propre protège votre réputation. Elle améliore aussi la qualité de la liste : une personne intéressée répond plus volontiers lorsqu’elle comprend pourquoi vous la contactez.

**Activité 2.1.2.1.2 — Ajouter les mentions utiles**  
**Type :** exercice guidé avec ressource externe. **Durée :** 12 min.  
Lisez la [fiche CNIL sur le droit d’opposition](https://www.cnil.fr/fr/le-droit-dopposition). Ajoutez à votre e-mail une phrase sobre qui indique comment ne plus être contacté. Écrivez ensuite, dans votre tableau de suivi, les champs nécessaires pour tracer la source du contact, la date du message et une éventuelle opposition.

##### Cours 2.1.2.2 — Appel d’approche et séquence de relance

**Description :** Préparez un appel court et une suite de contacts qui reste respectueuse.

###### Leçon 2.1.2.2.1 — Ouvrir un appel sans réciter un script

Un appel d’approche n’a pas pour but de présenter toutes les fonctionnalités. Il sert à vérifier si un échange plus long a un sens. Préparez une ouverture de trente secondes : votre nom, la raison du contact, le fait observé et une question. Demandez si le moment convient avant de poursuivre. Si la personne refuse, proposez un autre créneau ou terminez l’appel sans insister. Écoutez les mots employés par votre interlocuteur. Ils vous aideront à adapter votre vocabulaire et à préparer le rendez-vous. Gardez un script comme filet de sécurité, pas comme texte à réciter. Prenez des notes sur les faits, les objections et les actions convenues. Ne promettez pas une réduction ou une intégration que vous n’avez pas vérifiée. Un appel court, honnête et bien suivi crée plus de confiance qu’un discours dense qui retient la personne au téléphone.

**Activité 2.1.2.2.1 — Jouer un appel d’approche**  
**Type :** mise en situation guidée. **Durée :** 15 min.  
Préparez une ouverture de 30 secondes pour votre compte prioritaire. Jouez-la avec un binôme qui peut répondre « Je n’ai pas le temps ». Demandez l’autorisation de rappeler, puis notez une réponse possible. Réécoutez votre formulation : supprimez tout élément qui ressemble à une promesse non vérifiée.

###### Leçon 2.1.2.2.2 — Relancer avec une raison nouvelle

Une relance ne répète pas le premier message en ajoutant « je me permets ». Elle apporte une raison nouvelle de répondre ou accepte le silence. Préparez une séquence courte de deux à quatre contacts espacés. Vous pouvez partager un exemple proche du secteur, poser une question plus ciblée ou proposer de clôturer le sujet. Chaque message reprend le contexte en une phrase afin que la personne n’ait pas à chercher l’historique. Arrêtez la séquence lorsqu’elle exprime un refus, utilise le lien d’opposition ou reste inactive après le nombre de tentatives prévu. Consignez les dates et les retours dans le CRM. Cette trace évite les doublons lorsqu’un collègue travaille le même compte. Le volume ne remplace pas la pertinence. Une relance précise, envoyée au bon moment, vaut davantage qu’une série automatique qui dégrade l’image de votre entreprise.

**Activité 2.1.2.2.2 — Concevoir une séquence courte**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez le [guide HubSpot sur les relances commerciales](https://blog.hubspot.fr/sales/relance-commerciale). Écrivez une séquence de trois messages espacés de quatre jours : premier contact, apport d’un exemple, clôture respectueuse. Pour chaque message, indiquez l’information nouvelle apportée et la condition d’arrêt de la séquence.

###### Quiz du module 2.1.2 — SAL-M2-Q

1. Quel élément rend une accroche B2B crédible ?  
   - A. Un fait professionnel vérifiable sur le compte  
   - B. Une promesse de résultat garanti  
   - C. Un message identique pour tous  
   **Réponse correcte : A.** Le fait observé donne un contexte réel à l’hypothèse formulée.
2. Que doit proposer un message de prospection respectueux ?  
   - A. Un moyen simple de s’opposer aux contacts futurs  
   - B. Une adresse personnelle du commercial  
   - C. Un abonnement automatique  
   **Réponse correcte : A.** La personne doit pouvoir exercer son droit d’opposition.
3. Quel est le but premier d’un appel d’approche ?  
   - A. Signer le contrat dans tous les cas  
   - B. Vérifier l’intérêt d’un échange plus long  
   - C. Présenter toutes les fonctions du produit  
   **Réponse correcte : B.** L’appel qualifie l’ouverture à une discussion, il ne remplace pas la découverte.

#### Module 2.1.3 — Découvrir et qualifier une opportunité

**Objectif :** Conduire une conversation qui clarifie le problème, les personnes impliquées et l’étape suivante.  
**Description :** Vous préparez des questions, écoutez les réponses et évaluez la maturité d’une opportunité dans votre CRM.  
**Durée indicative :** 2 h.

##### Cours 2.1.3.1 — Entretien de découverte

**Description :** Faites parler le client de son contexte avant de présenter votre solution.

###### Leçon 2.1.3.1.1 — Poser des questions qui ouvrent la conversation

Un entretien de découverte commence par le travail du client, pas par votre démonstration. Préparez quelques questions ouvertes : « Comment gérez-vous les plannings aujourd’hui ? », « Qu’est-ce qui déclenche la recherche d’une solution ? » ou « Que se passe-t-il quand le processus bloque ? ». Ces questions invitent à raconter une situation. Écoutez sans préparer votre réponse pendant la phrase de l’autre personne. Reformulez ensuite un fait important pour vérifier votre compréhension : « Si je vous suis, les responsables perdent une heure chaque lundi à consolider les absences. » Demandez des exemples et des conséquences mesurables. Alternez les questions ouvertes, qui explorent, et les questions fermées, qui confirment un détail. Ne transformez pas la découverte en interrogatoire. Expliquez pourquoi vous posez une question sensible, comme le budget ou l’échéance, et donnez au client la possibilité de ne pas répondre à ce stade.

**Activité 2.1.3.1.1 — Préparer un guide de découverte**  
**Type :** exercice guidé avec ressource externe. **Durée :** 18 min.  
Utilisez le [module Salesforce sur la découverte](https://trailhead.salesforce.com/content/learn/modules/sales-discovery). Rédigez six questions pour une première réunion : deux sur le processus actuel, deux sur les conséquences, une sur les acteurs et une sur l’échéance. Jouez-les avec un binôme puis remplacez une question fermée inutile par une question ouverte.

###### Leçon 2.1.3.1.2 — Écouter, reformuler et prendre des notes utiles

Vos notes de découverte doivent permettre à un collègue de comprendre le dossier sans avoir assisté au rendez-vous. Séparez les faits rapportés, vos hypothèses et les actions décidées. Notez les mots exacts qui décrivent le problème, les exemples chiffrés, les personnes citées et les contraintes. Après un point important, reformulez avec vos propres mots et demandez confirmation. Cette pratique corrige les malentendus avant qu’ils deviennent une proposition inadaptée. Ne remplissez pas chaque silence. Le client peut avoir besoin de temps pour chercher une information ou préciser une réponse. À la fin de l’échange, résumez le besoin, les critères de succès et la prochaine étape. Envoyez un compte rendu court le jour même. Votre contact peut le corriger, le transférer et s’en servir pour mobiliser son équipe. Cette rigueur transforme une bonne conversation en opportunité exploitable.

**Activité 2.1.3.1.2 — Rédiger un compte rendu**  
**Type :** mise en situation guidée. **Durée :** 15 min.  
À partir d’un échange joué avec votre binôme, rédigez un compte rendu de 120 mots : problème cité, impact, parties prenantes, échéance et action suivante. Distinguez par des libellés « Fait », « Hypothèse » et « Action ». Faites valider le résumé par la personne qui a joué le client.

##### Cours 2.1.3.2 — Qualification et hygiène CRM

**Description :** Décidez si l’opportunité mérite une suite et gardez les informations fiables.

###### Leçon 2.1.3.2.1 — Évaluer la maturité sans forcer une case

Qualifier une opportunité consiste à évaluer si un problème réel, une valeur possible et un chemin de décision existent. Vous pouvez utiliser un cadre simple : besoin, impact, acteurs, décision et échéance. Le cadre vous aide à préparer les questions ; il ne doit pas vous pousser à inventer une réponse pour compléter une case. Un budget inconnu n’invalide pas automatiquement une opportunité si le client explore encore les options. En revanche, une absence durable de problème, d’accès aux acteurs ou d’étape suivante doit vous inciter à nourrir le compte plutôt qu’à le déclarer « chaud ». Notez votre niveau de confiance pour chaque information : confirmé, probable ou à vérifier. Discutez des opportunités incertaines avec votre responsable. Une qualification honnête améliore les prévisions et évite de faire perdre du temps au client comme à votre équipe.

**Activité 2.1.3.2.1 — Qualifier un cas client**  
**Type :** exercice guidé. **Durée :** 15 min.  
Lisez ce cas : « Une responsable RH cherche à réduire les conflits de planning avant l’ouverture de deux agences dans quatre mois. Elle utilisera l’outil, la direction valide le budget et les achats interviennent après un essai. » Classez besoin, impact, acteurs, décision et échéance en confirmé, probable ou à vérifier. Ajoutez deux questions pour les zones inconnues.

###### Leçon 2.1.3.2.2 — Tenir un CRM qui aide réellement l’équipe

Le CRM sert à partager une vision actuelle du compte, pas à cocher des champs pour satisfaire un tableau de bord. Après chaque échange, enregistrez la date, le canal, la personne contactée, les faits importants, l’étape de vente, la prochaine action et son échéance. Utilisez des intitulés cohérents afin que l’équipe retrouve les informations. Évitez de placer une note importante dans un champ libre invisible aux autres personnes. Fermez ou recyclez les opportunités perdues avec une raison exacte : pas de besoin, priorité reportée, concurrent, budget ou mauvais ciblage. Ces données permettront d’améliorer la prospection. Contrôlez les doublons avant de créer un nouveau compte ou contact. Un CRM propre réduit les messages répétés et rend les passages de relais plus fluides. Il protège aussi votre mémoire quand vous reprenez un dossier plusieurs semaines après le premier appel.

**Activité 2.1.3.2.2 — Mettre à jour une fiche d’opportunité**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Parcourez [les bases du CRM Salesforce](https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics). Créez une fiche d’opportunité fictive avec un compte, un contact, une étape, deux notes factuelles, une prochaine action et une date. Relisez-la comme si vous deviez la transmettre demain à un collègue absent au rendez-vous.

###### Quiz du module 2.1.3 — SAL-M3-Q

1. Quelle question lance une découverte utile ?  
   - A. « Comment gérez-vous ce processus aujourd’hui ? »  
   - B. « Vous voulez notre offre premium ? »  
   - C. « Puis-je envoyer le contrat ? »  
   **Réponse correcte : A.** La question explore le fonctionnement actuel avant de présenter une solution.
2. Que vérifie une reformulation ?  
   - A. Que le commercial parle plus longtemps  
   - B. Que la compréhension du besoin est correcte  
   - C. Que le client accepte le prix  
   **Réponse correcte : B.** Le client peut confirmer ou corriger le résumé entendu.
3. Quelle information doit figurer dans le CRM après un échange ?  
   - A. Une prochaine action datée  
   - B. Une opinion personnelle sans contexte  
   - C. Le mot de passe du contact  
   **Réponse correcte : A.** L’équipe sait alors qui fait quoi et à quel moment.

###### Quiz final du parcours 2.1 — SAL-P1-QF

1. Quel signal peut faire monter un compte dans vos priorités ?  
   - A. L’ouverture d’un nouveau site liée à votre offre  
   - B. La couleur de son logo  
   - C. Un nom difficile à prononcer  
   **Réponse correcte : A.** Un changement d’activité peut révéler un besoin plus probable.
2. Quel contenu doit apporter une relance ?  
   - A. Une raison nouvelle ou une clôture respectueuse  
   - B. Le même message copié chaque jour  
   - C. Une promesse de remise non validée  
   **Réponse correcte : A.** La relance reste utile seulement si elle apporte un élément pertinent.
3. Quel résultat montre une qualification honnête ?  
   - A. Une opportunité classée « à nourrir » quand les éléments manquent  
   - B. Toutes les opportunités marquées « chaud »  
   - C. Un CRM sans prochaine action  
   **Réponse correcte : A.** Le statut doit refléter les faits disponibles, même s’ils ne permettent pas encore de vendre.

### Parcours 2.2 — Conduire un cycle de vente consultative

**Description :** Transformez une opportunité qualifiée en décision partagée, puis préparez la suite de la relation client.  
**Objectifs pédagogiques :** cadrer une découverte approfondie ; relier la solution aux critères de décision ; animer une démonstration ; présenter une proposition ; traiter les objections ; négocier et conclure avec rigueur.  
**Compétences :** vente consultative, démonstration, proposition commerciale, traitement d’objections, négociation, suivi de compte.  
**Ordre des modules :** 1. Approfondir le besoin ; 2. Proposer et convaincre ; 3. Négocier, conclure et transmettre.  
**Évaluation finale :** quiz final SAL-P2-QF, après les trois modules.

#### Module 2.2.1 — Approfondir le besoin et préparer la solution

**Objectif :** Co-construire une compréhension précise du problème et des critères qui guideront la décision.  
**Description :** Vous animez une découverte approfondie, puis préparez une démonstration ancrée dans le contexte du client.  
**Durée indicative :** 2 h.

##### Cours 2.2.1.1 — Diagnostic et critères de succès

**Description :** Passez d’un symptôme exprimé à un problème prioritaire et mesurable.

###### Leçon 2.2.1.1.1 — Distinguer le symptôme, la cause et l’impact

Un client peut formuler un symptôme : « Les plannings prennent trop de temps. » Votre travail consiste à comprendre le processus derrière cette phrase. Demandez quand le problème apparaît, qui intervient, quelles informations manquent et ce que l’équipe fait pour le contourner. Cherchez ensuite l’impact : heures perdues, erreurs, retards, insatisfaction ou risque de conformité. Ne supposez pas la cause parce que vous reconnaissez un cas connu. Un manque de visibilité peut venir d’un outil mal configuré, de règles différentes entre sites ou d’un changement d’organisation. Dessinez le parcours actuel avec le client : étape, responsable, outil, difficulté et conséquence. Cette carte crée une base partagée pour décider. Elle peut aussi révéler que votre offre ne traite qu’une partie du problème. Dans ce cas, dites-le et voyez comment l’intégrer ou réorientez honnêtement l’opportunité.

**Activité 2.2.1.1.1 — Cartographier le processus actuel**  
**Type :** mise en situation guidée. **Durée :** 18 min.  
Prenez le cas des plannings multi-sites. Dessinez cinq étapes, de la collecte des absences à la publication du planning. Pour chaque étape, notez l’acteur, l’outil, une difficulté et une conséquence. Entourez le point où votre logiciel fictif peut aider, puis identifiez un problème qu’il ne résout pas.

###### Leçon 2.2.1.1.2 — Définir des critères de succès partagés

Les critères de succès donnent une direction concrète à la vente et au futur déploiement. Transformez les attentes vagues en résultats observables. « Gagner du temps » peut devenir « réduire de 30 % le temps de consolidation hebdomadaire dans les trois mois ». Demandez qui mesure le résultat, avec quelle donnée de départ et à quelle date. Un critère doit aussi indiquer la personne ou l’équipe concernée. Ne promettez pas un résultat qui dépend d’une décision client non prise, comme l’adoption par tous les managers sans plan de formation. Formulez plutôt les conditions nécessaires : import des données, pilote sur un site, formation de deux référents. Faites valider les critères par le sponsor métier. Ils guideront votre démonstration, votre proposition et les échanges avec les décideurs. Lorsque le client partage ces critères, il peut plus facilement défendre le projet en interne après votre rendez-vous.

**Activité 2.2.1.1.2 — Formuler trois critères de succès**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez le [guide SMART de l’Agence nationale pour l’amélioration des conditions de travail](https://www.anact.fr/). Pour le cas des plannings, écrivez trois critères de succès avec un indicateur, une cible et une échéance. Ajoutez pour chacun la personne qui validera la mesure. Faites corriger les formulations trop vagues par un binôme.

##### Cours 2.2.1.2 — Préparer une démonstration utile

**Description :** Montrez le bon scénario aux bonnes personnes, au lieu d’empiler des fonctionnalités.

###### Leçon 2.2.1.2.1 — Construire un scénario de démonstration

Une démonstration utile raconte une situation que le client reconnaît. Reprenez le problème et les critères validés, puis choisissez deux ou trois étapes de votre produit qui y répondent. Pour le planning multi-sites, vous pouvez montrer la collecte des absences, la détection d’un conflit et la publication d’une vue partagée. Préparez des données de démonstration proches du contexte, sans utiliser de données personnelles réelles. Annoncez le déroulé et invitez les participants à vous interrompre lorsque le scénario ne correspond plus à leur pratique. Ne montrez pas chaque menu parce qu’il existe. Une fonctionnalité qui ne sert pas la décision détourne l’attention et allonge la réunion. Préparez aussi un plan B : capture d’écran, jeu de données de secours ou réponse différée pour une intégration non disponible. Votre objectif consiste à aider le client à se projeter dans son propre travail.

**Activité 2.2.1.2.1 — Écrire le fil d’une démo**  
**Type :** exercice guidé. **Durée :** 18 min.  
Écrivez un scénario en trois scènes pour le logiciel de planning : situation initiale, action dans l’outil, résultat visible. Placez une question de vérification après chaque scène. Jouez ce fil avec un binôme qui vous interrompt sur une étape peu claire. Supprimez ensuite une fonctionnalité qui ne répond à aucun critère de succès.

###### Leçon 2.2.1.2.2 — Animer une démonstration en conversation

Pendant une démonstration, gardez un rythme qui permet au client de réagir. Commencez par confirmer l’objectif du rendez-vous et les personnes présentes. Présentez une scène, faites une pause, puis demandez comment cette étape se passe aujourd’hui. Quand un participant exprime un doute, explorez-le avant de passer à la suite. Vous pouvez dire : « Je préfère comprendre ce point plutôt que poursuivre l’écran suivant. » Prenez note des demandes hors périmètre et convenez d’une réponse après le rendez-vous. Ne cachez pas une limite connue. Expliquez ce que le produit fait, ce qu’il ne fait pas encore et la solution de contournement éventuelle. Terminez par un résumé des critères couverts, des questions restantes et de la prochaine action. Une démonstration devient persuasive lorsque les participants contribuent à son déroulé et reconnaissent leur contexte dans les exemples montrés.

**Activité 2.2.1.2.2 — Animer cinq minutes de démo**  
**Type :** mise en situation guidée. **Durée :** 15 min.  
Jouez une démonstration de cinq minutes avec un binôme. Présentez une scène, posez une question de vérification et réagissez à l’objection « Cela ne correspond pas à notre organisation ». Terminez par une synthèse d’une minute. Le binôme vous donne un retour sur votre temps de parole et la clarté de la prochaine action.

###### Quiz du module 2.2.1 — SAL-M4-Q

1. Quel élément mesure l’impact d’un problème de planning ?  
   - A. Le nombre d’heures de consolidation par semaine  
   - B. La couleur de l’outil utilisé  
   - C. Le nom du commercial  
   **Réponse correcte : A.** Un temps mesuré permet d’évaluer l’effet du problème et d’une solution.
2. Que doit contenir un critère de succès ?  
   - A. Un indicateur, une cible et une échéance  
   - B. Une promesse sans condition  
   - C. La liste complète des fonctionnalités  
   **Réponse correcte : A.** Ces éléments rendent le résultat observable et vérifiable.
3. Quel déroulé convient à une démonstration ?  
   - A. Montrer tous les menus disponibles  
   - B. Suivre un scénario lié au contexte du client  
   - C. Lire la documentation à voix haute  
   **Réponse correcte : B.** Le scénario aide les participants à relier le produit à leur travail.

#### Module 2.2.2 — Construire une proposition et traiter les objections

**Objectif :** Présenter une recommandation qui relie le besoin, la valeur, les conditions et les prochaines décisions.  
**Description :** Vous préparez une proposition lisible et abordez les réserves sans argumenter à la place du client.  
**Durée indicative :** 2 h.

##### Cours 2.2.2.1 — Proposition de valeur et offre

**Description :** Transformez les éléments de découverte en une recommandation concrète.

###### Leçon 2.2.2.1.1 — Rédiger une proposition centrée sur le besoin

Une proposition commerciale reprend les mots et les priorités entendus pendant la découverte. Ouvrez par le contexte et le problème confirmé, puis décrivez la recommandation. Reliez chaque composant de l’offre à un résultat attendu : le module de collecte réduit les relances manuelles ; le tableau multi-sites facilite l’arbitrage des responsables. Indiquez aussi le périmètre, les hypothèses, les exclusions, le calendrier et les responsabilités. Un prix isolé force le client à comparer uniquement un montant. Un prix relié à un périmètre et à un résultat permet une discussion plus juste. Évitez les affirmations non prouvées, comme « meilleur retour sur investissement du marché ». Si vous disposez d’un exemple pertinent, présentez son contexte avant son résultat. Relisez la proposition du point de vue d’une personne absente aux rendez-vous. Elle doit comprendre le besoin, l’offre, les choix à faire et l’étape suivante sans chercher les informations dans vos notes.

**Activité 2.2.2.1.1 — Rédiger le résumé d’une proposition**  
**Type :** exercice guidé avec ressource externe. **Durée :** 18 min.  
Consultez ce [modèle de proposition commerciale](https://www.hubspot.com/sales/sales-proposal-template). Rédigez 150 mots pour le cas des plannings : contexte, recommandation, deux résultats attendus, périmètre et hypothèse. Soulignez chaque phrase qui provient d’un fait de découverte. Retirez toute promesse sans preuve ou condition.

###### Leçon 2.2.2.1.2 — Présenter le prix avec clarté

Le prix fait partie de la décision, il ne doit pas arriver comme une surprise à la dernière minute. Présentez le modèle de tarification, le périmètre inclus, les options, les frais de mise en œuvre et les conditions de paiement. Si vous proposez plusieurs options, donnez à chacune un usage clair : pilote limité, déploiement standard ou accompagnement renforcé. Ne créez pas trois offres artificielles pour manipuler le choix. Vérifiez la capacité d’achat avant de construire une proposition complexe. Quand le budget reste incertain, explorez la méthode de décision et la valeur attendue plutôt que de demander un chiffre brutalement. Si le client compare des offres, demandez les critères qui comptent pour lui : intégration, accompagnement, délai, sécurité ou coût total. Vous pourrez répondre sur le bon terrain. Le prix devient plus facile à discuter lorsque le client relie le montant au problème à résoudre et aux conditions de réussite.

**Activité 2.2.2.1.2 — Construire trois options**  
**Type :** exercice guidé. **Durée :** 15 min.  
Pour votre logiciel fictif, créez une option pilote, une option standard et une option accompagnée. Indiquez pour chacune le périmètre, le calendrier, le prix fictif et le client auquel elle convient. Vérifiez que les différences reflètent un besoin réel, pas seulement une remise. Préparez une phrase qui introduit les options sans pousser la plus chère.

##### Cours 2.2.2.2 — Objections et dialogue de décision

**Description :** Accueillez les réserves, clarifiez leur nature et construisez une réponse vérifiable.

###### Leçon 2.2.2.2.1 — Comprendre avant de répondre à une objection

Une objection peut exprimer une question, une contrainte réelle ou une façon polie de terminer l’échange. Ne répondez pas au premier mot entendu. Accueillez la réserve, puis demandez ce qu’elle recouvre. « Le prix est élevé » peut signifier que le budget n’existe pas, que la valeur reste floue ou qu’une autre solution semble moins chère. Reformulez votre compréhension et cherchez un exemple. Répondez seulement avec un élément précis : un périmètre ajusté, une comparaison de coût total, une référence ou une étape de validation. Si vous ne savez pas, dites que vous allez vérifier et fixez un retour. Évitez les techniques qui cherchent à coincer le client ou à minimiser son inquiétude. Une objection bien traitée vous donne une information sur le processus de décision. Notez-la dans le CRM et vérifiez à la réunion suivante que la réponse a réellement levé le doute.

**Activité 2.2.2.2.1 — Explorer une objection prix**  
**Type :** mise en situation guidée. **Durée :** 15 min.  
Avec un binôme, jouez l’objection « Votre proposition dépasse notre budget ». Le commercial doit poser trois questions avant de répondre. Le client choisit ensuite l’une des causes : budget absent, valeur incertaine ou offre concurrente. Écrivez la reformulation et la réponse adaptée à cette cause. Le binôme vérifie qu’aucune réponse n’arrive avant les questions.

###### Leçon 2.2.2.2.2 — Obtenir un engagement sur la prochaine étape

Un rendez-vous utile se termine par une action précise, portée par une personne et une date. Après avoir traité les questions, demandez ce qui doit se passer pour avancer : validation métier, revue sécurité, comparaison interne ou accord des achats. Proposez une étape adaptée, comme une réunion avec le sponsor et l’équipe IT, un pilote cadré ou une revue de proposition. Résumez les décisions prises, les points ouverts et les responsabilités. N’acceptez pas un « on revient vers vous » comme seule suite si l’opportunité reste active. Vous pouvez demander : « Qui doit participer à la prochaine discussion et quel créneau pouvons-nous réserver ? » Si le client ne peut pas s’engager, découvrez ce qui manque et ajustez le statut dans le CRM. Une prochaine étape n’est pas un prétexte pour garder une opportunité ouverte. Elle représente un accord mutuel sur un travail concret qui rapproche ou éloigne une décision.

**Activité 2.2.2.2.2 — Conclure un rendez-vous de proposition**  
**Type :** exercice guidé avec ressource externe. **Durée :** 12 min.  
Lisez les conseils de [Gong sur les prochaines étapes](https://www.gong.io/blog/next-steps-sales/). Écrivez la conclusion d’un rendez-vous pour le cas des plannings : résumé, point ouvert, action, responsable et date. Jouez-la à voix haute avec un binôme. Remplacez toute formule vague par un engagement vérifiable.

###### Quiz du module 2.2.2 — SAL-M5-Q

1. Que doit relier une proposition commerciale ?  
   - A. Le besoin confirmé, l’offre et le résultat attendu  
   - B. Seulement le logo et le prix  
   - C. Les préférences personnelles du vendeur  
   **Réponse correcte : A.** La proposition permet au client de comprendre la pertinence de la recommandation.
2. Quelle première réaction convient à « Votre prix est élevé » ?  
   - A. Accorder une remise immédiate  
   - B. Demander ce que cette réserve recouvre  
   - C. Répéter le tarif plus fort  
   **Réponse correcte : B.** La même phrase peut cacher des causes différentes qui demandent des réponses différentes.
3. Quel élément rend une prochaine étape exploitable ?  
   - A. Un responsable et une date  
   - B. Une promesse de rappeler un jour  
   - C. Un message sans objet  
   **Réponse correcte : A.** L’équipe et le client savent alors quoi faire et quand.

#### Module 2.2.3 — Négocier, conclure et transmettre

**Objectif :** Mener une négociation équilibrée, sécuriser la conclusion et préparer un passage de relais fiable.  
**Description :** Vous protégez la valeur de l’offre tout en adaptant le périmètre, puis vous accompagnez les premières étapes client.  
**Durée indicative :** 2 h.

##### Cours 2.2.3.1 — Négociation et accord

**Description :** Préparez vos marges de manœuvre et échangez des concessions contre des engagements.

###### Leçon 2.2.3.1.1 — Préparer une négociation équilibrée

Une négociation commence avant la réunion. Listez les sujets qui peuvent évoluer : périmètre, volume, calendrier, conditions de paiement, accompagnement ou durée d’engagement. Pour chacun, définissez votre position cible, votre limite et ce que vous pouvez demander en échange. Une remise peut, par exemple, être liée à un engagement plus long, un paiement anticipé ou un périmètre réduit. Vérifiez ces limites avec les personnes qui valident les conditions dans votre entreprise. Arriver sans mandat vous expose à promettre une exception impossible à tenir. Préparez aussi les intérêts du client : réduire le risque, respecter une date, limiter l’investissement initial ou rassurer une équipe. Cherchez les options qui répondent aux deux parties. Gardez une trace écrite des points discutés. Une négociation réussie ne se mesure pas seulement à la signature ; elle laisse un accord que chaque équipe peut appliquer sans surprise.

**Activité 2.2.3.1.1 — Préparer une matrice de négociation**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Consultez le [guide de négociation de Harvard Business Review](https://hbr.org/topic/negotiating). Créez un tableau pour le logiciel de planning avec quatre sujets : prix, durée, déploiement et accompagnement. Pour chacun, notez cible, limite et contrepartie possible. Demandez à un binôme de jouer le client et de tester une de vos limites.

###### Leçon 2.2.3.1.2 — Sécuriser les conditions avant la signature

La conclusion d’une vente nécessite plus qu’un accord verbal. Vérifiez le périmètre retenu, les livrables, le prix, les dates, les responsabilités, les conditions de paiement et la procédure de signature. Identifiez la personne autorisée à signer et le circuit interne : revue juridique, achats, sécurité ou direction. Ne supposez pas qu’un sponsor métier peut engager l’entreprise. Envoyez une version propre de la proposition ou du contrat avec les changements récapitulés. Lorsque le client demande une modification, confirmez son effet sur le prix, le délai ou le périmètre avant de la valider. Utilisez les modèles approuvés par votre entreprise ; un cours ne remplace pas les conseils juridiques. Après la signature, remerciez les personnes impliquées et confirmez la date de lancement. Votre rigueur à cette étape évite les attentes contradictoires et facilite la relation avec l’équipe qui prendra le relais.

**Activité 2.2.3.1.2 — Vérifier une fiche de conclusion**  
**Type :** exercice guidé. **Durée :** 15 min.  
Créez une liste de contrôle de signature : signataire, périmètre, prix, échéances, paiement, livrables, conditions et date de lancement. Appliquez-la à l’option standard créée dans le module précédent. Marquez les informations manquantes et rédigez les questions à envoyer avant toute signature fictive.

##### Cours 2.2.3.2 — Passage de relais et suivi client

**Description :** Préservez le contexte de vente pour que le client démarre avec des attentes réalistes.

###### Leçon 2.2.3.2.1 — Organiser une transmission sans perte d’information

Le passage de relais relie la promesse faite pendant la vente à l’expérience du client. Préparez une réunion avec l’équipe de déploiement ou de succès client avant le lancement. Partagez le contexte, les objectifs, les critères de succès, le périmètre vendu, les interlocuteurs, les contraintes, les risques et les engagements pris. Distinguez ce qui est contractuel de ce qui reste une hypothèse. Invitez le client à cette réunion lorsque cela aide à clarifier les rôles et le calendrier. Ne présentez pas la signature comme la fin de votre responsabilité. Restez disponible pendant les premières étapes, puis convenez du moment où l’équipe de suivi devient le contact principal. Un bon relais évite que le client répète son histoire et réduit le risque de promettre un résultat que le produit ou le service ne peut pas tenir. Il renforce la confiance construite pendant les échanges commerciaux.

**Activité 2.2.3.2.1 — Préparer une fiche de passage de relais**  
**Type :** exercice guidé avec ressource externe. **Durée :** 15 min.  
Lisez le [guide de réussite client de HubSpot](https://blog.hubspot.com/service/customer-success). Créez une fiche de transmission pour le cas des plannings : objectif, critères de succès, périmètre, parties prenantes, risques, échéance et promesses faites. Faites vérifier par un binôme qu’il peut préparer le lancement sans vous poser de question essentielle.

###### Leçon 2.2.3.2.2 — Suivre l’adoption et développer la relation

Après le lancement, le suivi commercial cherche à confirmer que le client obtient la valeur attendue. Planifiez un point de bilan avec les personnes qui utilisent la solution et le sponsor qui porte le résultat. Reprenez les critères définis au départ : le temps de consolidation baisse-t-il, les responsables utilisent-ils la vue partagée, les conflits diminuent-ils ? Écoutez les obstacles d’adoption avant de proposer une extension de contrat. Une formation complémentaire ou un réglage peut être plus utile qu’une nouvelle vente. Si un besoin supplémentaire apparaît, vérifiez son lien avec les objectifs et le calendrier du client. Documentez les résultats et les demandes dans le CRM. Un suivi sincère prépare les renouvellements, les recommandations et les opportunités d’évolution. Il protège aussi l’équipe : elle voit les signaux faibles avant qu’une insatisfaction ne devienne un départ ou une réclamation difficile à résoudre.

**Activité 2.2.3.2.2 — Préparer un bilan à 90 jours**  
**Type :** exercice guidé. **Durée :** 15 min.  
Créez l’ordre du jour d’un bilan à 90 jours : usage, critères de succès, obstacles, actions correctives et prochaine date. Ajoutez trois questions qui évaluent la valeur créée sans proposer une vente additionnelle trop tôt. Demandez à un binôme de classer ces questions entre évaluation de la valeur, résolution d’un problème et recherche d’une opportunité future.

###### Quiz du module 2.2.3 — SAL-M6-Q

1. Une concession de prix doit idéalement s’accompagner de quoi ?  
   - A. D’une contrepartie, comme un engagement de durée  
   - B. D’aucune condition  
   - C. D’une promesse inconnue de l’équipe  
   **Réponse correcte : A.** L’échange protège la valeur et rend les conditions explicites.
2. Que faut-il vérifier avant une signature ?  
   - A. Le signataire, le périmètre et les conditions  
   - B. Seulement la date du rendez-vous  
   - C. Le nombre de slides de la démo  
   **Réponse correcte : A.** Ces éléments évitent de conclure sur une attente imprécise.
3. Quel est le but d’un passage de relais ?  
   - A. Faire répéter toute l’histoire au client  
   - B. Partager le contexte et les engagements avec l’équipe suivante  
   - C. Fermer immédiatement le CRM  
   **Réponse correcte : B.** La transmission permet une mise en œuvre cohérente avec la vente.

###### Quiz final du parcours 2.2 — SAL-P2-QF

1. Pourquoi valider les critères de succès avec le sponsor métier ?  
   - A. Pour guider la décision et la mesure des résultats  
   - B. Pour supprimer les questions de découverte  
   - C. Pour éviter le déploiement  
   **Réponse correcte : A.** Des critères partagés donnent une base claire à la démonstration et au suivi.
2. Quelle réponse aide face à une objection ?  
   - A. Chercher ce que la réserve signifie avant de répondre  
   - B. Contredire immédiatement le client  
   - C. Ignorer la question et poursuivre les slides  
   **Réponse correcte : A.** Vous adaptez votre réponse à la contrainte réelle plutôt qu’à une formulation générale.
3. Quel sujet doit figurer dans une réunion de passage de relais ?  
   - A. Les critères de succès et les engagements pris  
   - B. Les données personnelles inutiles du client  
   - C. Les arguments écartés pendant la vente  
   **Réponse correcte : A.** L’équipe de suivi doit connaître les résultats attendus et le cadre vendu.

---

## Contrôle de couverture

- 2 formations : DEV-FS-101 et SAL-B2B-101.
- 4 parcours : deux par formation.
- 12 modules : trois par parcours.
- 24 cours : deux par module.
- 48 leçons : deux par cours, chacune suivie d’une activité.
- 48 activités : ressources publiques, vidéos intégrables ou mises en situation, sans média local.
- 16 évaluations : 12 quiz de module et 4 quiz finaux de parcours.
- Progression respectée : découverte et vocabulaire, pratique guidée, mise en situation, puis consolidation par quiz et livrable.
