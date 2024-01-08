import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../../utils/services/db/mongo-connect";
import mongoose from "mongoose";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

describe("HTTP Formation", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "toto@toto.fr", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  describe("Test GET /formation", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/formation")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
