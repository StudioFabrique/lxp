import bcrypt from "bcrypt";

import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  addresses,
  cities,
  colors,
  domains,
  firstnames,
  groupes,
  lastnames,
  tags,
} from "./utils/fixtures/data/data";
import Role from "./utils/interfaces/db/role";
import Permission from "./utils/interfaces/db/permission";
import Group, { IGroup } from "./utils/interfaces/db/group";
import Tag from "./utils/interfaces/db/tag";
import User from "./utils/interfaces/db/user";
dotenv.config();

const MONGO_URL = process.env.MONGO_LOCAL_URL;
console.log({ MONGO_URL });

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
    nickname: "gandalf",
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
    roles: [new Object(role2!._id)],
    isActive: true,
    avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newTeacher.save();
  robotIndex++;

  role = await Role.findOne({ role: "student" });
  const newStudent = new User({
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

async function createManyGroups() {
  const role = await Role.findOne({ role: "student" });
  const newGroups = Array<any>();
  groupes.forEach((groupe) => {
    const newGroup = new Group({
      name: groupe,
      desc: "Lorem Ipsum bla bla bla",
      roles: [new Object(role!._id)],
    });
    newGroups.push(newGroup);
  });
  await Group.bulkSave(newGroups);
}

async function createManyTeachers() {
  const role = await Role.findOne({ role: "teacher" });
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

async function createManyStudents() {
  const role = await Role.findOne({ role: "student" });
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
  await User.bulkSave(userList);
}

async function createManyCoach() {
  const role = await Role.findOne({ role: "coach" });
  const hash = await bcrypt.hash("Abcdef@123456", 10);
  const userList = Array<any>();
  for (let i = 0; i < 5; i++) {
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
  await User.bulkSave(userList);
}

async function createRoles() {
  const roles = [
    { role: "admin", label: "admin", rank: 1 },
    { role: "mini-admin", label: "mini-admin", rank: 1 },
    { role: "teacher", label: "formateur", rank: 2 },
    { role: "boss_teacher", label: "Formateur en Chef", rank: 2 },
    { role: "student", label: "apprenant", rank: 3 },
    { role: "coach", label: "mentor", rank: 3 },
    { role: "stagiaire", label: "gestion cafetière", rank: 3 },
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

let tagsColors = Array<string>();

function setTagsColors() {
  let leftColors = colors;
  for (let i = 0; i < tags.length; i++) {
    if (leftColors.length === 0) {
      leftColors = colors;
    }
    tagsColors.push(leftColors[getRandomNumber(0, leftColors.length - 1)]);
    leftColors = leftColors.filter((col) => col !== tagsColors[i]);
  }
}

async function createTag() {
  setTagsColors();
  let index = 0;
  const tab = Array<any>();
  tags.forEach((tag) => {
    const newTag = new Tag({ name: tag, color: tagsColors[index] });
    tab.push(newTag);
    index++;
  });
  await Tag.bulkSave(tab);
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
  await createManyStudents();
  await createManyCoach();
  await createManyGroups();
  await createTag();
}

main();
