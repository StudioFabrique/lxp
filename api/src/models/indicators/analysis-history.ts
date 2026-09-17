import { IndicatorAnalysis, IndicatorAnalysisFeedback } from "../../utils/interfaces/db/indicator-analysis.ts";
import { ANALYSIS_FEATURE_VERSION, type AnalysisFeedbackInput } from "../../config/indicator-analysis.ts";
import type { IndicatorPrediction } from "./predict-outcome.ts";

export async function saveAnalysis(prediction: IndicatorPrediction, authorId: string) {
  const analysis = await IndicatorAnalysis.create({
    userId: prediction.userId, authorId,
    featureVersion: ANALYSIS_FEATURE_VERSION, snapshot: prediction,
  });
  return { ...prediction, analysisId: analysis.id };
}

export async function getAnalysisHistory(userId: string, before?: string) {
  const analyses = await IndicatorAnalysis.find({
    userId, ...(before ? { _id: { $lt: before } } : {}),
  }).sort({ _id: -1 }).limit(21).lean();
  const page = analyses.slice(0, 20);
  const items = await Promise.all(page.map(async (analysis) => ({
    ...analysis.snapshot, analysisId: String(analysis._id),
    feedback: await IndicatorAnalysisFeedback.find({ analysisId: analysis._id })
      .sort({ _id: -1 }).limit(20).lean(),
  })));
  return { items, nextCursor: analyses.length > 20 ? String(page[19]!._id) : null };
}

export async function saveAnalysisFeedback(userId: string, analysisId: string, authorId: string, input: AnalysisFeedbackInput) {
  const analysis = await IndicatorAnalysis.findOne({ _id: analysisId, userId }).lean();
  if (!analysis) throw Object.assign(new Error("Analyse introuvable pour cet apprenant."), { statusCode: 404 });
  const { verdict, comment, actionTaken, observedOutcome, observedAt } = input;
  if (observedAt && new Date(observedAt) < new Date(analysis.snapshot.evaluatedAt)) {
    throw Object.assign(new Error("L'issue observée doit être postérieure à l'analyse."), { statusCode: 400 });
  }
  return IndicatorAnalysisFeedback.create({
    analysisId: analysis._id, authorId,
    verdict, comment, actionTaken, observedOutcome, observedAt,
  });
}
