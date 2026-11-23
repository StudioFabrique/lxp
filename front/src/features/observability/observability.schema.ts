import { z } from "zod";
import { formatDateToYYYYMMDD } from "../../utils/helpers/convert-date";

/** VictoriaLogs garde 30 jours : au-delà, un intervalle ne renverrait rien. */
export const MAX_RANGE_DAYS = 31;

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    return Number.isFinite(date.getTime()) && formatDateToYYYYMMDD(date) === value;
  }, "Date invalide.");

const addDays = (value: string, days: number) => {
  const [year, month, day] = value.split("-").map(Number);
  return formatDateToYYYYMMDD(new Date(year, month - 1, day + days));
};

/** Intervalle choisi au calendrier ; `today` est injectable pour les tests. */
export const customRangeSchema = (today: string = formatDateToYYYYMMDD(new Date())) =>
  z
    .object({ startDate: dayString, endDate: dayString })
    .superRefine(({ startDate, endDate }, context) => {
      if (startDate > endDate) {
        context.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "La date de fin doit être postérieure ou égale à la date de début.",
        });
        return;
      }
      if (endDate > today) {
        context.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "La date de fin ne peut pas être dans le futur.",
        });
      }
      if (startDate < addDays(today, -MAX_RANGE_DAYS)) {
        context.addIssue({
          code: "custom",
          path: ["startDate"],
          message: `Les journaux sont conservés ${MAX_RANGE_DAYS - 1} jours : choisissez une date plus récente.`,
        });
      }
      if (addDays(startDate, MAX_RANGE_DAYS) <= endDate) {
        context.addIssue({
          code: "custom",
          path: ["endDate"],
          message: `L'intervalle ne peut pas dépasser ${MAX_RANGE_DAYS} jours.`,
        });
      }
    });

export type CustomRangeValues = z.infer<ReturnType<typeof customRangeSchema>>;
export { addDays };
