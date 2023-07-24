import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
import mongoConnect from "../../utils/services/db/mongo-connect";
import { PrismaClient } from "@prisma/client";
import { blobParcours } from "../../utils/tests/blob-parcours";
import mongoose from "mongoose";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

let tags: any;
let contacts: any;
const image = blobParcours;

async function getTags() {
  return await prisma.tag.findMany();
}

async function getContacts() {
  return await prisma.teacher.findMany();
}

describe("HTTP Handshake", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    await mongoConnect();
    tags = (await getTags()).map((item) => item.id);
    contacts = (await getContacts()).map((item: any) => item.id);

    // Perform any setup before running the tests, such as logging in and obtaining the authentication token
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "toto@toto.fr", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  afterAll(async () => {
    // Perform any cleanup after running the tests, such as logging out or closing database connections
    // ...
  });

  describe("Test GET /parcours/contacts", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/parcours/contacts")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  /**
   * test POST-CREATE-PARCOURS
   */

  //  jeu de données valides
  describe("Test POST /parcours", () => {
    test("It should respond with 201 success", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "testToto",
          description: "testDescription",
          degree: "testDegree",
          startDate: new Date(),
          endDate: new Date(),
          tags,
          contacts: [1],
          image,
        })
        .expect(201);
    });
  });

  // jeux de données non valides

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: 0,
          description: "testDescription",
          degree: "testDegree",
          startDate: new Date(),
          endDate: new Date(),
          tags,
          contacts: [1],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: 0,
          degree: "testDegree",
          startDate: new Date(),
          endDate: new Date(),
          tags,
          contacts: [1],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: "testDescription",
          degree: 0,
          startDate: new Date(),
          endDate: new Date(),
          tags,
          contacts: [1],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: "testDescription",
          degree: "testDegree",
          startDate: 0,
          endDate: new Date(),
          tags,
          contacts: [1],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: "testDescription",
          degree: "testDegree",
          startDate: new Date(),
          endDate: 0,
          tags: [0],
          contacts: [1],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: "testDescription",
          degree: "testDegree",
          startDate: new Date(),
          endDate: 0,
          tags,
          contacts: [0],
          image,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          id: 1,
          title: "totoTest",
          description: "testDescription",
          degree: "testDegree",
          startDate: new Date(),
          endDate: 0,
          tags,
          contacts: [1],
          image: 0,
        })
        .expect(400);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
