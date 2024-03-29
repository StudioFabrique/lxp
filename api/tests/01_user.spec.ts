import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import mongoose from "mongoose";

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

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
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

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
