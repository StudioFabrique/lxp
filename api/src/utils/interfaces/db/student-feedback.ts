import mongoose, { Document, Schema } from "mongoose";

export interface IStudentFeedback extends Document {
  feelingLevel: string;
  feedbackAt: Date;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
});

const ConnectionInfos = mongoose.model<IStudentFeedback>(
  "StudentFeedback",
  studentFeedbackSchema
);

export default ConnectionInfos;
