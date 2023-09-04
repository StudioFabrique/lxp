import { addIdToObject } from "../../utils/add-id-to-objects";

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
  /*   {
    label: "Calendrier",
  },
  {
    label: "Etudiants",
  }, */
  {
    label: "",
  },
];

export const stepsParcours = addIdToObject(steps).map((item: any) => ({
  ...item,
  saved: false,
  isValid: false,
}));
