import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";

export const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/markdown",
];
export const documentSchema = z.object({
  name: requiredText("Le nom de la ressource est obligatoire."),
  file: z
    .custom<File>((value) => value instanceof File, "Sélectionnez un fichier.")
    .refine(
      (file) => allowedMimeTypes.includes(file.type),
      "Type de document non autorisé.",
    ),
  hasError: z.boolean(),
});
export const documentsSchema = z
  .object({
    files: z.array(documentSchema).min(1, "Ajoutez au moins un document."),
  })
  .superRefine(({ files }, context) => {
    const names = new Set<string>();
    files.forEach(({ file }, index) => {
      if (names.has(file.name))
        context.addIssue({
          code: "custom",
          path: ["files", index, "file"],
          message: "Ce fichier se trouve déjà dans la liste.",
        });
      names.add(file.name);
    });
  });
export type DocumentValues = z.infer<typeof documentSchema>;
