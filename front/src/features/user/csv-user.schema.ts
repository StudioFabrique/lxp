import { z } from "zod";
import { informationSchema } from "../profile/schemas/info-schema";

const csvBirthDate = z
  .union([z.string(), z.date()])
  .optional()
  .transform((value, context) => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    const date = match
      ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
      : new Date(NaN);
    if (
      !match ||
      date.getDate() !== Number(match[1]) ||
      date.getMonth() !== Number(match[2]) - 1 ||
      date.getFullYear() !== Number(match[3])
    ) {
      context.addIssue({
        code: "custom",
        message: "Date de naissance invalide (JJ/MM/AAAA).",
      });
      return z.NEVER;
    }
    return date;
  })
  .refine(
    (value) =>
      !value || (Number.isFinite(value.getTime()) && value <= new Date()),
    "La date de naissance doit être valide et passée.",
  );

export const csvUserSchema = informationSchema.extend({
  birthDate: csvBirthDate,
});
export type CsvUserRow = z.input<typeof csvUserSchema>;
export const csvUsersSchema = z.object({
  users: z.array(csvUserSchema).min(1, "Sélectionnez au moins un étudiant."),
});
