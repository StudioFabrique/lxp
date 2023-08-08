import { addIdToObject } from "../../utils/add-id-to-objects";

const steps = [
  {
    label: "Informations",
  },
  {
    label: "Compétences",
  },
  {
    label: "Objectifs",
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
    label: "",
  },
];

export const stepsParcours = addIdToObject(steps).map((item: any) => ({
  ...item,
  saved: false,
  isValid: false,
}));
