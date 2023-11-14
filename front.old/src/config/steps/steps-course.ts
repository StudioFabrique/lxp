import { addIdToObject } from "../../utils/add-id-to-objects";

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
    label: "Scénario",
  },
  {
    label: "Calendrier",
  },
  {
    label: "Aperçu",
  },
];

export const stepsCourse = addIdToObject(steps).map((item: any) => ({
  ...item,
  saved: false,
  isValid: false,
}));
