// Charge et valide la configuration avant que Prisma ne lise DATABASE_URL.
import "../config/env.ts";
import { createPrismaClient } from "./create-prisma-client.ts";
import { normalizeDisplayFields } from "./normalize-display-fields.ts";

const prisma = createPrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        normalizeDisplayFields(model, operation, args);
        return query(args);
      },
    },
  },
});

export type DatabaseClient = typeof prisma;
export type TransactionClient = Parameters<Parameters<DatabaseClient["$transaction"]>[0]>[0];

export { prisma };
