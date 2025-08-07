// jest.setup.ts
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
