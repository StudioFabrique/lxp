import { z } from "zod";
import { requiredText, optionalWebUrl } from "../../utils/validation/fields";
import { activityVideoSize, activityImageSize } from "../../config/images-sizes";
import { maxSizeError } from "../../utils/helpers/max-size-error";
import cleanIframeLink from "../../utils/helpers/clean-iframe-link";
export const activityMetadataSchema = z.object({ title: requiredText("Le titre est requis."), description: z.string() });
export function videoFileError(file: File) {
  if (!file.type.startsWith("video/")) return "Merci de choisir un fichier de type vidéo.";
  if (file.size > activityVideoSize) return maxSizeError(activityVideoSize);
}
export const videoSchema = activityMetadataSchema.extend({
  origin: z.enum(["web", "file"]), url: z.string(), file: z.custom<File>((value) => value instanceof File).nullable(),
}).superRefine((values, context) => {
  if (values.origin === "web") {
    if (!values.url || !optionalWebUrl.safeParse(values.url).success) context.addIssue({ code: "custom", path: ["url"], message: "L'URL de la vidéo n'est pas valide." });
  } else if (!values.file) context.addIssue({ code: "custom", path: ["file"], message: "Sélectionnez une vidéo." });
  else {
    const message = videoFileError(values.file);
    if (message) context.addIssue({ code: "custom", path: ["file"], message });
  }
});
export type VideoFormValues = z.infer<typeof videoSchema>;
export const iframeSchema = z.object({ title: requiredText("Le titre est requis."), url: z.string().trim().transform((value, context) => {
  try {
    const cleaned = cleanIframeLink(value);
    if (!cleaned) throw new Error("L'URL n'est pas valide.");
    return cleaned;
  } catch (error) {
    context.addIssue({ code: "custom", message: error instanceof Error ? error.message : "L'URL n'est pas valide." });
    return z.NEVER;
  }
}) });
export type IframeFormValues = z.infer<typeof iframeSchema>;

export const imageSchema = activityMetadataSchema.extend({
  file: z.custom<File>((value) => value instanceof File).nullable(),
  selectedImage: z.string().nullable(),
}).superRefine(({ file, selectedImage }, context) => {
  if (file) {
    if (!file.type.startsWith("image/")) context.addIssue({ code: "custom", path: ["file"], message: "Sélectionnez un fichier image." });
    if (file.size > activityImageSize) context.addIssue({ code: "custom", path: ["file"], message: maxSizeError(activityImageSize) });
  } else if (!selectedImage || (selectedImage.includes("/") || selectedImage.includes("\\"))) context.addIssue({ code: "custom", path: ["selectedImage"], message: "Sélectionnez une image." });
});
export type ImageFormValues = z.infer<typeof imageSchema>;
