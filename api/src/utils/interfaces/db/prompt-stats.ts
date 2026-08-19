import mongoose, { type Document, Schema } from "mongoose";

export interface IPromptStats extends Document {
  userId: string;
  date: Date;
  tokensUsed: number;
  groupId?: string;
  /** Nombre de questions posées au chatbot ce jour-là. */
  chatbotQuestions: number;
  /** Parmi elles, celles refusées par le service IA (hors périmètre). */
  chatbotOutOfScope: number;
}

const promptStatsSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: false },
    date: { type: Date, required: true },
    tokensUsed: { type: Number, required: true, default: 0 },
    groupId: { type: String, required: false },
    // Compteurs chatbot durables : ChatDialogs est une fenêtre glissante de 20
    // échanges, purgeable par l'apprenant, donc inexploitable pour du comptage.
    chatbotQuestions: { type: Number, required: true, default: 0 },
    chatbotOutOfScope: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

promptStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

const PromptStats = mongoose.model<IPromptStats>(
  "PromptStats",
  promptStatsSchema,
);

export default PromptStats;
