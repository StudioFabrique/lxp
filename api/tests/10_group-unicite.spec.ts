import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import Group from "../src/utils/interfaces/db/group.ts";
import { prisma } from "../src/utils/db.ts";

dotenv.config();

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

/**
 * Un nom de groupe déjà pris ne remontait aucun message : la création
 * répondait avec un libellé générique et la modification répondait 201 sans
 * rien changer.
 */
describe("HTTP /group — unicité du nom", () => {
  let authToken = {};

  const names = {
    taken: "Promotion unicite",
    other: "Promotion unicite bis",
  };

  const postGroup = (name: string) =>
    request(app)
      .post("/v1/group")
      .set("Cookie", [`${authToken}`])
      .field("data", JSON.stringify({ group: { name }, users: [] }));

  const cleanUp = async () => {
    const groups = await Group.find({
      name: { $in: [names.taken, names.other] },
    });

    await prisma.group.deleteMany({
      where: { idMdb: { in: groups.map((group) => group._id.toString()) } },
    });
    await Group.deleteMany({ _id: { $in: groups.map((group) => group._id) } });
  };

  beforeAll(async () => {
    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });
    authToken = loginResponse.headers["set-cookie"][0];

    await cleanUp();
  });

  afterAll(async () => {
    await cleanUp();
    await disconnect();
  });

  test("le premier groupe est créé", async () => {
    await postGroup(names.taken).expect(201);
  });

  test("un second groupe du même nom est refusé en 409 avec son motif", async () => {
    const res = await postGroup(names.taken);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Un groupe portant ce nom existe déjà.");
  });

  test("le même nom dans une autre casse est refusé aussi", async () => {
    const res = await postGroup(names.taken.toUpperCase());

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Un groupe portant ce nom existe déjà.");
  });

  test("le même nom entouré d'espaces est refusé aussi", async () => {
    const res = await postGroup(`  ${names.taken}  `);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Un groupe portant ce nom existe déjà.");
  });

  test("renommer un groupe avec le nom d'un autre est refusé", async () => {
    await postGroup(names.other).expect(201);

    const groupToRename = await Group.findOne({ name: names.other });

    const res = await request(app)
      .put(`/v1/group/${groupToRename!._id.toString()}`)
      .set("Cookie", [`${authToken}`])
      .field(
        "data",
        JSON.stringify({ group: { name: names.taken }, users: [] }),
      );

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Un groupe portant ce nom existe déjà.");
  });

  test("un groupe garde son propre nom à la modification", async () => {
    const groupToUpdate = await Group.findOne({ name: names.other });

    await request(app)
      .put(`/v1/group/${groupToUpdate!._id.toString()}`)
      .set("Cookie", [`${authToken}`])
      .field(
        "data",
        JSON.stringify({
          group: { name: names.other, desc: "horaires du matin" },
          users: [],
        }),
      )
      .expect(201);
  });
});
