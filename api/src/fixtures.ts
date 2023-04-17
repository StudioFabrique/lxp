import bcrypt from "bcrypt";
import User from "./utils/interfaces/db/teacher-admin/teacher.model";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

async function createUser() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const newUser = new User({
    email: "toto@toto.fr",
    password: hash,
    roles: ["admin"],
  });

  await newUser.save();
}

async function main() {
  await mongoConnect();
  await createUser();
}

main();
