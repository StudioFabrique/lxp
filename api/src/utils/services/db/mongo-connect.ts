import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect(url: string) {
  if (url.length === 0) {
    await mongoose.connect(MONGO_URL!);
  } else {
    await mongoose.connect(url);
  }
}

export default mongoConnect;
