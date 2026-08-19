import { incrementPromptStats } from "./prompt-stats-day.ts";

/**
 * Comptabilise une question posée au chatbot, et le cas échéant son refus.
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
    // Le suivi statistique ne doit jamais faire échouer la réponse du chatbot.
    console.error("Erreur lors du tracking des interactions chatbot :", error);
  }
}
