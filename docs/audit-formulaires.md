# Audit des formulaires — 30 septembre 2026

## Conclusion

Les formulaires ne suivent pas encore un standard commun React Hook Form + Zod. Les composants réutilisables et les hooks métier constituent une bonne base, mais la validation, la soumission, les erreurs et la synchronisation des valeurs restent hétérogènes.

Le principal enjeu est de corriger les validations incomplètes et la sauvegarde automatique, puis de migrer progressivement les formulaires métier vers une structure commune. La seule présence de `zodResolver` ne garantit pas que tous les champs ou toutes les règles métier soient couverts.

## Périmètre et méthode

- Recherche dans tout `front/src`, hors tests, des balises `form`, `input`, `textarea`, `select`, des hooks `useForm`, `useInput`, des resolvers, schémas et handlers de soumission.
- Vérification des hooks et parents associés : un composant de champs sans `useForm` peut être correctement raccordé au formulaire parent.
- Inclusion des saisies sans balise `form` : utilisateur, devoirs, notation, feedback, onboarding, contenu riche et sélections à enregistrer.
- Distinction entre formulaires métier, sous-composants de champs et contrôles d’interface : fermeture de dialogue, recherche, pagination, filtres et préférences visuelles.
- Audit du code actuellement présent dans le workspace, qui comporte déjà des modifications sur les quiz et l’onboarding. Ces modifications n’ont pas été changées par cet audit.
- Analyse statique et vérifications ciblées. Aucun parcours complet dans un navigateur et aucun audit exhaustif des validations serveur. Les écarts signalés concernent donc le frontend ; ils ne prouvent pas que le serveur accepte les mêmes données.

**Comptages reproductibles dans les sources :**

| Mesure | Résultat |
| --- | ---: |
| Fichiers contenant une balise littérale `<form>` | 47 |
| Balises littérales `<form>` | 50 |
| Parmi elles, formulaires `method="dialog"` | 5 |
| Formulaire supplémentaire rendu avec `PageWrapper as="form"` | 1, groupes |
| Initialisations `useForm` | 17 |
| Initialisations avec `zodResolver` | 13 |
| Initialisations RHF sans resolver Zod | 4 |
| Autres hooks de formulaire avec Zod `safeParse` | 2, formation et récupération de compte |

Ces nombres décrivent des occurrences dans le code, pas un nombre de parcours utilisateur distincts ni un pourcentage de conformité. Un hook peut servir à plusieurs écrans ; des saisies métier n’ont aucune balise `form`.

## Constats prioritaires

### P1 — Champs utilisateur invalides transmis lors de la soumission

Source : `front/src/features/user/components/user-form/useUserForm.ts:62` et `UserForm.tsx:113`.

`formIsValid` vérifie seulement l’email, le prénom et le nom. `nicknameError`, `addressError`, `cityError`, `postCodeError` et `phoneError` sont calculés et affichés, mais ne bloquent pas `buildUserData()` ni la soumission. Le rôle est vérifié séparément dans le composant.

Exemple : avec un email, un prénom et un nom valides, un code postal `abc` ou un téléphone `abc` déclenche une erreur de champ tout en permettant l’appel de `onSubmitForm`.

Les prénom et nom sont également contrôlés avant `trim()` : des espaces peuvent passer les règles actuelles puis être envoyés sous forme de chaîne vide.

**Correction proposée :** un schéma utilisateur validant le payload complet, types dérivés de Zod, RHF pour les champs et `useFieldArray` pour les collections qui doivent être éditées dans le formulaire. Définir explicitement les formats métier du téléphone et du code postal avant d’unifier leurs règles.

### P1 — Sauvegarde automatique incomplète

Sources : `front/src/features/course/components/edit/informations/course-infos-form.tsx:72`, `front/src/features/parcours/components/edit/informations/parcours-informations-form.tsx:67` et `front/src/hooks/useAutoSave.ts`.

