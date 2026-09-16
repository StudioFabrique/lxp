import postgres from "@prisma/orm-postgres/runtime";
import { lints } from "@prisma/orm-postgres/family-runtime";
import type { Contract } from "../prisma/contract.d.ts";
import contractJson from "../prisma/contract.json" with { type: "json" };

export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");

  return postgres<Contract>({
    contractJson,
    url: connectionString,
    poolOptions: { connectionTimeoutMillis: 5_000 },
    middleware: [
      lints({
        severities: {
          selectStar: "warn",
          noLimit: "warn",
          deleteWithoutWhere: "error",
          updateWithoutWhere: "error",
          readOnlyMutation: "error",
        },
      }),
    ],
  });
}
