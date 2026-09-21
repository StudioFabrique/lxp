import { IndicatorAnalysis, IndicatorAnalysisFeedback } from "../../utils/interfaces/db/indicator-analysis.ts";
import { ANALYSIS_FEATURE_VERSION, type AnalysisFeedbackInput } from "../../config/indicator-analysis.ts";
import type { IndicatorPrediction } from "./predict-outcome.ts";

const analysisDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export async function hasAnalysisToday(userId: string) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return Boolean(await IndicatorAnalysis.exists({
    userId,
    $or: [
      { dayKey: analysisDayKey() },
      { createdAt: { $gte: start, $lt: end } },
    ],
  }));
}

export async function saveAnalysis(prediction: IndicatorPrediction, authorId: string) {
  try {
    const analysis = await IndicatorAnalysis.create({
      userId: prediction.userId, authorId,
      featureVersion: ANALYSIS_FEATURE_VERSION,
      dayKey: analysisDayKey(),
      snapshot: prediction,
    });
    return { ...prediction, analysisId: analysis.id };
  } catch (error: any) {
    if (error?.code === 11000) {
      throw Object.assign(new Error("Une analyse a déjà été réalisée aujourd'hui pour cet apprenant."), { statusCode: 409 });
    }
    throw error;
  }
}

export async function getAnalysisHistory(userId: string, authorId: string, before?: string) {
  const analyses = await IndicatorAnalysis.find({
    userId, ...(before ? { _id: { $lt: before } } : {}),
  }).sort({ _id: -1 }).limit(21).lean();
  const page = analyses.slice(0, 20);
  const items = await Promise.all(page.map(async (analysis) => ({
    ...analysis.snapshot, analysisId: String(analysis._id),
    hasMyFeedback: Boolean(await IndicatorAnalysisFeedback.exists({ analysisId: analysis._id, authorId })),
    feedback: await IndicatorAnalysisFeedback.find({ analysisId: analysis._id })
      .sort({ _id: -1 }).limit(20).lean(),
  })));
  return { items, nextCursor: analyses.length > 20 ? String(page[19]!._id) : null };
}

export async function saveAnalysisFeedback(userId: string, analysisId: string, authorId: string, input: AnalysisFeedbackInput) {
  const analysis = await IndicatorAnalysis.findOne({ _id: analysisId, userId }).lean();
  if (!analysis) throw Object.assign(new Error("Analyse introuvable pour cet apprenant."), { statusCode: 404 });
  if (await IndicatorAnalysisFeedback.exists({ analysisId: analysis._id, authorId })) {
    throw Object.assign(new Error("Vous avez déjà donné votre avis sur cette analyse."), { statusCode: 409 });
  }
  const { verdict, comment, actionTaken, observedOutcome, observedAt } = input;
  if (observedAt && new Date(observedAt) < new Date(analysis.snapshot.evaluatedAt)) {
    throw Object.assign(new Error("L'issue observée doit être postérieure à l'analyse."), { statusCode: 400 });
  }
  try {
    return await IndicatorAnalysisFeedback.create({
      analysisId: analysis._id,
      authorId,
      submissionKey: `${analysis._id}:${authorId}`,
      verdict, comment, actionTaken, observedOutcome, observedAt,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      throw Object.assign(new Error("Vous avez déjà donné votre avis sur cette analyse."), { statusCode: 409 });
    }
    throw error;
  }
}
