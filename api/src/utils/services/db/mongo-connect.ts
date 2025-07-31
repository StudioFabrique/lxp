import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.join(__dirname, "..", "..", "..", "..", ".env") });
//dotenv.config();
//dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
  console.log("ENVIRONMENT", process.env.NODE_ENV);
  console.log("ENVIRONMENT", MONGO_URL);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  console.log(MONGO_URL);

  await mongoose.connect(MONGO_URL!);
}

export default mongoConnect;
