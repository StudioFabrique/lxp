import { z } from "zod";
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
  .refine((value) => { const date = new Date(value); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value; }, "Date invalide.");
export const dateRangeSchema = z.object({ startDate: dateString, endDate: dateString })
  .refine(({ startDate, endDate }) => startDate < endDate, { path: ["endDate"], message: "La date de début doit être inférieure à la date de fin." });
