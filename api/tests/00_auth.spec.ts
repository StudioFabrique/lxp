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

describe("HTTP auth", () => {
  let authToken = {}; // Store the authentication token
  let refreshToken = {}; // Store the refresh token

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });
    console.log("toto", loginResponse.headers);

    authToken = loginResponse.headers["set-cookie"][0];
    refreshToken = loginResponse.headers["set-cookie"][1];
  });

  describe("Test POST /auth/login", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "Abcdef@123456",
        })
        .expect(200);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          //email: "admin@studio.eco",
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "<hacked>lol</hacked>",
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.ecor",
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          //password: "Abcdef@123456",
        })
        .expect(401);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "Abcdef@1234567",
        })
        .expect(401);
    });

    test("It should respond with 401 unauthorized", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "<hacked>lol</hacked>",
        })
        .expect(401);
    });
  });

  describe("Test GET /auth/handshake", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/auth/handshake")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/auth/handshake").expect(403);
    });
  });

  describe("Test GET /auth/refresh", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/auth/refresh")
        .set("Cookie", [`${refreshToken}`])
        .expect(200);
    });

    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/auth/refresh").expect(403);
    });
  });

  describe("Test GET /auth/logout", () => {
    test("It should respond 200 success", async () => {
      await request(app).get("/v1/auth/logout").expect(200);
    });
  });

  describe("Test GET /auth/roles", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/auth/roles")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/auth/roles")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
