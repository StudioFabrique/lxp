import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  postCode: string;
  city: string;
  roles: Array<string>;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    city: { type: String, required: true },
    roles: { type: [String], required: true },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
