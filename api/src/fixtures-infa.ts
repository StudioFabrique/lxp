import bcrypt from "bcrypt";
import { prisma } from "./utils/db";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "./utils/interfaces/db/role";
import Permission, { IPermission } from "./utils/interfaces/db/permission";
import User from "./utils/interfaces/db/user";
import {
  permDefsActions,
  permDefsInterface,
} from "./utils/rbac/config/fixtures-permissions";
import { activationToken } from "./helpers/activation-token";
import { adminPrompt } from "./admin-prompt";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendActivationEmail(email: string, token: string) {
  try {
    const link = `${process.env.FRONT_URL}register?id=${token}`;
    const message = `<b>Bonjour, pour activer votre compte veuillez cliquer sur le lien ci-dessous dans un délai de 24h</b><br/><a href=${link}>Lien d'activation</a><br/><p>A bientôt !</p>`;

    await transporter.verify();
    const result = await transporter.sendMail({
      from: '"Activation du compte admin" <cponsan@fabriquenumerique.fr>',
      to:
        process.env.ENVIRONMENT === "production"
          ? email
          : "cponsan@fabriquenumerique.fr",
      subject: "Activation du compte",
      html: message,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

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

async function createUser(username: string) {
  const [roleAdmin, roleInterfaceAdmin] = await Promise.all([
    await Role.findOne({ role: "admin" }),
    await Role.findOne({ role: "interface:admin" }),
  ]);
  // génére un mot de passe random de 12 caractères avec majuscule, minuscule, chiffre et caractère spécial
  const password = Array(12)
    .fill(0)
    .map(() => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      return chars[Math.floor(Math.random() * chars.length)];
    })
    .join("");
  console.log("Generated password:", password); // Log the password so you can use it
  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    firstname: "ND",
    lastname: "ND",
    address: "ND",
    postCode: "64000",
    city: "pau",
    email: username,
    phoneNumber: "ND",
    nickname: "ND",
    password: hash,
    roles: [new Object(roleAdmin!._id), new Object(roleInterfaceAdmin!._id)],
    isActive: true,
    invitationSent: true,
  });

  console.log("Admin created:", newUser);

  const role = await Role.findOne({ role: "admin" });
  try {
    if (!role) {
      throw { statusCode: 404, message: "Le rôle n'existe pas." };
    }
    if (newUser) {
      const token = activationToken(newUser._id, role!, "7d");
      await sendActivationEmail(username, token);
      await prisma.admin.create({ data: { idMdb: newUser._id } });
    }
  } catch (error: any) {
    console.log({ error });
  }
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

async function disconnect() {
  await mongoose.disconnect();
  process.exit();
}

async function main() {
  const data = await adminPrompt();
  if (!data) {
    return;
  }

  await mongoConnect();
  await createRoles();
  await createPermissions();
  await createUser(data[0]);
  await disconnect();
}

main();
