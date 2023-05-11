import { Authorizer } from "casbin.js";
import User from "../utils/interfaces/user";

const permDefs = {
  admin: {
    read: ["admin", "teacher", "student"],
    write: ["teacher", "student"],
    delete: ["teacher", "student"],
  },
  teacher: {
    read: ["teacher", "student"],
    write: ["student"],
    delete: ["student"],
  },
};

export const casbinAuthorizer = new Authorizer("manual");

export default function defineRulesFor(user: User) {
  // superUser roles definition
  const builtPerms: Record<string, any> = {};

  // perms should be of format
  // { 'read': ['Contact', 'Database']}
  user.roles.forEach((role) => {
    console.log({ role });

    const permissions = permDefs[role.role as keyof typeof permDefs];
    Object.entries(permissions).forEach(([key, value]) => {
      builtPerms[key] = [...(builtPerms[key] || []), ...value];
    });
  });

  casbinAuthorizer.setPermission(builtPerms);
}
