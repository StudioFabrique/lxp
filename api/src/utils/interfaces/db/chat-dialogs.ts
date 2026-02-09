import mongoose, { type Document, Schema } from "mongoose";

type Dialog = {
  origin: "user" | "bot";
  message: string;
  date: Date;
};

export interface IChatDialogs extends Document {
  userId: mongoose.Types.ObjectId;
  question: Dialog;
  answer: Dialog;
}

const chatDialogsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: {
      origin: { type: String, enum: ["user", "bot"], required: true },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
    answer: {
      origin: { type: String, enum: ["user", "bot"], required: true },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

const ChatDialogs = mongoose.model<IChatDialogs>(
  "ChatDialogs",
  chatDialogsSchema,
);

export default ChatDialogs;
