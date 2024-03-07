import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface IStudentFeedback extends Document {
  feelingLevel: string;
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
    require: true,
    unique: false,
  },
  feedbackAt: {
    type: Date,
    require: true,
    default: Date.now,
    unique: false,
  },
  comment: {
    type: Schema.Types.String,
    require: false,
    unique: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  hasBeenReviewed: {
    type: Schema.Types.Boolean,
    require: true,
    default: false,
    unique: false,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    require: false,
    unique: false,
  },
});

const StudentFeedback = mongoose.model<IStudentFeedback>(
  "StudentFeedback",
  studentFeedbackSchema
);

export default StudentFeedback;
