import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface IStudentFeedback extends Document {
  feelingLevel: string;
  feedbackAt: Date;
  user: IUser;
  comment?: string;
}

const studentFeedbackSchema: Schema = new Schema({
  feelingLevel: {
    type: Schema.Types.Number,
    require: true,
    unique: false,
  },
  feedbackAt: {
    type: Date,
    required: true,
    default: new Date(),
    unique: false,
  },
  comment: {
    type: Schema.Types.String,
    require: false,
    unique: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    Ref: "User",
    require: true,
  },
  hasBeenReviewed: {
    type: Schema.Types.Boolean,
    require: true,
    default: false,
    unique: false,
  },
});

const StudentFeedback = mongoose.model<IStudentFeedback>(
  "StudentFeedback",
  studentFeedbackSchema
);

export default StudentFeedback;
