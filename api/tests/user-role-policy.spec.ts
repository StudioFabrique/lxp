import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../src/config/env.ts";
import { prisma } from "../src/utils/db.ts";
import User from "../src/utils/interfaces/db/user.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import BlackListedToken from "../src/utils/interfaces/db/blacklisted-token.ts";
import normalizeUserRoles from "../src/utils/services/db/normalize-user-roles.ts";
import transferRoot from "../src/models/user/transfer-root.ts";
import updateUserRoles from "../src/models/user/update-user-roles.ts";
import createManyUsers from "../src/models/user/create-many-users.ts";
import { createRootAccount, promoteAdminToRoot } from "../src/models/auth/setup.ts";
import { authenticateSession } from "../src/utils/services/auth/authenticate-session.ts";

const databaseName = "lxp_user_role_policy_test";
let rootRole: any, adminRole: any, teacherRole: any, studentRole: any;
const account = (email: string, role: any, isActive = true) => User.create({
  email, firstname: "test", lastname: "roles", roles: [role._id], isActive,
});
const key = (purpose: string, email?: string) => jwt.sign(
  { purpose, email, nonce: randomUUID() }, env.REGISTER_SECRET, { expiresIn: "5m" },
);

async function clean() {
  const ids = (await User.find().select("_id")).map(({ _id }) => String(_id));
  await prisma.admin.deleteMany({ where: { idMdb: { in: ids } } });
  await prisma.contact.deleteMany({ where: { idMdb: { in: ids } } });
  await mongoose.connection.dropDatabase();
}

beforeAll(async () => {
  if (env.ENVIRONMENT !== "test") throw new Error("Base de test requise");
  await mongoose.connect(env.MONGO_LOCAL_URL, { dbName: databaseName });
});
beforeEach(async () => {
  await clean();
  [rootRole, adminRole, teacherRole, studentRole] = await Role.create([
    { role: "root", label: "root", rank: 0 },
    { role: "admin", label: "administrateur", rank: 1 },
    { role: "teacher", label: "équipe pédagogique", rank: 2 },
    { role: "student", label: "apprenant", rank: 3 },
  ]);
  await BlackListedToken.createCollection();
  await BlackListedToken.collection.createIndex({ token: 1 }, { unique: true });
});
afterAll(async () => {
  await clean();
  await mongoose.disconnect();
  await prisma.$disconnect();
});

describe("rôle utilisateur unique", () => {
  test("normalise les anciens comptes et protège toutes les écritures Mongo", async () => {
    const active = await account("root-actif@test.fr", rootRole);
    await User.collection.insertMany([
      { email: "root-inactif@test.fr", firstname: "test", lastname: "test", isActive: false, roles: [rootRole._id, teacherRole._id] },
      { email: "multi@test.fr", firstname: "test", lastname: "test", roles: [studentRole._id, teacherRole._id] },
    ]);
    await normalizeUserRoles();
    await normalizeUserRoles();
    expect(await User.countDocuments({ roles: rootRole._id })).toBe(1);
    expect((await User.findById(active._id))!.roles.map(String)).toEqual([String(rootRole._id)]);
    expect((await User.findOne({ email: "root-inactif@test.fr" }))!.roles.map(String)).toEqual([String(adminRole._id)]);
    expect((await User.findOne({ email: "multi@test.fr" }))!.roles.map(String)).toEqual([String(teacherRole._id)]);
    await expect(User.collection.updateOne({ _id: active._id }, { $set: { roles: [] } })).rejects.toMatchObject({ code: 121 });
    await expect(User.collection.updateOne({ _id: active._id }, { $set: { roles: [adminRole._id, teacherRole._id] } })).rejects.toMatchObject({ code: 121 });
    await expect(account("second-root@test.fr", rootRole)).rejects.toMatchObject({ code: 11000 });
  });

  test("refuse un lot multirôle avant toute écriture", async () => {
    const user = await account("admin@test.fr", adminRole);
    await expect(updateUserRoles([String(user._id)], [String(adminRole._id), String(teacherRole._id)])).rejects.toMatchObject({ statusCode: 400 });
    expect((await User.findById(user._id))!.roles.map(String)).toEqual([String(adminRole._id)]);
    expect(await prisma.contact.count({ where: { idMdb: String(user._id) } })).toBe(0);
  });

  test("ne crée pas de contact pour un changement de catégorie refusé", async () => {
    const user = await account("student@test.fr", studentRole);
    await expect(updateUserRoles([String(user._id)], [String(teacherRole._id)])).rejects.toMatchObject({ statusCode: 400 });
    expect(await prisma.contact.count({ where: { idMdb: String(user._id) } })).toBe(0);
  });

  test("l'import attribue le rôle système, même avec plusieurs rôles du même rang", async () => {
    await Role.create({ role: "student-custom", label: "personnalisé", rank: 3 });
    const result = await createManyUsers([{ email: "import@test.fr", firstname: "test", lastname: "test" }] as any, 3);
    expect(result.users[0].roles.map(String)).toEqual([String(studentRole._id)]);
  });
});

