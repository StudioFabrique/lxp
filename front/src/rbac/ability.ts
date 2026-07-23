import { createMongoAbility, MongoAbility, RawRuleOf } from "@casl/ability";

export const appActions = [
  "read",
  "write",
  "update",
  "delete",
  "layout",
  "component",
] as const;
export type AppAction = (typeof appActions)[number];

export const appSubjects = [
  "accomplishment",
  "activity",
  "admin",
  "bonusSkill",
  "calendar",
  "chatbot",
  "company-picture-upload",
  "course",
  "cursus",
  "dashboard",
  "dashboardIa",
  "evaluation",
  "everything",
  "feedback",
  "formation",
  "group",
  "hobbie",
  "last-feedback",
  "lesson",
  "lessons-rating-stats",
  "mediatheque",
  "module",
  "objective",
  "parcours",
  "permission",
  "profile",
  "progression",
  "quiz",
  "resource",
  "role",
  "skill",
  "social-network",
  "stats",
  "start-lesson-button",
  "student",
  "tag",
  "teacher",
  "user",
] as const;
export type AppSubject = (typeof appSubjects)[number];
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;
export type AppAbilityRule = RawRuleOf<AppAbility>;

export const createAppAbility = (rules: AppAbilityRule[] = []) =>
  createMongoAbility<[AppAction, AppSubject]>(rules);
