import { z } from "zod";
import { validCourseTimes } from "./helpers/course-times";
const date = z.string().refine((value) => value.length > 0 && Number.isFinite(new Date(value).getTime()), "Renseignez une date valide.");
export const courseDatesSchema = z.object({ id: z.number().optional(), minDate: date, maxDate: date,
  synchroneDuration: z.number().nonnegative("La durée doit être positive."), asynchroneDuration: z.number().nonnegative("La durée doit être positive."),
  startTime: z.string().optional(), endTime: z.string().optional(),
}).superRefine((value, ctx) => {
  if (new Date(value.minDate) > new Date(value.maxDate)) ctx.addIssue({ code: "custom", path: ["maxDate"], message: "La date de fin ne doit pas être antérieure au début." });
  if (!validCourseTimes(value.startTime, value.endTime)) ctx.addIssue({ code: "custom", path: ["endTime"], message: "Renseignez les deux heures, avec une fin après le début." });
});
export const courseDatesListSchema = z.object({ dates: z.array(courseDatesSchema).min(1, "Ajoutez au moins une plage de dates.") });
export const createDatesSchema = (minDate: string | Date | undefined, maxDate: string | Date | undefined, maximumDuration: number, usedDuration: number) => courseDatesSchema.superRefine((value, ctx) => {
  if (minDate && new Date(value.minDate) < new Date(minDate) || maxDate && new Date(value.maxDate) > new Date(maxDate))
    ctx.addIssue({ code: "custom", path: ["minDate"], message: "Les dates doivent se situer dans la plage du module." });
  if (value.synchroneDuration + value.asynchroneDuration + usedDuration > maximumDuration)
    ctx.addIssue({ code: "custom", path: ["synchroneDuration"], message: "Le cumul des durées dépasse la durée du module." });
});
