import mongoose, { type Document, Schema } from "mongoose";

export interface IConnectionInfos extends Document {
  lastConnection: Date;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

const connectionInfosSchema: Schema = new Schema(
  {
    // `Date.now` et non `new Date()` : un littéral serait évalué une seule fois
    // au chargement du module et figerait la valeur par défaut.
    lastConnection: {
      type: Date,
      required: true,
      default: Date.now,
      unique: false,
    },
    duration: { type: Number, required: true, unique: false, default: 0 },
    userId: { type: String, required: true, unique: false },
  },
  { timestamps: true },
);

connectionInfosSchema.index({ userId: 1, lastConnection: 1 });

const ConnectionInfos = mongoose.model<IConnectionInfos>(
  "ConnectionInfos",
  connectionInfosSchema,
);

export default ConnectionInfos;
