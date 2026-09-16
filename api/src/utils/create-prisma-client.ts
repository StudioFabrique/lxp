import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");

  const adapter = new PrismaPg({
    connectionString,
    connectionTimeoutMillis: 5_000,
  });
  return new PrismaClient({ adapter });
}
