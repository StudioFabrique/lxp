import PromptStats from "../../utils/interfaces/db/prompt-stats.ts";
import { toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const CHATBOT_INTERACTIONS_KEY = "chatbot_interactions";

/**
 * Nombre de questions posées au chatbot sur la période.
 *
 * La source est `PromptStats` et non `ChatDialogs` : cette dernière ne
 * conserve que les vingt derniers échanges et est vidée quand l'apprenant
 * réinitialise sa conversation. Les compteurs ne démarrent qu'à partir de la
 * mise en place du suivi, l'historique antérieur est définitivement perdu.
 */
export default async function getChatbotInteractions(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const documents = await PromptStats.find({
    userId: context.userIdMdb,
    date: { $gte: context.from, $lte: context.to },
  })
    .select({ date: 1, chatbotQuestions: 1 })
    .sort({ date: 1 })
    .lean();

  const total = documents.reduce(
    (sum, doc) => sum + (doc.chatbotQuestions ?? 0),
    0,
  );

  return {
    key: CHATBOT_INTERACTIONS_KEY,
    label: "Questions posées au chatbot",
    value: total,
    unit: "count",
    available: true,
    series: documents.map((doc) => ({
      date: toDayKey(new Date(doc.date)),
      value: doc.chatbotQuestions ?? 0,
    })),
  };
}