describe("transfert du rôle root", () => {
  test("la création root rétrograde le titulaire et actualise ses permissions de session", async () => {
    const oldRoot = await account("old-root@test.fr", rootRole);
    await normalizeUserRoles();
    const email = "new-root@test.fr";
    const id = await createRootAccount({ token: key("root-account", email), email, firstname: "new", lastname: "root", password: "RootPassword@123" });
    expect((await User.findById(oldRoot._id))!.roles.map(String)).toEqual([String(adminRole._id)]);
    expect((await User.findById(id))!.roles.map(String)).toEqual([String(rootRole._id)]);
    const accessToken = jwt.sign({ userId: String(oldRoot._id), tokenType: "access" }, env.SECRET);
    expect((await authenticateSession(accessToken)).userRoles[0].rank).toBe(1);
  });

  test("la promotion fonctionne sans root et remplace ensuite le root courant", async () => {
    const first = await account("first@test.fr", adminRole);
    const second = await account("second@test.fr", adminRole);
    await normalizeUserRoles();
    await promoteAdminToRoot(key("first-admin"), String(first._id));
    await promoteAdminToRoot(key("first-admin"), String(second._id));
    expect(await User.countDocuments({ roles: rootRole._id })).toBe(1);
    expect((await User.findById(first._id))!.roles.map(String)).toEqual([String(adminRole._id)]);
    expect((await User.findById(second._id))!.roles.map(String)).toEqual([String(rootRole._id)]);
  });

  test("deux transferts concurrents ne laissent qu'un seul root", async () => {
    const first = await account("first@test.fr", adminRole);
    const second = await account("second@test.fr", adminRole);
    await normalizeUserRoles();
    await Promise.all([transferRoot(String(first._id)), transferRoot(String(second._id))]);
    expect(await User.countDocuments({ roles: rootRole._id })).toBe(1);
    expect(await User.countDocuments({ roles: adminRole._id })).toBe(1);
  });

  test("restaure le root si l'attribution échoue après sa rétrogradation", async () => {
    const oldRoot = await account("old@test.fr", rootRole);
    const target = await account("new@test.fr", adminRole);
    await normalizeUserRoles();
    const update = jest.spyOn(User, "updateOne");
    update.mockImplementationOnce(() => { throw new Error("écriture refusée"); });
    try {
      await expect(transferRoot(String(target._id))).rejects.toThrow("écriture refusée");
      expect((await User.findById(oldRoot._id))!.roles.map(String)).toEqual([String(rootRole._id)]);
    } finally { update.mockRestore(); }
  });

  test("une création refusée ne rétrograde pas le root actuel", async () => {
    const oldRoot = await account("old@test.fr", rootRole);
    await normalizeUserRoles();
    await expect(createRootAccount({ token: key("root-account", oldRoot.email), email: oldRoot.email, firstname: "test", lastname: "test", password: "RootPassword@123" })).rejects.toMatchObject({ statusCode: 409 });
    expect((await User.findById(oldRoot._id))!.roles.map(String)).toEqual([String(rootRole._id)]);
  });
});
