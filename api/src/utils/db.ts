// Load and validate the environment before constructing the connection pool.
import "../config/env.ts";
import { createPrismaClient } from "./create-prisma-client.ts";
import type { RelationMutator } from "@prisma/orm-postgres/orm-client";
import type { Contract } from "../prisma/contract.d.ts";

/** Shared Prisma 8 database client for the lifetime of the API process. */
const prisma = createPrismaClient();

export type DatabaseClient = typeof prisma;
export type TransactionClient = Parameters<
  Parameters<DatabaseClient["transaction"]>[0]
>[0];

/** Mutation used by a child record created through a relation. */
export type NestedCreate<Model extends string> = Pick<
  RelationMutator<Contract, Model>,
  "create"
>;

export { prisma };
