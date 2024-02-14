import mongoose, { Document, Schema } from "mongoose";

export interface IConnectionInfos extends Document {
  lastConnection: Date;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

const connectionInfosSchema: Schema = new Schema({
  lastConnection: {
    type: Date,
    required: true,
    default: new Date(),
    unique: false,
  },
  duration: { type: Number, required: true, unique: false, default: 0 },
  userId: { type: String, required: true, unique: false },
});

const ConnectionInfos = mongoose.model<IConnectionInfos>(
  "ConnectionInfos",
  connectionInfosSchema
);

export default ConnectionInfos;
