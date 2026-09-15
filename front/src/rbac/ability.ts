import { createMongoAbility, MongoAbility, RawRuleOf } from "@casl/ability";

export const appActions = [
  "read",
  "write",
  "update",
  "delete",
] as const;
export type AppAction = (typeof appActions)[number];

export const appSubjects = [
  "accomplishment",
  "activity",
  "bonusSkill",
  "calendar",
  "chatbot",
  "course",
  "cursus",
  "dashboard",
  "dashboardIa",
  "evaluation",
  "feedback",
  "formation",
  "group",
  "hobbie",
  "lesson",
  "mediatheque",
  "module",
  "objective",
  "parcours",
  "permission",
  "profile",
  "quiz",
  "resource",
  "role",
  "skill",
  "social-network",
  "stats",
  "tag",
  "user",
] as const;
export type AppSubject = (typeof appSubjects)[number];
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;
export type AppAbilityRule = RawRuleOf<AppAbility>;

export const createAppAbility = (rules: AppAbilityRule[] = []) =>
  createMongoAbility<[AppAction, AppSubject]>(rules);
