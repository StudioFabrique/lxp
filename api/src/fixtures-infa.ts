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
} from "./utils/rbac/config/fixtures-permissions";
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

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

async function createUser() {
  const [roleAdmin, roleInterfaceAdmin] = await Promise.all([
    await Role.findOne({ role: "admin" }),
    await Role.findOne({ role: "interface:admin" }),
  ]);
  const hash = await bcrypt.hash("Infa64@123456", 10);
  const newUser = new User({
    firstname: "ND",
    lastname: "ND",
    address: "ND",
    postCode: "64000",
    city: "pau",
    email: "admin@infa.org",
    phoneNumber: "ND",
    nickname: "ND",
    password: hash,
    roles: [new Object(roleAdmin!._id), new Object(roleInterfaceAdmin!._id)],
    isActive: true,
  });
  await newUser.save();
}

async function createRoles() {
  // Roles d'interface
  const interfaceRoles = [
    {
      role: "interface:admin",
      label: "interface de l'admin",
      rank: 1,
      protection: 2,
    },
    {
      role: "interface:teacher",
      label: "interface du formateur",
      rank: 2,
      protection: 2,
    },
    {
      role: "interface:student",
      label: "interface de l'apprenant",
      rank: 3,
      protection: 2,
    },
  ];

  // Roles d'actions
  const actionsRoles = [
    // protection 2, le nom du role, son modèle et rank ainsi que ses permissions ne peuvent pas être modifiés
    // seul le label est modifiable
    { role: "admin", label: "administrateur", rank: 1, protection: 2 },
    // protection 1, le nom du role, son modèle et rank ne peuvent pas être modifiés
    // seul le label et ses permissions sont modifiables
    {
      role: "teacher",
      label: "équipe pédagogique",
      rank: 2,
      protection: 1,
    },
    { role: "student", label: "apprenant", rank: 3, protection: 1 },
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

async function disconnect() {
  await mongoose.disconnect();
  process.exit();
}

async function main() {
  await mongoConnect();
  await createRoles();
  await createPermissions();
  await createUser();
  await createTag();
  await disconnect();
}

main();
