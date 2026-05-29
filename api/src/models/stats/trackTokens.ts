import PromptStats from "../../utils/interfaces/db/prompt-stats";
import User from "../../utils/interfaces/db/user";

/**
 * Incrémente les tokens utilisés pour un utilisateur donné (Chatbot ou Quiz)
 */
export async function trackTokens(
  userId: string | undefined,
  tokensUsed: number,
) {
  if (!userId || userId === "anonymous_student") return;

  const today = new Date().toISOString().slice(0, 10);

  try {
    // Mise à jour ou création des PromptStats de la journée
    const promptStats = await PromptStats.findOne({ userId, date: today });

    if (promptStats) {
      promptStats.tokensUsed += tokensUsed;
      await promptStats.save();
    } else {
      const user = await User.findById(userId).select("group");
      const newPromptStats = new PromptStats({
        userId,
        date: today,
        tokensUsed,
        groupId: user?.group?._id?.toString() || null,
      });
      const savedPromptStats = await newPromptStats.save();

      if (savedPromptStats) {
        await User.findByIdAndUpdate(userId, {
          $push: { promptStats: savedPromptStats._id },
        });
      }
    }

    // Incrémentation du compteur global de prompts de l'utilisateur
    const userDoc = await User.findById(userId).select("promptCount");
    if (userDoc) {
      userDoc.promptCount = (userDoc.promptCount || 0) + 1;
      await userDoc.save();
    }
  } catch (error) {
    console.error("Erreur lors du tracking des tokens :", error);
  }
}
