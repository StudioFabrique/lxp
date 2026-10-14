import { getSafeGroupReturnPath, readGroupFormDraft } from "./group-form-draft";

export function getGroupUserCreationContext(returnTo: string) {
  const safeReturnTo = getSafeGroupReturnPath(returnTo);
  const url = new URL(safeReturnTo ?? "/", "http://lxp.local");
  const draft = readGroupFormDraft(url.searchParams);
  return {
    safeReturnTo,
    isEditing: url.pathname.startsWith("/admin/group/edit/"),
    name: draft.values.name?.trim() || "Groupe sans nom",
    studentCount: new Set(draft.studentIds ?? []).size,
  };
}
