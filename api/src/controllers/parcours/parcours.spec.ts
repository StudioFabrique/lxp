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
          title: "testToto",
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
          title: 0,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 404 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          title: "testToto",
          formation: 1,
        })
        .expect(404);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
