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
dotenv.config({ path: ".env.local", override: true });

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

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMail(firstname: string, lastname: string, i: number) {
  return `${firstname}.${lastname}${i}@${domains[getRandomNumber(0, 9)]}`;
}

let robotIndex = 1;

async function createUser() {
  let role = await Role.findOne({ role: "admin" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const newUser = new User({
    firstname: "jacques",
    lastname: "durand",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "toto@toto.fr",
    password: hash,
    roles: [new Object(role!._id)],
    isActive: true,
    avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newUser.save();
  robotIndex++;

  let role2 = await Role.findOne({ role: "teacher" });
  const newTeacher = new User({
    firstname: "bob",
    lastname: "dupont",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "titi@toto.fr",
    password: hash,
    roles: [new Object(role!._id), new Object(role2!._id)],
    isActive: true,
    avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newTeacher.save();
  robotIndex++;

  role = await Role.findOne({ role: "student" });
  const newStudent = new Student({
    firstname: "jacqueline",
    lastname: "dupond",
    address: "14 bvd olga ducresnes",
    postCode: "64000",
    city: "pau",
    email: "test@toto.fr",
    password: hash,
    roles: [new Object(role!._id)],
    isActive: true,
    avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newStudent.save();
  robotIndex++;
}

async function createManyAdmins() {
  const role = await Role.findOne({ role: "admin" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 5; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname: firstname.toLowerCase(),
      lastname: lastnames[i].toLowerCase(),
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

async function createManyTeachers() {
  const role = await Role.findOne({ role: "teacher" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 5; i < 15; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname: firstname.toLowerCase(),
      lastname: lastnames[i].toLowerCase(),
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

async function createManStudents() {
  const role = await Role.findOne({ role: "student" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 100; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname: firstname.toLowerCase(),
      lastname: lastnames[i].toLowerCase(),
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i] || addresses[i - 50],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await Student.bulkSave(userList);
}

async function createManyCoach() {
  const role = await Role.findOne({ role: "coach" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 100; i++) {
    const firstname = firstnames[getRandomNumber(0, 14)];
    const city = cities[getRandomNumber(0, 9)];
    const postCode = city.postcode;
    const cityName = city.name;
    const user = new User({
      firstname: firstname.toLowerCase(),
      lastname: "dupont",
      email: createMail(firstname, lastnames[i], i),
      password: hash,
      address: addresses[i] || addresses[i - 50],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: getRandomNumber(0, 1) === 0,
      avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await Student.bulkSave(userList);
}

async function createRoles() {
  const roles = [
    { role: "admin", label: "admin", rank: 1 },
    { role: "teacher", label: "formateur", rank: 2 },
    { role: "boss_teacher", label: "Formateur en Chef", rank: 2 },
    { role: "student", label: "apprenant", rank: 3 },
    { role: "coach", label: "mentor", rank: 3 },
  ];
  const dbRoles = Array<any>();
  roles.forEach((role) => {
    dbRoles.push(new Role(role));
  });
  await Role.bulkSave(dbRoles);
}

const permDefs = {
  admin: {
    read: ["admin", "teacher", "student"],
    write: ["teacher", "student"],
    update: ["teacher", "student"],
    delete: ["teacher", "student"],
  },
  teacher: {
    read: ["teacher", "student"],
    update: ["student"],
    write: ["student"],
    delete: ["student"],
  },
};

async function createPermissions() {
  const permissions = Array<any>();
  const dbPermissions = Array<any>();

  for (const [key, value] of Object.entries(permDefs)) {
    for (const [itemKey, itemValue] of Object.entries(value)) {
      permissions.push({ role: key, action: itemKey, subject: itemValue });
    }
  }
  permissions.forEach((permissions) =>
    dbPermissions.push(new Permission(permissions))
  );
  await Permission.bulkSave(dbPermissions);
}

async function dropDatabase() {
  await mongoose.connection.dropDatabase();
  console.log("Database dropped!");
}

async function main() {
  await mongoConnect();
  await dropDatabase();
  await createRoles();
  await createPermissions();
  await createUser();
  await createManyAdmins();
  await createManyTeachers();
  await createManStudents();
  await createManyCoach();
}

main();
