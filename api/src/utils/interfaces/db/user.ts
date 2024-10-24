import mongoose, { Schema, Document, mongo } from "mongoose";
import { IRole } from "./role";
import { IGroup } from "./group";
import { IGraduation } from "./graduation";
import { IHobby } from "./hobby";
import { ILink } from "./link";
import { IConnectionInfos } from "./connection-infos";
import { IStudentFeedback } from "./student-feedback";

export interface IUser extends Document {
  email: string;
  firstname: string;
  lastname: string;
  description?: string;
  password: string;
  avatar?: Buffer;
  isActive: boolean;
  nickname?: string;
  address?: string;
  postCode?: string;
  city?: string;
  birthDate?: Date;
  phoneNumber?: string;
  group?: IGroup["_id"];
  roles: IRole["_id"];
  hobbies?: IHobby["_id"][];
  links?: ILink["_id"][];
  graduations?: IGraduation["_id"][];
  createdAt?: Date;
  updatedAt?: Date;
  connectionInfos?: IConnectionInfos["_id"];
  studentFeedbacks?: IStudentFeedback["_id"];
  emailVerified: boolean;
  invitationSent: boolean;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    description: { type: String, required: false },
    password: { type: String, require: true },
    avatar: { type: Buffer, required: false },
    isActive: { type: Boolean, required: true },
    nickname: { type: String, required: false },
    address: { type: String, required: false },
    postCode: { type: String, required: false },
    city: { type: String, required: false },
    birthDate: { type: Date, required: false },
    phoneNumber: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    invitationSent: { type: Boolean, default: false },

    connectionInfos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ConnectionInfos",
      required: false,
    },
    studentFeedbacks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "StudentFeedback",
      required: false,
    },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
    group: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      required: false,
    },
    graduations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Graduation",
        required: false,
      },
    ],
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link",
        required: false,
      },
    ],
    hobbies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hobby",
        required: false,
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
