import { Document, Schema, model } from "mongoose";
import { IGroup } from "./group";

export interface ICourse extends Document {
  name: string;
  groups: IGroup["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    groups: { type: [Schema.Types.ObjectId], ref: "Group" },
  },
  { timestamps: true }
);

const Course = model<ICourse>("Course", courseSchema);

export default Course;
