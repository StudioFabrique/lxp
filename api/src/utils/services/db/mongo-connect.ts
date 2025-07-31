import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
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
  console.log(MONGO_URL);

  await mongoose.connect(MONGO_URL!);
}

export default mongoConnect;
