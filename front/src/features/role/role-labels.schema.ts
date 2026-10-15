import { z } from "zod";
import {
  ROLE_LABEL_FIELDS,
  ROLE_LABEL_MAX_LENGTH,
  ROLE_LABEL_MIN_LENGTH,
  type RoleLabelFieldName,
} from "./helpers/role-labels";

// Aligné sur la validation serveur : bornes, pas de chevrons ni de caractères de contrôle.
const roleLabelField = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(
        ROLE_LABEL_MIN_LENGTH,
        `Saisissez au moins ${ROLE_LABEL_MIN_LENGTH} caractères.`,
      )
      .max(
        ROLE_LABEL_MAX_LENGTH,
        `Utilisez ${ROLE_LABEL_MAX_LENGTH} caractères au maximum.`,
      )
      // eslint-disable-next-line no-control-regex
      .refine((value) => !/[\u0000-\u001f\u007f<>]/.test(value), {
        message: "Les chevrons < et > ne sont pas autorisés.",
      }),
  );

export const roleLabelsSchema = z
  .object({
    admin: roleLabelField,
    team: roleLabelField,
    student: roleLabelField,
    visitor: roleLabelField,
  })
  .superRefine((values, context) => {
    const names = Object.keys(ROLE_LABEL_FIELDS) as RoleLabelFieldName[];
    // Deux rôles sous le même nom seraient indiscernables dans les listes.
    names.forEach((name) => {
      const label = values[name].toLocaleLowerCase("fr");
      const isDuplicate = names.some(
        (other) => other !== name && values[other].toLocaleLowerCase("fr") === label,
      );
      if (label && isDuplicate) {
        context.addIssue({
          code: "custom",
          path: [name],
          message: "Chaque rôle doit porter un libellé différent.",
        });
      }
    });
  });
