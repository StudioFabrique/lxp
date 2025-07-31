import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
//dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
  console.log("Running in environment:", process.env.ENVIRONMENT);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

function loadEnvFile() {
  const possiblePaths = [
    ".env",
    "./api/.env",
    "./api/dist/.env",
    path.join(__dirname, ".env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), "api/.env"),
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Loading .env from: ${envPath}`);
      dotenv.config({ path: envPath });
      return envPath;
    }
  }
}

async function mongoConnect() {
  loadEnvFile();
  await mongoose.connect(MONGO_URL!);
}

export default mongoConnect;
