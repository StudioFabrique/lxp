import { formatDateToYYYYMMDD } from "../../../../../../src/utils/helpers/convert-date";
import type Module from "../../../../../utils/interfaces/module";

export interface TimelineDates {
  minDate: string;
  maxDate: string;
}

export interface ParcoursDates {
  startDate: Date;
  endDate: Date;
}

export const getInitialTimelineDates = (
  currentModule: Pick<Module, "minDate" | "maxDate">,
  datesParcours: ParcoursDates,
): TimelineDates => {
  // Sans dates propres, un module couvre tout le parcours : un module d'une seule journée par défaut obligerait à le corriger à chaque fois.
  return {
    minDate: formatDateToYYYYMMDD(
      new Date(currentModule.minDate || datesParcours.startDate),
    ),
    maxDate: formatDateToYYYYMMDD(
      new Date(currentModule.maxDate || datesParcours.endDate),
    ),
  };
};

export const validateTimelineDates = (
  datesModule: TimelineDates,
  datesParcours: ParcoursDates,
): string | null => {
  const parcoursStartDate = formatDateToYYYYMMDD(datesParcours.startDate);
  const parcoursEndDate = formatDateToYYYYMMDD(datesParcours.endDate);

  if (datesModule.minDate && datesModule.minDate < parcoursStartDate) {
    return "La date de début du module doit être supérieure ou égale à la date de début du parcours.";
  }

  if (datesModule.maxDate && datesModule.maxDate > parcoursEndDate) {
    return "La date de fin du module doit être inférieure ou égale à la date de fin du parcours.";
  }

  if (
    datesModule.minDate &&
    datesModule.maxDate &&
    datesModule.minDate > datesModule.maxDate
  ) {
    return "La date de début du module ne peut pas être antérieure à sa propre date de fin.";
  }

  return null;
};
