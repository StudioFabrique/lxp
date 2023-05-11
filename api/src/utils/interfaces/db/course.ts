import { Schema, model } from "mongoose";
import { IGroup } from "./group";

export interface ICourse {
  name: string;
  groups: IGroup[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    groups: { type: [Schema.Types.ObjectId], ref: "Group" },
  },
  { timestamps: true }
);

const Course = model("Course", courseSchema);

export default Course;
