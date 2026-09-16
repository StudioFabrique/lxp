import { relationsByModel } from "../generated/relations/relations.ts";

// Only human-readable labels: filenames, URLs, JSON and rich text keep their case.
const fieldsByModel: Record<string, readonly string[]> = {
  Accomplishment: ["name"], Activity: ["title"], BonusActivity: ["title"],
  Course: ["title"], Formation: ["title"], Lesson: ["title"], Module: ["title"],
  Parcours: ["title"], Resource: ["title"], Quiz: ["title"], Tag: ["name"],
  CourseAssignmentCriterion: ["label"], ResourceActivity: ["label"],
  ResourceBonusActivity: ["label"],
};
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** Normalize writes, including nested relations, without touching query filters. */
export function normalizeDisplayFields(model: string, operation: string, args: unknown): void {
  if (!object(args)) return;
  // Unique write selectors must match the normalized value on repeated imports.
  if ((operation === "upsert" || operation === "connectOrCreate") && object(args.where)) {
    for (const field of fieldsByModel[model] ?? []) {
      if (typeof args.where[field] === "string") args.where[field] = args.where[field].toLowerCase();
    }
  }
  const normalizeData = (data: unknown) => {
    if (Array.isArray(data)) {
      data.forEach(normalizeData);
      return;
    }
    if (!object(data)) return;
    for (const field of fieldsByModel[model] ?? []) {
      const value = data[field];
      if (typeof value === "string") data[field] = value.toLowerCase();
      else if (object(value) && typeof value.set === "string") value.set = value.set.toLowerCase();
    }
    for (const relation of relationsByModel[model] ?? []) {
      if (!object(data[relation.name])) continue;
      const nested = data[relation.name] as Record<string, unknown>;
      for (const [action, value] of Object.entries(nested)) {
        const entries = Array.isArray(value) ? value : [value];
        for (const entry of entries) {
          normalizeDisplayFields(relation.type, action,
            action === "create" ? { data: entry } :
            action === "update" && object(entry) && !("data" in entry) ? { data: entry } : entry);
        }
      }
    }
  };
  if (["create", "createMany", "createManyAndReturn", "update", "updateMany", "updateManyAndReturn"].includes(operation)) {
    normalizeData(args.data);
  } else if (operation === "upsert") {
    normalizeData(args.create);
    normalizeData(args.update);
  } else if (operation === "connectOrCreate") {
    normalizeData(args.create);
  }
}
