import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";

/** Question libre posée à l'assistant virtuel : le serveur n'impose pas d'autre limite que sa présence. */
export const chatbotPromptSchema = z.object({
  prompt: requiredText("Saisissez votre question."),
});

export type ChatbotPromptValues = z.infer<typeof chatbotPromptSchema>;
