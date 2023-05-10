import { Schema, model } from "mongoose";
import { IGroup } from "./group";

export interface ICourse {
  name: string;
  groups: IGroup[];
}

const courseSchema: Schema = new Schema({
  name: { type: String, required: true },
  groups: { type: [Schema.Types.ObjectId], ref: "Group" },
});

const Course = model("Course", courseSchema);
