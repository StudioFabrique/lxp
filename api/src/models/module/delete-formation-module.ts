import deleteModule from "./delete-module.ts";

// A flat module belongs to one parcours (and therefore one formation), so
// removing it from a formation is now the same operation as deleting it.
export default function deleteFormationModule(
  userId: string,
  moduleId: number,
) {
  return deleteModule(moduleId, userId);
}
