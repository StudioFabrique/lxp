import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as definePostgresConfig } from "@prisma/orm-postgres/config";
import { ensureDatabaseUrls } from "./src/config/database-urls.ts";

ensureDatabaseUrls(process.env);

export default definePrismaConfig({
  orm: definePostgresConfig({
    contract: "./src/prisma/contract.prisma",
    db: { connection: process.env.DATABASE_URL },
    migrations: { dir: "./migrations" },
  }),
});
