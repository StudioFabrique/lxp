import { addIdToObject } from "../../utils/add-id-to-objects";

type Step = {
  label: string;
};

/**
 * étapes à suivre pour la création d'un cours
 */
const steps = [
  { id: 1, label: "Informations" },
  { id: 2, label: "Contenu" },
  {
    id: 3,
    label: "Calendrier",
  },
  {
    id: 4,
    label: "Aperçu",
  },
];

export const stepsCourse = addIdToObject(steps).map((item: Step) => ({
  ...item,
  saved: false,
  isValid: false,
}));
