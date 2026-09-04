import mongoose, { Schema, Document, mongo } from "mongoose";
import { type IRole } from "./role.ts";
import { type IGroup } from "./group.ts";
import { type IGraduation } from "./graduation.ts";
import { type IHobby } from "./hobby.ts";
import { type ILink } from "./link.ts";
import { type IConnectionInfos } from "./connection-infos.ts";
import { type IStudentFeedback } from "./student-feedback.ts";
import { type IPromptStats } from "./prompt-stats.ts";

export type OnboardingStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped";

export interface IUserOnboarding {
  status: OnboardingStatus;
  step: string;
  version: number;
  updatedAt?: Date;
}

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
  /** Nouvelle adresse en attente de validation par son propriétaire. */
  pendingEmail?: string;
  invitationSent: boolean;
  invitationSentAt?: Date;
  /**
   * Horodatage du début d'un envoi d'invitation encore en cours.
   *
   * L'envoi étant détaché de la requête, « en cours de remise » et « jamais
   * envoyée » se confondraient sans lui : les deux laissent `invitationSent` à
   * faux. Un horodatage plutôt qu'un booléen pour qu'un redémarrage en plein
   * envoi ne fige pas l'état indéfiniment — au-delà d'un délai, il est
   * considéré comme périmé.
   */
  invitationPendingSince?: Date;
  promptCount: number;
  promptStats?: IPromptStats["_id"];
  onboarding: IUserOnboarding;
}

const onboardingSchema = new Schema<IUserOnboarding>(
  {
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "skipped"],
      default: "pending",
    },
    step: { type: String, default: "" },
    version: { type: Number, default: 1 },
    updatedAt: { type: Date, required: false },
  },
  { _id: false },
);

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    description: { type: String, required: false },
    password: { type: String, require: true },
    avatar: { type: Buffer, required: false },
    // test in progress, previously : isActive: { type: Boolean, required: true },
    isActive: { type: Boolean, default: false },
    nickname: { type: String, required: false },
    address: { type: String, required: false },
    postCode: { type: String, required: false },
    city: { type: String, required: false },
    birthDate: { type: Date, required: false },
    phoneNumber: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    pendingEmail: { type: String, required: false },
    invitationSent: { type: Boolean, default: false },
    invitationSentAt: { type: Date, required: false },
    invitationPendingSince: { type: Date, required: false },
    promptCount: { type: Number, default: 0 },
    promptStats: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PromptStats",
      required: false,
    },
    onboarding: {
      type: onboardingSchema,
      default: () => ({ status: "pending", step: "", version: 1 }),
    },

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
