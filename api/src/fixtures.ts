import bcrypt from "bcrypt";

import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  addresses,
  cities,
  colors,
  domains,
  firstnames,
  lastnames,
  tags,
} from "./utils/fixtures/data/data";
import Role from "./utils/interfaces/db/role";
import Permission, { IPermission } from "./utils/interfaces/db/permission";
import Tag from "./utils/interfaces/db/tag";
import User from "./utils/interfaces/db/user";
import {
  permDefsActions,
  permDefsInterface,
} from "./utils/rbac/fixtures-permissions";
import IConnectionInfos from "./utils/interfaces/db/connection-infos";
import ConnectionInfos from "./utils/interfaces/db/connection-infos";
dotenv.config();

const MONGO_URL = process.env.MONGO_LOCAL_URL;
console.log(MONGO_URL);

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
  const [roleAdmin, roleInterfaceAdmin] = await Promise.all([
    await Role.findOne({ role: "admin" }),
    await Role.findOne({ role: "interface:admin" }),
  ]);
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
    roles: [new Object(roleAdmin!._id), new Object(roleInterfaceAdmin!._id)],
    isActive: true,
  });
  await newUser.save();
  robotIndex++;

  const [roleTeacher, roleInterfaceTeacher] = await Promise.all([
    await Role.findOne({ role: "teacher" }),
    await Role.findOne({ role: "interface:teacher" }),
  ]);
  const newTeacher = new User({
    firstname: "raymond",
    lastname: "dupont",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "formateur@studio.eco",
    password: hash,
    roles: [
      new Object(roleTeacher!._id),
      new Object(roleInterfaceTeacher!._id),
    ],
    isActive: true,
    //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newTeacher.save();
  robotIndex++;
  const newTeacher2 = new User({
    firstname: "raymond",
    lastname: "dupond",
    address: "14 place royale",
    postCode: "64000",
    city: "pau",
    email: "formateur2@studio.eco",
    password: hash,
    roles: [new Object(roleTeacher!._id)],
    isActive: true,
    //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
  });
  await newTeacher2.save();
  robotIndex++;

  const [roleStudent, roleInterfaceStudent] = await Promise.all([
    await Role.findOne({ role: "student" }),
    await Role.findOne({ role: "interface:student" }),
  ]);

  const newStudent = new User({
    firstname: "jacqueline",
    lastname: "fillipini",
    address: "14 bvd olga ducresnes",
    postCode: "64000",
    city: "pau",
    email: "apprenant@studio.eco",
    password: hash,
    roles: [
      new Object(roleStudent!._id),
      new Object(roleInterfaceStudent!._id),
    ],
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
    roles: [
      new Object(roleStudent!._id),
      new Object(roleInterfaceStudent!._id),
    ],
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
    { connectionInfos: infosIds },
  );
  robotIndex++;
}

async function createManyAdmins() {
  const [role, roleInterface] = await Promise.all([
    await Role.findOne({ role: "admin" }),
    await Role.findOne({ role: "interface:admin" }),
  ]);
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
      roles: [new Object(role!._id), new Object(roleInterface!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

async function createManyTeachers() {
  const [role, roleInterface] = await Promise.all([
    await Role.findOne({ role: "teacher" }),
    await Role.findOne({ role: "interface:teacher" }),
  ]);
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
      roles: [new Object(role!._id), new Object(roleInterface!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

async function createManyStudents() {
  const [role, roleInterface] = await Promise.all([
    await Role.findOne({ role: "student" }),
    await Role.findOne({ role: "interface:student" }),
  ]);
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
      roles: [new Object(role!._id), new Object(roleInterface!._id)],
      isActive: true,
      //avatar: `https://robohash.org/${robotIndex}?set=set2&size=24x24`,
    });
    userList.push(user);
    robotIndex++;
  }
  await User.bulkSave(userList);
}

async function createRoles() {
  // Roles d'interface
  const interfaceRoles = [
    {
      role: "interface:admin",
      label: "interface de l'admin",
      rank: 1,
      isProtected: true,
    },
    {
      role: "interface:teacher",
      label: "interface du formateur",
      rank: 2,
      isProtected: true,
    },
    {
      role: "interface:student",
      label: "interface de l'apprenant",
      rank: 3,
      isProtected: true,
    },
  ];

  // Roles d'actions
  const actionsRoles = [
    { role: "admin", label: "administrateur", rank: 1, isProtected: true },
    {
      role: "teacher",
      label: "équipe pédagogique",
      rank: 2,
      isProtected: true,
    },
    { role: "student", label: "apprenant", rank: 3, isProtected: true },
  ];
  const dbRoles = Array<any>();
  [...interfaceRoles, ...actionsRoles].forEach((role) => {
    dbRoles.push(new Role(role));
  });
  await Role.bulkSave(dbRoles);
}

async function createPermissions() {
  const bulkPermissions = new Map<string, IPermission>();
  const bulkRoleUpdates = new Map<string, any>();

  for (const [roleName, value] of Object.entries({
    ...permDefsInterface,
    ...permDefsActions,
  })) {
    const role = await Role.findOne({ role: roleName });

    if (!role) return;

    const rolePermissions = [];

    for (const [action, ressources] of Object.entries(value)) {
      for (const res of ressources) {
        const permissionName = `${action}:${res}`;

        if (!bulkPermissions.has(permissionName)) {
          const existingPermission = await Permission.findOne({
            name: permissionName,
          });

          if (existingPermission) {
            existingPermission.roles = [role];
            bulkPermissions.set(permissionName, existingPermission);
            rolePermissions.push(existingPermission._id);
          } else {
            const newPermission = new Permission({
              roles: [role],
              name: permissionName,
            });
            bulkPermissions.set(permissionName, newPermission);
            rolePermissions.push(newPermission._id);
          }
        } else {
          const permission = bulkPermissions.get(permissionName)!;
          permission.roles = [...permission.roles, role];
          rolePermissions.push(permission._id);
        }
      }
    }

    bulkRoleUpdates.set(role._id.toString(), {
      updateOne: {
        filter: { _id: role._id },
        update: { $set: { permissions: rolePermissions } },
      },
    });
  }

  await Permission.bulkSave(Array.from(bulkPermissions.values()));
  await Role.bulkWrite(Array.from(bulkRoleUpdates.values()));
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
  //await dropDatabase();
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
