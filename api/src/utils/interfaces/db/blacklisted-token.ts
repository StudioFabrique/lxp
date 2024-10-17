/**
Schema pour MongoDB, une fois qu'un utilisateur active son compte,
le token fournit dans le mail d'activation est enregistré dans cette
collection.

*/

import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklistedToken extends Document {
  token: string;
}

const blacklistedTokenSchema: Schema = new Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const BlackListedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  blacklistedTokenSchema,
);

export default BlackListedToken;
