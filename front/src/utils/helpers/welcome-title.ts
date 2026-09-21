import type User from "../interfaces/user";

export function formatWelcomeTitle(template: string, user?: User | null) {
  return template
    .split("{firstname}")
    .join(user?.firstname ?? "")
    .split("{lastname}")
    .join(user?.lastname ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
