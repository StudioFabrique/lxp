import PromptStats from "../../utils/interfaces/db/prompt-stats.ts";
import { toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const CHATBOT_OUT_OF_SCOPE_KEY = "chatbot_out_of_scope";

/**
 * Nombre de questions refusées par le service IA sur la période, c'est-à-dire
 * hors périmètre pédagogique (haine, contenus adultes, sujets sans rapport).
 *
 * Repose sur le `status.type === "refusal"` déjà renvoyé par le service IA,
 * désormais persisté à la réception de la réponse.
 */
export default async function getChatbotOutOfScope(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const documents = await PromptStats.find({
    userId: context.userIdMdb,
    date: { $gte: context.from, $lte: context.to },
  })
    .select({ date: 1, chatbotQuestions: 1, chatbotOutOfScope: 1 })
    .sort({ date: 1 })
    .lean();

  const total = documents.reduce(
    (sum, doc) => sum + (doc.chatbotOutOfScope ?? 0),
    0,
  );
  const askedTotal = documents.reduce(
    (sum, doc) => sum + (doc.chatbotQuestions ?? 0),
    0,
  );

  return {
    key: CHATBOT_OUT_OF_SCOPE_KEY,
    label: "Questions hors périmètre",
    value: total,
    unit: "count",
    available: true,
    series: documents.map((doc) => ({
      date: toDayKey(new Date(doc.date)),
      value: doc.chatbotOutOfScope ?? 0,
    })),
    meta: {
      shareOfQuestionsPercent:
        askedTotal > 0 ? Math.round((total / askedTotal) * 100) : 0,
    },
  };
}
