// jest.setup.ts
import mongoose from "mongoose";
import { createPrismaClient } from "./src/utils/create-prisma-client.ts";

const prisma = createPrismaClient();

// ✅ Utilisez afterAll directement, pas global.afterAll
afterAll(async () => {
  try {
    console.log("🧹 Global cleanup starting...");

    // Fermer toutes les connexions MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("✅ MongoDB disconnected");
    }

    // Fermer Prisma
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");
  } catch (error) {
    console.error("❌ Cleanup error:", error);
  }
});