1. **Cours :** la visibilité est stockée dans un `useState`, mais le hook de sauvegarde ne surveille que les changements RHF via `watch`. Changer uniquement la visibilité ne marque pas la sauvegarde comme nécessaire. Elle pourra être transmise lors d’un changement ultérieur d’un champ RHF.
2. **Parcours :** `onSave` ignore son premier appel avec `isInitialRender`. Le hook ne sauvegarde qu’après une notification de changement de `watch` ; cette protection peut donc ignorer le premier véritable changement utilisateur. Sans second changement, cette modification reste non sauvegardée.
3. **Initialisation :** les deux formulaires calculent des `defaultValues` à partir des données, sans `reset` ni `values` pour les synchroniser ensuite. Le risque dépend de leur montage et de l’état du cache : si les données arrivent après l’initialisation du formulaire, recalculer l’objet `defaultValues` ne recharge pas les champs existants.
4. **Échec :** `useAutoSave` remet son indicateur à `false` avant l’appel de sauvegarde et ne reçoit aucune promesse ou information de réussite. Un échec ne laisse pas de modification en attente de nouvelle tentative ; aucune sérialisation des requêtes n’est gérée dans ce hook.

**Correction proposée :** intégrer la visibilité dans RHF, synchroniser les valeurs au chargement sans écraser une saisie en cours, supprimer le saut aveugle du premier appel et faire accepter une sauvegarde asynchrone au hook. Couvrir un changement unique, un changement de visibilité seul, un chargement tardif et un échec réseau.

### P1 — Validation de taille vidéo signalée mais non bloquante

Sources : `front/src/features/lesson/components/edit/activities/video-editor.tsx:80` et `front/src/features/resources/components/add/VideoActivityResource.tsx:47`.

Quand le fichier dépasse `maxSize`, les handlers affichent un toast puis continuent avec `setFile(selectedFile)`. Le fichier refusé reste sélectionné et peut être transmis à la soumission. La taille n’est pas revérifiée par le schéma.

**Correction proposée :** refuser la sélection avec un retour immédiat et vérifier aussi la source active à la soumission. Centraliser le validateur MIME/taille partagé par les deux éditeurs.

### P2 — Titres obligatoires acceptant uniquement des espaces

Sources : `formation.schema.ts`, `course.schema.ts`, `lesson.schema.ts`, `parcours.schema.ts`, schémas d’image, d’iframe et de création rapide d’utilisateur.

Plusieurs champs utilisent `min(1)` ou `regexGeneric` sans `trim().min(1)`. `regexGeneric` autorise les espaces. Des valeurs visuellement vides passent donc ces règles.

**Vérification directe :** les schémas réels `formationSchema`, `infosCourseSchema` et `activiteMetaDataSchema` acceptent tous `title: "   "`. Le niveau de formation accepte également une chaîne d’espaces ; le schéma ne limite pas le niveau aux huit options de l’interface.

Dans `useFormationForm`, `safeParse` sert uniquement de garde : les mutations utilisent les states originaux, pas `parsed.data`. Ajouter une transformation au schéma sans changer ce flux ne normalisera pas le payload envoyé.

**Correction proposée :** normaliser les textes obligatoires dans les schémas, typer les niveaux autorisés et construire les payloads depuis les valeurs validées.

### P2 — Règles de devoir et de notation dispersées

Sources : `front/src/features/module-preview/components/sidebar/assignment-form.helpers.ts`, `create-course-details-modal.tsx:103`, `edit-course-modal.tsx:73`, `front/src/features/module-preview/components/assignment/course-assignment.tsx:461`.

`assignmentFormIsValid` mutualise déjà plusieurs règles, ce qui est utile. Cependant, les handlers de création et modification de cours ne l’appellent pas : ils vérifient seulement le titre et les tags. Les règles du devoir sont utilisées pour désactiver le bouton de sauvegarde, sans garde équivalente dans le handler.

Le helper vérifie la présence de `dueAt`, sans vérifier que la date est valide. `maxScore <= 0` et `weight <= 0` ne rejettent pas explicitement les nombres non finis ; le cas sans critères peut accepter `NaN` si cette valeur atteint le helper.

La notation transmet les scores depuis un bouton `type="button"`, sans validation JavaScript des bornes avant l’appel API. Les attributs HTML `min` et `max` ne constituent pas une garde de soumission dans ce flux. Une note négative ou supérieure au maximum peut donc atteindre l’appel frontend.

**Correction proposée :** schémas distincts pour configuration du devoir, brouillon, remise finale et notation ; validation au point de soumission, bornes numériques et cohérence du total des critères.

### P2 — RHF + Zod présents mais couverture partielle

