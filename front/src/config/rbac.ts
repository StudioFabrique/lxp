import { Authorizer } from "casbin.js";
import User from "../utils/interfaces/user";

const permDefs = {
  admin: {
    read: [
      "admin",
      "mini-admin",
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "everything",
    ],
    write: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "parcours",
    ],
    update: ["teacher", "student", "coach", "boss_teacher", "stagiaire"],
    delete: ["teacher", "student", "coach", "boss_teacher", "stagiaire"],
  },
  teacher: {
    read: [
      "teacher",
      "boss_teacher",
      "student",
      "coach",
      "stagiaire",
      "everything",
    ],
    update: ["student", "coach", "stagiaire"],
  },
  boss_teacher: {
    read: ["teacher", "student", "coach", "stagiaire", "everything"],
    update: ["student", "coach", "stagiaire"],
  },
};

export const casbinAuthorizer = new Authorizer("manual");

export default function defineRulesFor(user: User) {
  // superUser roles definition
  const builtPerms: Record<string, any> = {};

  // perms should be of format
  // { 'read': ['Contact', 'Database']}
  user.roles.forEach((role) => {
    console.log(role.role);

    const permissions = permDefs[role.role as keyof typeof permDefs];
    Object.entries(permissions).forEach(([key, value]) => {
      builtPerms[key] = [...(builtPerms[key] || []), ...value];
    });
  });

  casbinAuthorizer.setPermission(builtPerms);
}
