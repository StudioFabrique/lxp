import mongoose, { Schema } from "mongoose";
import type { IndicatorPrediction } from "../../../models/indicators/predict-outcome.ts";
import { FEEDBACK_VERDICTS, OBSERVED_OUTCOMES } from "../../../config/indicator-analysis.ts";

const analysisSchema = new Schema({
  userId: { type: String, required: true, immutable: true },
  authorId: { type: String, required: true, immutable: true },
  featureVersion: { type: String, required: true, immutable: true },
  snapshot: { type: Schema.Types.Mixed, required: true, immutable: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
analysisSchema.index({ userId: 1, _id: -1 });

export type AnalysisDocument = {
  userId: string;
  authorId: string;
  featureVersion: string;
  snapshot: IndicatorPrediction;
  createdAt: Date;
};
export const IndicatorAnalysis = mongoose.model<AnalysisDocument>("IndicatorAnalysis", analysisSchema);

const feedbackSchema = new Schema({
  analysisId: { type: Schema.Types.ObjectId, required: true, ref: "IndicatorAnalysis", immutable: true },
  authorId: { type: String, required: true, immutable: true },
  verdict: { type: String, enum: FEEDBACK_VERDICTS, required: true },
  comment: { type: String, maxlength: 2000 },
  actionTaken: { type: String, maxlength: 2000 },
  observedOutcome: { type: String, enum: OBSERVED_OUTCOMES },
  observedAt: Date,
}, { timestamps: { createdAt: true, updatedAt: false } });
feedbackSchema.index({ analysisId: 1, _id: -1 });
export const IndicatorAnalysisFeedback = mongoose.model("IndicatorAnalysisFeedback", feedbackSchema);
