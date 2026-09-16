import "dotenv/config";
import { defineConfig } from "prisma/config";
import { ensureDatabaseUrls } from "./src/config/database-urls.ts";

ensureDatabaseUrls(process.env);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // La génération et le build doivent fonctionner sans connexion à une base.
  datasource: { url: process.env.DATABASE_URL },
});
