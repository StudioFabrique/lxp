import bcrypt from "bcrypt";
import User from "./utils/interfaces/db/teacher-admin/teacher.model";

import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./utils/interfaces/db/student/student.model";
import {
  addresses,
  cities,
  domains,
  firstnames,
  lastnames,
} from "./utils/fixtures/data/data";
import Role from "./utils/interfaces/db/role";
import Permission from "./utils/interfaces/db/permission";
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

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMail(firstname: string, lastname: string, i: number) {
  return `${firstname}.${lastname}${i}@${domains[getRandomNumber(0, 9)]}`;
}

async function createUser() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const newUser = new User({
    firstname: "jacques",
    lastname: "durand",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "toto@toto.fr",
    password: hash,
    roles: ["teacher"],
  });
  await newUser.save();

  const newStudent = new Student({
    firstname: "jacqueline",
    lastname: "dupond",
    address: "14 bvd olga ducresnes",
    postCode: "64000",
    city: "pau",
    email: "test@toto.fr",
    password: hash,
    roles: ["student"],
  });
  await newStudent.save();
}

async function createManyAdmins() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 5; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname,
      lastname: lastnames[i],
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: ["admin"],
    });
    userList.push(user);
  }
  await User.bulkSave(userList);
}

async function createManyTeachers() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 5; i < 15; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    console.log(city);

    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname,
      lastname: lastnames[i],
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: ["teacher"],
    });
    userList.push(user);
  }
  await User.bulkSave(userList);
}

async function createManStudents() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 100; i++) {
    console.log(lastnames[i]);

    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname,
      lastname: lastnames[i],
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i] || addresses[i - 50],
      postCode,
      city: cityName,
      roles: ["student"],
    });
    userList.push(user);
  }
  await Student.bulkSave(userList);
}

async function createRoles() {
  const roles = [
    { role: "admin", label: "admin" },
    { role: "teacher", label: "teacher" },
    { role: "student", label: "student" },
  ];
  const dbRoles = Array<any>();
  roles.forEach((role) => {
    dbRoles.push(new Role(role));
  });
  await Role.bulkSave(dbRoles);
}

async function createPermissions() {
  const dbPermissions = Array<any>();
  dbPermissions.push(
    new Permission({
      role: "admin",
      resource: "user",
      action: "read:any",
      attributes: ["*"],
    })
  );
  dbPermissions.push(
    new Permission({
      role: "teacher",
      resource: "user",
      action: "read:any",
      attributes: ["*"],
    })
  );
  await Permission.bulkSave(dbPermissions);
}

async function main() {
  await mongoConnect();
  await createUser();
  await createManyAdmins();
  await createManyTeachers();
  await createManStudents();
  await createRoles();
  await createPermissions();
}

main();
