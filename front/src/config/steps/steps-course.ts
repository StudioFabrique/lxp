import { addIdToObject } from "../../utils/helpers/add-id-to-objects";

const steps = [
  { id: 1, label: "Informations" },
  { id: 2, label: "Contenu" },
  { id: 3, label: "Calendrier" },
  { id: 4, label: "Aperçu" },
];

export const stepsCourse = addIdToObject(steps).map((item) => ({
  ...item,
  saved: false,
  isValid: false,
}));
