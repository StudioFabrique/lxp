import { z } from "zod";
import { webUrl } from "../../../../utils/validation/fields";

export const imageSizeSchema = z.enum(["small", "medium", "large"]);
export const imageInsertSchema = z.object({ url: webUrl, size: imageSizeSchema });
// Le fichier remplace l'URL pour une insertion depuis l'ordinateur.
export const imageUploadOptionsSchema = imageInsertSchema.extend({ url: z.string() });
export type ImageInsertValues = z.infer<typeof imageInsertSchema>;
