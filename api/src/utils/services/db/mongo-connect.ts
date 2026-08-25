import mongoose from "mongoose";
import { logger } from "../../logs/logger.ts";
import { env } from "../../../config/env.ts";

const MONGO_URL = env.MONGO_LOCAL_URL;

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
  throw err; // <-- IMPORTANT pour faire échouer beforeAll proprement
});

mongoose.connection.on("error", (err) => {
  logger.error(err);
});

export default async function mongoConnect() {
  try {
    if (!env.MONGO_LOCAL_URL)
      throw new Error("Missing MONGO_LOCAL_URL");
    await mongoose.connect(env.MONGO_LOCAL_URL);
  } catch (err) {
    logger.error("❌ Erreur de connexion à MongoDB :", err);
    throw err;
  }
}
