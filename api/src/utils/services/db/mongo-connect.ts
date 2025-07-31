import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
//dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
  console.log("Running in environment:", process.env.ENVIRONMENT);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  const envPath = path.join(__dirname, "/lxp/dist/.env");

  dotenv.config({ path: envPath });
  process.env.NODE_ENV === "development"
    ? dotenv.config()
    : dotenv.config({ path: envPath, override: true });
  console.log(MONGO_URL);

  await mongoose.connect(MONGO_URL!);
}

export default mongoConnect;
