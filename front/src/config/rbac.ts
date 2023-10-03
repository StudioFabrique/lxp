import { Authorizer } from "casbin.js";
import Role from "../utils/interfaces/role";

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
      "parcours",
      "module",
      "cours",
    ],
    write: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "parcours",
      "module",
      "cours",
    ],
    update: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "parcours",
      "module",
      "cours",
    ],
    delete: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "parcours",
      "module",
      "cours",
    ],
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
  student: {
    read: ["parcours"],
  },
  boss_teacher: {
    read: ["teacher", "student", "coach", "stagiaire", "everything"],
    update: ["student", "coach", "stagiaire"],
  },
};

export const casbinAuthorizer: Authorizer = new Authorizer();

export default function defineRulesFor(roles: Role[]) {
  // superUser roles definition
  const builtPerms: Record<string, any> = {};

  // perms should be of format
  // { 'read': ['Contact', 'Database']}
  roles.forEach((role) => {
    const permissions = permDefs[role.role as keyof typeof permDefs];
    Object.entries(permissions).forEach(([key, value]) => {
      builtPerms[key] = [...(builtPerms[key] || []), ...value];
    });
  });
  casbinAuthorizer.setPermission(builtPerms);
}
