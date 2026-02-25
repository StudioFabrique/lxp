import { type Document, Schema, model } from "mongoose";

export interface IGroupStats extends Document {
  groupId: string;
  tokensUsed: number;
  date: Date;
  users: {
    userId: string;
    fullname: string;
    tokensUsed: number;
    promptCount: number;
  };
}

const groupStatsSchema: Schema = new Schema(
  {
    groupId: { type: String, required: true },
    tokensUsed: { type: Number, required: true },
    date: { type: Date, required: true },
    users: [
      {
        userId: { type: String, required: true },
        fullname: { type: String, required: true },
        tokensUsed: { type: Number, required: true },
        promptCount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const GroupStats = model<IGroupStats>("GroupStats", groupStatsSchema);

export default GroupStats;
