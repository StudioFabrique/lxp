import type { Types } from "mongoose";

/** Champs communs aux documents persistés, sans les méthodes de Mongoose. */
export interface MongoRecord {
  _id: Types.ObjectId;
  id?: string;
}

/** Une référence avant ou après `populate()`. */
export type MongoRef<T> = Types.ObjectId | T;
