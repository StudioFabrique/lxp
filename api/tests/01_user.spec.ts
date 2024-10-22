import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import Role from "../src/utils/interfaces/db/role";
import User from "../src/utils/interfaces/db/user";
import mongoConnect from "../src/utils/services/db/mongo-connect";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const MONGO_TEST_URL = process.env.MONGO_TEST_URL;

describe("HTTP /user", () => {
  let authToken = {}; // Store the authentication token
  let token = "";

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
    const role = await Role.findOne({ role: "admin" });
    const user = await User.findOne({ email: "admin@studio.eco" });
    token = jwt.sign(
      { userId: user!._id, userRoles: [role] },
      process.env.REGISTER_SECRET!,
      { expiresIn: "7d" },
    );
  });

  describe("Test POST /teacher", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .expect(403);
    });

    test("it should responde 200 success", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          //email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "<hacked/>",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          //firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "<hacked/>",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          //lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "<hacked/>",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "<hacked/>",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "<hacked/>",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "<hacked/>",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "<hacked/>",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          //isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("it should responde 400 bad request", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: "true",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test /:role/:stype/:sdir", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=1&limit=10")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/<hacked>lol/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/<hacked>lol/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/<hacked>lol?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=toto&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  // en tant que formateur
  describe("Test /last-feedbacks", () => {
    test("It should respond 200 success", async () => {
      await mongoConnect();
      const loginResponse = await request(app)
        .post("/v1/auth/login")
        .send({ email: "formateur@studio.eco", password: "Abcdef@123456" });

      authToken = loginResponse.headers["set-cookie"][0];
      await request(app)
        .get("/v1/user/last-feedbacks/true")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/user/last-feedbacks/true").expect(403);
    });
  });

  describe("Test /activate", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: token, password: "Abcdef@123456" })
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: "", password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: "<hacked ! />", password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@<hacked !/>" })
        .expect(400);
    });
  });

  describe("Test /invitation/:userId", () => {
    test("It should respond 200 success", async () => {
      const loginResponse = await request(app)
        .post("/v1/auth/login")
        .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

      authToken = loginResponse.headers["set-cookie"][0];
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/${user._id}`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 not authorized", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation2@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app).put(`/v1/user/invitation/${user._id}`).expect(403);
    });

    test("It should respond 404 not found", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation3@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/${role!._id}`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation4@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/toto`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test /check-invitation", () => {
    test("It should respond 200 success", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation5@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      token = jwt.sign(
        { userId: user._id, userRoles: [role] },
        process.env.REGISTER_SECRET!,
        { expiresIn: "7d" },
      );
      await request(app)
        .post("/v1/user/check-invitation")
        .send({ token })
        .expect(200);
    });

    test("It should respond 400 bad reques", async () => {
      await request(app).post("/v1/user/check-invitation").expect(400);
    });

    test("It should respond 400 bad reques", async () => {
      await request(app)
        .post("/v1/user/check-invitation")
        .send({ token: "toto" })
        .expect(400);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
