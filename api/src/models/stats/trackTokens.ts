import User from "../../utils/interfaces/db/user.ts";
import { incrementPromptStats } from "./prompt-stats-day.ts";

/**
 * Incrémente les tokens utilisés pour un utilisateur donné (Chatbot ou Quiz)
 */
export async function trackTokens(
  userId: string | undefined,
  tokensUsed: number,
) {
  if (!userId || userId === "anonymous_student") return;

  try {
    await incrementPromptStats(userId, { tokensUsed });

    // Incrémentation du compteur global de prompts de l'utilisateur
    await User.findByIdAndUpdate(userId, { $inc: { promptCount: 1 } });
  } catch (error) {
    console.error("Erreur lors du tracking des tokens :", error);
  }
}
