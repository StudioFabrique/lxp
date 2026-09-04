import type { Step } from "react-joyride";

import { CoursesImportStep } from "../../hooks/useImportCourses";

type CourseImportTourState = {
  step: CoursesImportStep;
  hasSelectedFormation: boolean;
  hasSelectedParcours: boolean;
  isComplete: boolean;
  hasCriticalError: boolean;
};

const pageIntroduction: Step = {
  id: "course-import-overview",
  target: '[data-page-tour="header"]',
  title: "Importer un cours Moodle",
  content:
    "Ce parcours vous accompagne de l'archive Moodle jusqu'à la création des cours, leçons et activités dans ANDRIA.",
  placement: "bottom",
};

const uploadSteps: Step[] = [
  pageIntroduction,
  {
    id: "course-import-roadmap",
    target: '[data-course-import-tour="workflow"]',
    title: "Un import en quatre temps",
    content:
      "Déposez une archive .mbz, contrôlez son contenu, choisissez son module de destination puis suivez la création de chaque élément.",
    placement: "right",
  },
  {
    id: "course-import-upload",
    target: '[data-course-import-tour="upload"]',
    title: "Sélectionner l'archive Moodle",
    content:
      "Choisissez un fichier .mbz de 50 Mo maximum. Son analyse peut prendre un moment : attendez la fin du traitement avant de quitter la page.",
    placement: "bottom",
  },
];

const previewSteps: Step[] = [
  pageIntroduction,
  {
    id: "course-import-preview-actions",
    target: '[data-course-import-tour="preview-actions"]',
    title: "Compléter ou confirmer l'import",
    content:
      "Vous pouvez ajouter d'autres archives .mbz. Lorsque la sélection est prête, confirmez pour passer au rattachement des cours.",
    placement: "bottom",
  },
  {
    id: "course-import-course-selection",
    target: '[data-course-import-tour="course-selection"]',
    title: "Choisir les cours à contrôler",
    content:
      "Chaque carte résume un cours et le nombre de leçons retenues. Vous pouvez renommer un cours, afficher ses détails ou le retirer de l'import.",
    placement: "bottom",
  },
  {
    id: "course-import-tree",
    target: '[data-course-import-tour="course-tree"]',
    title: "Vérifier l'arborescence",
    content:
      "Décochez les leçons inutiles, corrigez les titres et inspectez les avertissements. Les éléments retirés ne seront pas créés dans ANDRIA.",
    placement: "right",
  },
  {
    id: "course-import-activity-preview",
    target: '[data-course-import-tour="activity-preview"]',
    title: "Prévisualiser les activités",
    content:
      "Sélectionnez une activité dans l'arborescence pour vérifier son contenu avant l'import définitif.",
    placement: "left",
  },
];

const getAssignmentSteps = ({
  hasSelectedFormation,
  hasSelectedParcours,
}: CourseImportTourState): Step[] => [
  pageIntroduction,
  {
    id: "course-import-assignment",
    target: '[data-course-import-tour="assignment"]',
    title: "Choisir la destination",
    content:
      "Les cours importés doivent être rattachés à un module. La sélection suit la hiérarchie Formation, puis Parcours, puis Module.",
    placement: "right",
  },
  {
    id: "course-import-formation",
    target: '[data-course-import-tour="formation"]',
    title: "1. Sélectionner une formation",
    content:
      "Commencez par choisir la formation qui contient le parcours de destination.",
    placement: "bottom",
  },
  ...(hasSelectedFormation
    ? [
        {
          id: "course-import-parcours",
          target: '[data-course-import-tour="parcours"]',
          title: "2. Sélectionner un parcours",
          content:
            "Choisissez ensuite le parcours qui accueillera les cours. Vous pouvez ouvrir sa configuration dans un nouvel onglet.",
          placement: "bottom" as const,
        },
      ]
    : []),
  ...(hasSelectedParcours
    ? [
        {
          id: "course-import-module",
          target: '[data-course-import-tour="module"]',
          title: "3. Sélectionner un module",
          content:
            "Sélectionnez le module exact dans lequel les cours seront créés. Rechargez la liste si vous venez de créer un module dans l'autre onglet.",
          placement: "bottom" as const,
        },
      ]
    : []),
  {
    id: "course-import-launch",
    target: '[data-course-import-tour="assignment-actions"]',
    title: "Lancer l'importation",
    content:
      "Le bouton devient disponible lorsque les trois niveaux sont sélectionnés. Après le lancement, gardez la page ouverte jusqu'au résultat final.",
    placement: "top",
  },
];

const getResultSteps = ({
  isComplete,
  hasCriticalError,
}: CourseImportTourState): Step[] => [
  pageIntroduction,
  {
    id: "course-import-status",
    target: '[data-course-import-tour="result-status"]',
    title: hasCriticalError
      ? "Importation interrompue"
      : isComplete
        ? "Importation terminée"
        : "Importation en cours",
    content: hasCriticalError
      ? "Le bandeau présente la cause de l'interruption. Les éléments déjà créés sont conservés pour permettre une reprise."
      : isComplete
        ? "Tous les contenus prévus ont été traités. Vous pouvez maintenant rejoindre le module."
        : "Ne fermez pas et ne rechargez pas cette page pendant la création et le transfert des contenus.",
    placement: "bottom",
  },
  {
    id: "course-import-progress",
    target: '[data-course-import-tour="result-progress"]',
    title: "Suivre la progression globale",
    content:
      "La progression et le message courant indiquent précisément l'opération en cours ou le résultat final.",
    placement: "bottom",
  },
  {
    id: "course-import-items",
    target: '[data-course-import-tour="result-items"]',
    title: "Contrôler chaque élément",
    content:
      "Cette liste détaille l'état de chaque cours et activité : en attente, en traitement, réussi ou en erreur.",
    placement: "top",
  },
  ...(isComplete || hasCriticalError
    ? [
        {
          id: "course-import-result-actions",
          target: '[data-course-import-tour="result-actions"]',
          title: hasCriticalError ? "Reprendre l'import" : "Ouvrir le module",
          content: hasCriticalError
            ? "Réessayez pour reprendre les éléments non terminés, ou revenez au module pour examiner ce qui a déjà été créé."
            : "Terminez le workflow pour ouvrir le module contenant les nouveaux cours.",
          placement: "top" as const,
        },
      ]
    : []),
];

export const getCourseImportTourSteps = (
  state: CourseImportTourState,
): Step[] => {
  switch (state.step) {
    case CoursesImportStep.CoursesPreview:
      return previewSteps;
    case CoursesImportStep.ParcoursSelection:
      return getAssignmentSteps(state);
    case CoursesImportStep.ImportResult:
      return getResultSteps(state);
    default:
      return uploadSteps;
  }
};