- **Profil :** les liens et passions sont gérés hors RHF, validés lors de leur ajout par `ProfileItemsEditor`, puis ajoutés au payload hors `informationSchema`.
- **Mot de passe du profil :** la confirmation est vérifiée manuellement dans `account.tsx`, en dehors de `passwordSchema`. Le mot de passe actuel est soumis à la règle de complexité du nouveau mot de passe ; préférer une règle de présence pour l’ancien, sauf exigence métier explicite.
- **Iframe :** Zod ne valide que le titre. L’URL, son nettoyage et son erreur sont gérés à part. `useResourceIFrame` appelle `setUrlError` dans `useMemo`, mêlant calcul et mise à jour d’état pendant le rendu.
- **Vidéo de ressource :** le champ affiché « URL de la vidéo * » est une chaîne optionnelle dans Zod. La soumission ne garantit pas une URL valide ou un fichier sélectionné.
- **Image :** le schéma couvre titre et description ; la présence d’une image est vérifiée séparément. Cette séparation est possible, mais la source doit être validée de manière cohérente dans le flux de soumission.
- **Modules :** `trigger()` valide le formulaire puis `getValues()` construit le payload brut. Les transformations/defaults du schéma ne sont pas consommés comme sortie validée, notamment le `trim()` de `quizInstructions`.
- **Contact :** les schémas du profil et de création rapide utilisent une regex de texte générique pour téléphone/code postal, tandis que le formulaire utilisateur utilise une regex numérique. Les mêmes champs ont donc des règles différentes selon l’écran.

**Correction proposée :** réunir dans chaque schéma les valeurs qui appartiennent au payload et les règles entre champs. Les états de prévisualisation et d’ouverture des modales peuvent rester hors RHF.

### P2 — Soumission HTML et bouton désalignés

`VideoForm.tsx` déclare un bouton `type="submit"` avec `onClick={props.onSubmit}`, mais son `<form>` n’a aucun `onSubmit`. `FormationForm.tsx` sauvegarde avec un bouton extérieur `type="button"`, sans handler sur le formulaire de champs. Les formulaires de métadonnées à sauvegarde automatique n’ont pas non plus de handler de soumission HTML.

Ces structures n’unifient pas le clic, la validation par Entrée et la soumission du formulaire. La conséquence exacte dépend du DOM et des contrôles présents ; elle reste à vérifier dans le navigateur.

**Correction proposée :** un `<form onSubmit={handleSubmit(onSubmit)}>` par flux de saisie, boutons `submit` raccordés à ce formulaire, boutons auxiliaires `button`. Pour une sauvegarde automatique, prévoir un handler explicite pour la soumission clavier.

## Inventaire des formulaires métier

« Partiel » signifie que Zod ne couvre qu’une partie des champs/règles. L’utilisation de RHF dans le parent ou le hook compte comme utilisation effective.

