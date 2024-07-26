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
import permDefs from "./fixtures-permissions";
import IConnectionInfos from "./utils/interfaces/db/connection-infos";
import ConnectionInfos from "./utils/interfaces/db/connection-infos";
dotenv.config();

const MONGO_URL = process.env.FIXTURES_MONGO_URL;
console.log(MONGO_URL, process.env.FIXTURES_MONGO_URL);

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
    email: "admin@studio.eco",
    nickname: "studio",
    password: hash,
    roles: [new Object(role!._id)],
    isActive: true,
    //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newUser.save();
  robotIndex++;

  let role2 = await Role.findOne({ role: "teacher" });
  const newTeacher = new User({
    firstname: "raymond",
    lastname: "dupont",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "formateur@studio.eco",
    password: hash,
    roles: [new Object(role2!._id)],
    isActive: true,
    //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newTeacher.save();
  robotIndex++;

  role = await Role.findOne({ role: "student" });
  const newStudent = new User({
    firstname: "jacqueline",
    lastname: "fillipini",
    address: "14 bvd olga ducresnes",
    postCode: "64000",
    city: "pau",
    email: "apprenant@studio.eco",
    password: hash,
    roles: [new Object(role!._id)],
    isActive: true,
    //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  const createdStudent = await newStudent.save();
  const rssi = new User({
    firstname: "paul",
    lastname: "dupuis",
    address: "12 place clémenceau",
    postCode: "64000",
    city: "pzu",
    email: "rssi@studio.eco",
    password: hash,
    roles: [new Object(role!._id)],
    isActive: true,
  });
  await rssi.save();
  const dates = createConnectionInfos();
  let infos = Array<any>();
  dates.forEach((date: any) => {
    infos = [
      ...infos,
      new IConnectionInfos({
        userId: createdStudent._id,
        lastConnection: date.date,
        duration: date.duration,
      }),
    ];
  });
  const newInfos = await ConnectionInfos.insertMany(infos);
  const infosIds = newInfos.map((item) => item._id);
  await User.findOneAndUpdate(
    { _id: createdStudent._id },
    { connectionInfos: infosIds }
  );
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
      email: createMail(firstname, lastnames[i], robotIndex).toLowerCase(),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
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
      email: createMail(firstname, lastnames[i], robotIndex).toLowerCase(),
      password: hash,
      address: addresses[i],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
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
      email: createMail(firstname, lastnames[i], robotIndex).toLowerCase(),
      password: hash,
      address: addresses[i] || addresses[i - 50],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

/* async function createManyCoach() {
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
      email: createMail(firstname, lastnames[i], robotIndex),
      password: hash,
      address: addresses[i] || addresses[i - 50],
      postCode,
      city: cityName,
      roles: [new Object(role!._id)],
      isActive: getRandomNumber(0, 1) === 0,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
} */

async function createRoles() {
  const roles = [
    { role: "admin", label: "admin", rank: 1, isActive: true },
    { role: "teacher", label: "formateur", rank: 2 },
    { role: "student", label: "apprenant", rank: 3 },
  ];
  const dbRoles = Array<any>();
  roles.forEach((role) => {
    dbRoles.push(new Role(role));
  });
  await Role.bulkSave(dbRoles);
}

async function createPermissions() {
  const permissions = Array<any>();
  const dbPermissions = Array<any>();

  for (const [key, value] of Object.entries(permDefs)) {
    for (const [itemKey, itemValue] of Object.entries(value)) {
      permissions.push({ role: key, action: itemKey, ressources: itemValue });
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

function createConnectionInfos() {
  const date = new Date().getTime();
  let dates = Array<{ date: string; duration: number }>();
  for (let i = 14; i >= 1; i--) {
    const tmp = new Date(date - i * (1000 * 3600 * 24));
    const duration = getRandomNumber(1 * 1000 * 3600, 8 * 1000 * 3600);
    dates = [...dates, { date: tmp.toString(), duration }];
  }
  return dates;
}

async function dropDatabase() {
  await mongoose.connection.dropDatabase();
  console.log("Database dropped!");
}

async function disconnect() {
  await mongoose.disconnect();
  process.exit();
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
  //await createManyCoach();
  //await createManyGroups();
  await createTag();
  await disconnect();
}

main();
