import { all, and, not, or } from "@prisma/orm-postgres/orm-client";

type Predicate = ReturnType<typeof all>;

type FieldAccessor = {
  eq(value: unknown): Predicate;
  neq(value: unknown): Predicate;
  in(values: readonly unknown[]): Predicate;
  notIn(values: readonly unknown[]): Predicate;
  gt(value: unknown): Predicate;
  gte(value: unknown): Predicate;
  lt(value: unknown): Predicate;
  lte(value: unknown): Predicate;
  like(value: unknown): Predicate;
  ilike?(value: unknown): Predicate;
  isNull(): Predicate;
  isNotNull(): Predicate;
  some(
    predicate?: (fields: Record<string, FieldAccessor>) => Predicate,
  ): Predicate;
  every(
    predicate: (fields: Record<string, FieldAccessor>) => Predicate,
  ): Predicate;
  none(
    predicate?: (fields: Record<string, FieldAccessor>) => Predicate,
  ): Predicate;
};

type FilterObject = Record<string, unknown>;

const scalarOperators = new Set([
  "equals",
  "not",
  "in",
  "notIn",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "startsWith",
  "endsWith",
  "mode",
]);

function isObject(value: unknown): value is FilterObject {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function databaseValue(value: unknown): unknown {
  return value instanceof Date ? value.toISOString() : value;
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function textPattern(
  kind: "contains" | "startsWith" | "endsWith",
  value: unknown,
): unknown {
  if (typeof value !== "string") return value;
  const escaped = escapeLikePattern(value);
  if (kind === "contains") return `%${escaped}%`;
  if (kind === "startsWith") return `${escaped}%`;
  return `%${escaped}`;
}

function scalarPredicate(field: FieldAccessor, filter: unknown): Predicate {
  if (filter === null) return field.isNull();
  if (!isObject(filter)) return field.eq(databaseValue(filter));

  const insensitive = filter.mode === "insensitive" && field.ilike;
  const predicates: Predicate[] = [];
  for (const [operator, operand] of Object.entries(filter)) {
    if (operator === "mode") continue;
    const value = databaseValue(operand);
    switch (operator) {
      case "equals":
        predicates.push(
          value === null
            ? field.isNull()
            : insensitive && typeof value === "string"
              ? insensitive.call(field, escapeLikePattern(value))
              : field.eq(value),
        );
        break;
      case "not":
        if (value === null) predicates.push(field.isNotNull());
        else if (isObject(value))
          predicates.push(not(scalarPredicate(field, value)));
        else predicates.push(field.neq(value));
        break;
      case "in":
        predicates.push(
          insensitive && Array.isArray(value)
            ? or(
                ...value.map((entry) =>
                  typeof entry === "string"
                    ? insensitive.call(field, escapeLikePattern(entry))
                    : field.eq(entry),
                ),
              )
            : field.in(value as readonly unknown[]),
        );
        break;
      case "notIn":
        predicates.push(
          insensitive && Array.isArray(value)
            ? and(
                ...value.map((entry) =>
                  typeof entry === "string"
                    ? not(
                        insensitive.call(field, escapeLikePattern(entry)),
                      )
                    : field.neq(entry),
                ),
              )
            : field.notIn(value as readonly unknown[]),
        );
        break;
      case "gt":
      case "gte":
      case "lt":
      case "lte":
        predicates.push(field[operator](value));
        break;
      case "contains":
      case "startsWith":
      case "endsWith": {
        const pattern = textPattern(operator, value);
        predicates.push(
          insensitive ? insensitive.call(field, pattern) : field.like(pattern),
        );
        break;
      }
      default:
        throw new Error(`Unsupported Prisma filter operator: ${operator}`);
    }
  }
  return predicates.length === 0 ? all() : and(...predicates);
}

function relationPredicate(
  field: FieldAccessor,
  filter: FilterObject,
): Predicate {
  const predicates: Predicate[] = [];
  for (const [operator, operand] of Object.entries(filter)) {
    switch (operator) {
      case "some":
      case "every":
      case "none":
        predicates.push(
          field[operator]((related) => whereFromObject(related, operand)),
        );
        break;
      case "is":
        predicates.push(
          operand === null
            ? field.none()
            : field.some((related) => whereFromObject(related, operand)),
        );
        break;
      case "isNot":
        predicates.push(
          operand === null
            ? field.some()
            : field.none((related) => whereFromObject(related, operand)),
        );
        break;
      default:
        return field.some((related) => whereFromObject(related, filter));
    }
  }
  return predicates.length === 0 ? field.some() : and(...predicates);
}

/**
 * Converts Prisma 7's declarative filter objects to Prisma 8 predicates.
 * Keeping this translation in one place makes dynamic filters reusable while
 * query projections and mutations use Prisma 8's native fluent API directly.
 */
export function whereFromObject<Fields extends object>(
  modelFields: Fields,
  filter: unknown,
): Predicate {
  if (!isObject(filter)) return all();

  const fields = modelFields as unknown as Record<
    string,
    FieldAccessor | undefined
  >;
  const predicates: Predicate[] = [];
  for (const [name, value] of Object.entries(filter)) {
    if (value === undefined) continue;
    if (name === "AND" || name === "OR") {
      const branches = (Array.isArray(value) ? value : [value]).map((branch) =>
        whereFromObject(modelFields, branch),
      );
      predicates.push(name === "AND" ? and(...branches) : or(...branches));
      continue;
    }
    if (name === "NOT") {
      const branches = (Array.isArray(value) ? value : [value]).map((branch) =>
        not(whereFromObject(modelFields, branch)),
      );
      predicates.push(and(...branches));
      continue;
    }

    const field = fields[name];
    // Prisma 7 represents compound keys as { fieldA_fieldB: { fieldA, fieldB } }.
    if (!field && isObject(value)) {
      predicates.push(whereFromObject(modelFields, value));
      continue;
    }
    if (!field) throw new Error(`Unknown Prisma filter field: ${name}`);

    const relationFilter =
      isObject(value) &&
      !Object.keys(value).some((key) => scalarOperators.has(key));
    predicates.push(
      relationFilter
        ? relationPredicate(field, value)
        : scalarPredicate(field, value),
    );
  }
  return predicates.length === 0 ? all() : and(...predicates);
}

/** Preserve Prisma 7's throwing single-row write/read behavior. */
export function requireDatabaseRow<Row>(row: Row | null): Row {
  if (row === null) throw new Error("Database row not found");
  return row;
}
