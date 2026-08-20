import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "../../logs/logger.ts";

dotenv.config({ path: path.join(import.meta.dirname, "..", "..", "..", "..", ".env") });
//dotenv.config();
//dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
  throw err; // <-- IMPORTANT pour faire échouer beforeAll proprement
});

mongoose.connection.on("error", (err) => {
  logger.error(err);
});

export default async function mongoConnect() {
  try {
    if (!process.env.MONGO_LOCAL_URL)
      throw new Error("Missing MONGO_LOCAL_URL");
    await mongoose.connect(process.env.MONGO_LOCAL_URL);
  } catch (err) {
    logger.error("❌ Erreur de connexion à MongoDB :", err);
    throw err;
  }
}
