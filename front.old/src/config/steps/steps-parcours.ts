import { addIdToObject } from "../../utils/add-id-to-objects";

// étapes à suivre pour la création d'un parcours
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
    label: "Modules",
  },
  {
    label: "Calendrier",
  },
  {
    label: "Etudiants",
  },
  {
    label: "Aperçu",
  },
];

export const stepsParcours = addIdToObject(steps).map((item: any) => ({
  ...item,
  saved: false,
  isValid: false,
}));
