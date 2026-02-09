import mongoose, { type Document, Schema } from "mongoose";

export interface IPromptStats extends Document {
  userId: string;
  date: Date;
  tokensUsed: number;
}

const promptStatsSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: false },
    date: { type: Date, required: true },
    tokensUsed: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

promptStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

const PromptStats = mongoose.model<IPromptStats>(
  "PromptStats",
  promptStatsSchema,
);

export default PromptStats;
