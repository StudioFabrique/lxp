import {
  createMongoAbility,
  MongoAbility,
  RawRuleOf,
} from "@casl/ability";

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

const actions = new Set<string>(appActions);
const subjects = new Set<string>(appSubjects);

export function permissionNameToRule(name: string): AppAbilityRule | null {
  const separator = name.indexOf(":");
  if (separator <= 0 || separator === name.length - 1) return null;

  const action = name.slice(0, separator);
  const subject = name.slice(separator + 1);
  if (!actions.has(action) || !subjects.has(subject)) return null;

  return { action: action as AppAction, subject: subject as AppSubject };
}

export function buildAbility(
  permissionNames: Iterable<string>,
): AppAbility {
  const uniqueRules = new Map<string, AppAbilityRule>();
  for (const permissionName of permissionNames) {
    const rule = permissionNameToRule(permissionName);
    if (rule) {
      uniqueRules.set(`${String(rule.action)}:${String(rule.subject)}`, rule);
    }
  }
  return createMongoAbility<[AppAction, AppSubject]>([
    ...uniqueRules.values(),
  ]);
}
