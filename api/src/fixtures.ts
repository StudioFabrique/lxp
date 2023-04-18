import bcrypt from "bcrypt";
import User from "./utils/interfaces/db/teacher-admin/teacher.model";

import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./utils/interfaces/db/student/student.model";
dotenv.config();

const MONGO_URL = "mongodb://127.0.0.1:27017/lxp";

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
    roles: ["teacher"],
  });
  await newUser.save();

  const newHash = await bcrypt.hash("Abcdef@123456", 10);
  const newStudent = new Student({
    email: "test@toto.fr",
    password: newHash,
    roles: ["student"],
  });
  await newStudent.save();
}

async function main() {
  await mongoConnect();
  await createUser();
}

main();