| Flux / composant | RHF | Zod | Structure et observations |
| --- | --- | --- | --- |
| Connexion — `auth/views/Login.tsx` | Non | Non | `useInput`, regex, validation et styles locaux. |
| Activation du compte — `auth/views/Register.tsx` | Oui | Non | Règles `register` déléguées à `PasswordForm`. |
| Mise à jour / récupération du mot de passe — `PasswordUpdateHome.tsx` | Oui | Non | Même bloc de mots de passe ; gestion requête/erreur très proche de Register. |
| Création root — `AdminSignInForm.tsx` | Oui | Non | Règles requises/email dans les champs ; `PasswordForm` pour les mots de passe. |
| Clé d’activation — `TokenForm.tsx` | Oui | Non | Validation `required`, trim à la soumission. |
| Récupération / renvoi activation — `useResetPassword.ts` | Non | Oui | `safeParse` email, états et erreurs manuels. |
| Configuration initiale — `InstanceSetup.tsx` | Non | Non | Nom/site/logo, validations manuelles ; règles proches des paramètres instance. |
| Utilisateur complet — `UserForm` / `useUserForm` | Non | Non | Sections visuelles séparées ; beaucoup de props et de states, validation incomplète. |
| Certifications utilisateur — `UserFormCertifications.tsx` | Non | Non | Sous-flux local d’ajout/modification à intégrer au schéma utilisateur. |
| Création rapide utilisateur — `user-quick-create.tsx` | Oui | Oui | Composants communs ; types `any`, schéma distinct des autres saisies utilisateur. |
| Groupe — `GroupForm` / `useGroupForm` | Oui | Oui | `FormProvider`, contexte typé, `reset`, sections séparées : bonne base de structure. |
| Groupe pendant onboarding — `TeacherGroupFields` / `DropoutPreferencesForm` | Non | Non | Autre circuit de création de groupe, sans réutiliser le schéma groupe. |
| Rôle — `RoleForm.tsx` | Non | Non | Création/modification/duplication réunies ; règles regex et mutations dans le composant. |
| Formation — `FormationForm` / `useFormationForm` | Non | Oui | `safeParse`, states manuels, toast première erreur, tags hors schéma. |
| Nouveau parcours — `new-parcours-form.tsx` | Non | Non | `useInput` + sélection formation + validation manuelle. |
| Import / duplication parcours — `ParcoursCreationModal` / `ParcoursImportModal` | Non | Non | Sélections/fichier/options contrôlés localement ; schéma léger possible pour le payload. |
| Informations parcours — `parcours-informations-form.tsx` | Oui | Oui | Champs communs, autosave à corriger. |
| Module création/modification/duplication — `ModuleForm` / `useNewModule` | Oui | Oui | Champs séparés ; hook de 566 lignes et trois branches de soumission proches. |
| Objectif — `form-objective.tsx` | Non | Non | `useInput`, validation, reset et fermeture locaux. |
| Compétence — `skill-form.tsx` | Non | Non | Même structure que l’objectif, avec sélection badge. |
| Informations cours — `course-infos-form.tsx` | Oui | Partiel | Visibilité hors RHF ; autosave à corriger. |
| Dates cours — `dates-form.tsx` | Non | Non | Regex générique, contraintes dates/durée/heures dispersées. |
| Leçon dans scénario — `lesson-form.tsx` | Non | Non | `useInput` transmis par parent ; props `unknown`, cast `any`, styles locaux. |
| Titre initial cours — `create-course-item.tsx` | Non | Non | Étape locale ouvrant le formulaire de détails. |
| Création cours — `create-course-details-modal.tsx` | Non | Non | 470 lignes, tags/contenus/leçons/devoir dans le même composant. |
| Modification cours — `edit-course-modal.tsx` | Non | Non | Réutilise `AssignmentFields`, mais states et payloads locaux. |
| Création leçon — `create-lesson-modal.tsx` | Non | Non | Titre/description/modalité/tag contrôlés localement. |
| Modification leçon — `edit-lesson-modal.tsx` | Non | Non | Champs très proches de la création, autre implémentation. |
| Dates module/cours — `DatesEditor` dans `module-course-calendar.tsx` | Non | Non | Liste de dates en state, helper commun pour les heures. |
| Configuration devoir — `assignment-fields.tsx` | Non | Non | Sous-composant partagé création/modification ; schéma absent. |
| Remise / brouillon devoir — `course-assignment.tsx` | Non | Non | Texte riche/fichiers en state, garde manuelle avant remise. |
| Notation devoir — `course-assignment.tsx` | Non | Non | Scores/commentaire en state ; bornes non validées au handler. |
| Métadonnées ressource — `ResourceForm` / `useResource` | Oui | Partiel | Titre/description validés ; tags et image hors schéma. |
| Iframe ressource — `ResourceIFrameForm` / `useResourceIFrame` | Oui | Partiel | Titre Zod, URL et erreur séparées. |
| Vidéo ressource — `VideoForm` / `VideoActivityResource` | Oui | Partiel | URL optionnelle non validée, fichier hors schéma, soumission HTML à revoir. |
| Vidéo leçon — `video-editor.tsx` | Oui | Partiel | Métadonnées Zod ; origine/URL/fichier séparés. |
| Image leçon/ressource — `image-activity-editor` / `use-edit-image-activity` | Oui | Partiel | Métadonnées Zod, image en state et règle de présence manuelle. |
| Téléversement documents — `resources/resource-form` / `useUploadResources` | Non | Non | Nom/fichiers/liste, regex et contrôles manuels. |
| Renommer document — `resources/preview/resource-update.tsx` | Oui | Oui | Petit schéma typé, `reset` ; absence de formulaire pour la soumission clavier. |
| Activité texte — `useTextActivity`, `tip-tap-activity` | Non | Non | Éditeur spécialisé, titre/contenu et sauvegarde gérés séparément. |
| Ajout tags — `TagsHomeAdding` / `create-new-tags` / `useTags` / `AddTag` | Non | Non | Helpers de découpage et dédoublonnage déjà réutilisés, notamment dans les parcours. |
| Modification tag — `TagsHomeEditing.tsx` | Non | Non | Transmet le nom sans garde ; `tagError` jamais positionné à vrai. |
| Import CSV compétences/objectifs — `imported-csv-data.component.tsx` | Non | Non | Sélection minimale vérifiée ; données `any`, aucune validation ligne dans ce composant. |
| Import CSV utilisateurs — `csv-user-list-confirmation.component.tsx` | Non | Non | Sélection et envoi via parent ; validation import à traiter dans le flux CSV. |
| Informations profil — `information-and-settings.tsx` | Oui | Partiel | Champs principaux Zod ; liens/passions ajoutés hors schéma. |
| Liens/passions profil — `ProfileItemsEditor.tsx` | Non | Non | Sous-flux partagé avec onboarding, validateurs et doublons locaux. |
| Mot de passe profil — `account.tsx` | Oui | Partiel | Confirmation vérifiée hors schéma ; règle de complexité ancien mot de passe. |
| Promotion root — `promote-to-root.tsx` | Non | Non | Token en state, contrôle de présence ; logique commande/copie dupliquée avec TokenForm. |
| Paramètres instance — `instance-general-settings.tsx` | Non | Non | Identité/interface/email ; 562 lignes, validations et payload par scope. |
| Préférences décrochage — `DropoutPreferencesForm.tsx` | Non | Non | States, options bornées dans l’UI, création groupe conditionnelle. |
| Retour analyse IA — `AnalysisFeedbackForm.tsx` | Non | Non | `required`/`maxLength` HTML et garde manuelle du verdict. |
| Ressenti apprenant — `feeling-feedback.tsx` | Non | Non | Range/commentaire puis socket ; pas de schéma payload frontend. |
| Onboarding apprenant — `StudentLearningOnboarding.tsx` | Non | Non | Choix rythme/préférences/niveaux en state ; étape profil réutilise `ProfileItemsEditor`, sans RHF. |
| Signalement quiz — `quiz-modal-buttons.tsx` | Non | Non | Commentaire en state, garde `trim()` avant requête. |

