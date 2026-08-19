import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "./user.ts";

export interface IStudentFeedback extends Document {
  /** Échelle 1 (orage) à 5 (soleil) ; le schéma stocke bien un nombre. */
  feelingLevel: number;
  feedbackAt: Date;
  user: IUser["_id"];
  comment?: string;
  hasBeenReviewed: boolean;
  // formateur qui a pris en charge le feedback de l'apprenant
  teacher: IUser["_id"];
}

const studentFeedbackSchema: Schema = new Schema({
  feelingLevel: {
    type: Schema.Types.Number,
    required: true,
    unique: false,
  },
  feedbackAt: {
    type: Date,
    required: true,
    default: Date.now,
    unique: false,
  },
  comment: {
    type: Schema.Types.String,
    required: false,
    unique: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hasBeenReviewed: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
    unique: false,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    unique: false,
  },
});

studentFeedbackSchema.index({ user: 1, feedbackAt: -1 });

const StudentFeedback = mongoose.model<IStudentFeedback>(
  "StudentFeedback",
  studentFeedbackSchema,
);

export default StudentFeedback;
