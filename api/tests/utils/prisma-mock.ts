import { jest } from "@jest/globals";

type ModelMockOptions = {
  evaluateWhere?: boolean;
  evaluateIncludes?: boolean;
};

const chainMethods = [
  "cursor",
  "groupBy",
  "having",
  "limit",
  "offset",
  "orderBy",
  "select",
] as const;

/** Minimal fluent Prisma 8 collection used by isolated unit tests. */
export function createModelMock(
  terminals: Record<string, unknown> = {},
  options: ModelMockOptions = {},
) {
  const model: Record<string, any> = { ...terminals };

  for (const method of chainMethods) {
    model[method] ??= jest.fn(() => model);
  }
  model.where ??= jest.fn(() => model);
  model.include ??= jest.fn(
    (_relation: string, refine?: (collection: typeof model) => unknown) => {
      if (options.evaluateIncludes) refine?.(model);
      return model;
    },
  );

  return model;
}

export function requireDatabaseRow<Row>(row: Row | null): Row {
  if (row === null) throw new Error("Database row not found");
  return row;
}