## Exceptions et contrôles d’interface

Les éléments suivants sont aussi des saisies, mais une migration automatique vers RHF apporterait peu de valeur. Une exception explicite au standard des formulaires métier est appropriée :

- Les cinq formulaires `method="dialog"` : deux dans `event-details-modal.tsx`, deux dans `module-timeline-date-modal.tsx`, un dans `activity-delete-modal.tsx`. Ils ferment un dialogue.
- `search-bar.tsx`, `search.component.tsx`, recherches déroulantes/modales, filtres de listes et pagination : contrôler le terme ou l’option suffit en général.
- `text-input-chatbot.tsx` : saisie de message avec état conversationnel ; un validateur de payload peut être utile sans formulaire RHF complet.
- `LinkEditorPanel.tsx` et `UrlSizePanel.tsx` : petits panneaux Tiptap partageant déjà `useUrlEditorState`. Harmoniser la validation d’URL selon le type de lien ; la regex actuelle n’impose pas HTTP(S).
- Réponses aux quiz : QCM, vrai/faux, ordre et associations ont des états et validations propres au moteur de quiz. Elles ne sont pas des formulaires métier classiques ; le signalement textuel est recensé séparément.
- Upload, choix de couleur/thème/date, checkbox de sélection de table ou de drawer : composants de champ/contrôle, à raccorder au formulaire appelant lorsque la valeur appartient à son payload.

## Simplicité, répétition et réutilisation

**Bases utiles déjà présentes :**

- `components/form` fournit des champs génériques typés pour texte, nombre, mot de passe et textarea.
- Les groupes utilisent `FormProvider` / `useFormContext` pour éviter de transmettre chaque champ entre sections.
- `ModuleFields`, `AssignmentFields`, `CourseTimeFields`, `PasswordForm`, `ProfileItemsEditor` et les helpers de tags mutualisent déjà des comportements réels.
- Les API sont généralement centralisées et plusieurs hooks séparent les requêtes de l’affichage.

**Points à simplifier :**

