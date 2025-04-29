import { addIdToObject } from "../../utils/add-id-to-objects";

type Step = {
  label: string;
};

/**
 * étapes à suivre pour la création d'un cours
 */
const steps = [
  {
    label: "Informations",
  },
  {
    label: "Objectifs",
  },
  {
    label: "Compétences",
  },
  {
    label: "Contenu",
  },
  {
    label: "Calendrier",
  },
  {
    label: "Aperçu",
  },
];

export const stepsCourse = addIdToObject(steps).map((item: Step) => ({
  ...item,
  saved: false,
  isValid: false,
}));
