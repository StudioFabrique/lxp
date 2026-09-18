export function formatWelcomeTitle(
  template: string,
  user?: { firstname?: string; lastname?: string } | null,
) {
  return template
    .replace(/\{firstname\}/g, user?.firstname ?? "")
    .replace(/\{lastname\}/g, user?.lastname ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