1. **Deux moteurs de formulaire :** `useInput.tsx` réimplémente valeur, touched, erreur, reset et soumission, avec du `any`. Migrer ses usages métier puis décider s’il reste nécessaire pour d’autres contrôles.
2. **Duplication création/modification :** `useFormationForm` répète la résolution/création des tags et la construction du payload dans deux mutations. Extraire une fonction métier dédiée recevant des valeurs validées. Pour les modules, mutualiser payload et traitement de réussite, puis isoler création, modification et duplication.
3. **Composants volumineux :** répartir `create-course-details-modal`, `instance-general-settings` et `course-assignment` par responsabilité réelle : champs, validation, soumission, sélection de contenu, remise et notation. Le nombre de lignes seul n’est pas un défaut ; ici les responsabilités sont effectivement mélangées.
4. **Même domaine, règles divergentes :** schémas vidéo dans `lesson.schema.ts` et `config/validation/lesson/activite-video.ts`, règles utilisateurs dans trois circuits, règles site internet dans setup et paramètres. Placer les schémas dans les features et composer les variantes métier à partir de primitives communes.
5. **Règles dans l’affichage :** `PasswordForm` mélange jauge de force, rendu et règles de validation RHF. Garder une jauge réutilisable, déplacer la validation dans le schéma auth, partager la politique du mot de passe avec le profil.
6. **Types affaiblis :** `ResourceForm`, `VideoForm`, création rapide utilisateur, plusieurs props de profil et `useAutoSave` utilisent `any`. `LessonForm` transforme ses props `unknown` en `any`. Déduire les types des schémas et typer les champs/handlers.
7. **Enveloppes de champ répétées :** label, classes et erreur sont similaires dans les quatre composants `components/form`. Un petit `FormField` peut mutualiser ce cadre ; conserver des composants spécialisés simples et composables.
8. **Accessibilité commune incomplète :** seuls certains champs, notamment `FormNumberInput`, exposent `aria-invalid`, une erreur identifiée et `aria-describedby`. Les IDs basés uniquement sur `name` risquent des collisions si plusieurs formulaires sont montés. Le bouton de visibilité de `FormPasswordInput` n’a pas de nom accessible et a `tabIndex={-1}`. Harmoniser ces éléments dans les composants partagés.
9. **États annexes :** conserver hors RHF les ouvertures de modal, étapes et prévisualisations. Intégrer les champs du payload dans RHF ; pour une valeur sélectionnée via un composant contrôlé, utiliser `Controller` ou `setValue` avec une politique explicite de dirty/validation.

## Ordre de correction recommandé

1. Corriger les champs utilisateur ignorés, la sélection vidéo trop volumineuse et les deux défauts de sauvegarde automatique.
2. Normaliser les champs obligatoires, utiliser la sortie validée des schémas et sécuriser les règles numériques de devoir/notation au point de soumission.
3. Compléter les composants communs et établir une convention : schéma feature, types Zod, hook RHF, champs partagés, `handleSubmit`, état de soumission et erreurs cohérents.
4. Migrer utilisateur, rôle, formation, auth et paramètres instance ; commencer par des flux entiers pour éviter une nouvelle coexistence de validations dans le même formulaire.
5. Unifier création/modification cours et leçon, puis dates, objectifs, compétences, feedback et imports. Réutiliser les champs sans imposer un composant universel configuré par des dizaines de props.
6. Ajouter des tests sur les règles et les défauts identifiés : espaces, champs optionnels invalides, confirmation, source média, dates/durées, notes hors bornes, échec d’autosave et soumission clavier. Conserver les exceptions UI documentées.

## Vérifications exécutées

Commande depuis `front` :

```sh
./node_modules/.bin/vitest run \
  src/features/group/group.schema.test.ts \
  src/features/parcours/parcours.schema.test.ts \
  src/features/parcours/components/edit/modules/ModuleForm.test.tsx \
  src/features/user/components/user-form/useUserForm.test.tsx \
  src/features/formation/components/FormationForm.test.tsx \
  src/features/resources/hooks/useResource.test.tsx \
  src/features/auth/views/Register.test.tsx \
  src/features/dashboard-ia/components/DropoutPreferencesForm.test.tsx
```

Résultat : **8 fichiers, 31 tests réussis**. Cette sélection couvre plusieurs schémas et formulaires existants ; elle ne couvre pas l’ensemble des comportements recensés et ne réfute pas les défauts constatés dans le code.

Un diagnostic Node a également chargé les schémas Zod de formation, cours et activité depuis leurs sources et vérifié `safeParse` avec un titre composé d’espaces : accepté dans les trois cas.

Aucun code applicatif ni test n’a été modifié. Le seul livrable ajouté est ce rapport.
