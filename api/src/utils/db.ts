// Charge et valide la configuration avant que Prisma ne lise DATABASE_URL.
import "../config/env.ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
