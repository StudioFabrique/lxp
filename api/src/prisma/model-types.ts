import type { Scalars } from "@prisma/orm-postgres/family-contract/types";
import type { Models } from "./contract.d.ts";

/** Scalar database rows used by the API. Relations are added by each query. */
export type Activity = Scalars<Models.public_Activity>;
export type Admin = Scalars<Models.public_Admin>;
export type BonusActivity = Scalars<Models.public_BonusActivity>;
export type BonusSkill = Scalars<Models.public_BonusSkill>;
export type Contact = Scalars<Models.public_Contact>;
export type Course = Scalars<Models.public_Course>;
export type Group = Scalars<Models.public_Group>;
export type Lesson = Scalars<Models.public_Lesson>;
export type Objective = Scalars<Models.public_Objective>;
export type Resource = Scalars<Models.public_Resource>;
export type ResourceActivity = Scalars<Models.public_ResourceActivity>;
export type ResourceBonusActivity = Scalars<Models.public_ResourceBonusActivity>;
export type Tag = Scalars<Models.public_Tag>;
export type JsonValue = Models.public_QuizQuestion["data"];
