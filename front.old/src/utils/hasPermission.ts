import { casbinAuthorizer } from "../config/rbac";

export async function hasPermission(action: string, subject: string) {
  return await casbinAuthorizer.can(action, subject);
}
