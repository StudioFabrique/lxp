import { incrementPromptStats } from "./prompt-stats-day.ts";
import { logger } from "../../utils/logs/logger.ts";

/**
 * Comptabilise une question posée à l’assistant virtuel, et le cas échéant son refus.
 *
 * Les compteurs vivent dans `PromptStats` et non dans `ChatDialogs` : cette
 * dernière est une fenêtre glissante de vingt échanges, effacée dès que
 * l'apprenant réinitialise sa conversation, donc inutilisable pour compter.
 */
export default async function trackChatbotUsage(
  userId: string | undefined,
  isOutOfScope: boolean,
) {
  if (!userId || userId === "anonymous_student") return;

  try {
    await incrementPromptStats(userId, {
      chatbotQuestions: 1,
      chatbotOutOfScope: isOutOfScope ? 1 : 0,
    });
  } catch (error) {
    // Le suivi statistique ne doit jamais faire échouer la réponse de l’assistant virtuel.
    logger.error(
      "Erreur lors du tracking des interactions avec le chatbot :",
      error,
    );
  }
}
