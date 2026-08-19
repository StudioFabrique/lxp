import mongoose, { type Document, Schema } from "mongoose";

type Dialog = {
  origin: "user" | "bot";
  message: string;
  date: Date;
};

export type CourseSource = {
  course: string;
  section: string;
  activity: string;
  score: number;
  heading_path: string;
};

export interface IChatDialogs extends Document {
  userId: mongoose.Types.ObjectId;
  question: Dialog;
  answer: Dialog;
  textSelection?: string | null;
  sources?: CourseSource[];
  /** Statut renvoyé par le service IA. `refusal` = question hors périmètre. */
  status?: "ok" | "error" | "refusal";
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
    textSelection: { type: String, default: null },
    status: {
      type: String,
      enum: ["ok", "error", "refusal"],
      default: "ok",
    },
    sources: [
      {
        course: { type: String, required: true },
        section: { type: String, required: true },
        activity: { type: String, required: true },
        score: { type: Number, required: true },
        heading_path: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const ChatDialogs = mongoose.model<IChatDialogs>(
  "ChatDialogs",
  chatDialogsSchema,
);

export default ChatDialogs;
