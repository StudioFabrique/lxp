import { addIdToObject } from "../../utils/helpers/add-id-to-objects";

const steps = [
  { label: "Informations" },
  { label: "Objectifs" },
  { label: "Compétences" },
  { label: "Modules" },
  { label: "Calendrier" },
  { label: "Etudiants" },
  { label: "Aperçu" },
];

export const stepsParcours = addIdToObject(steps).map(
  (item: Record<string, unknown>) => ({
    ...item,
    saved: false,
    isValid: false,
  }),
);
