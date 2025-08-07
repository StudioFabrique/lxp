import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.join(__dirname, "..", "..", "..", "..", ".env") });
//dotenv.config();
//dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  throw err; // <-- IMPORTANT pour faire échouer beforeAll proprement
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export default async function mongoConnect() {
  try {
    if (!process.env.MONGO_LOCAL_URL)
      throw new Error("Missing MONGO_LOCAL_URL");
    await mongoose.connect(process.env.MONGO_LOCAL_URL);
    console.log("✅ MongoDB connecté");
  } catch (err) {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    throw err;
  }
}
