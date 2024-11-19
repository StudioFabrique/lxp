import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import mongoose from "mongoose";

dotenv.config();

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const MONGO_TEST_URL = process.env.MONGO_TEST_URL;

describe("HTTP Lesson", () => {
  let authToken = {};

  beforeAll(async () => {
    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });
    authToken = loginResponse.headers["set-cookie"][0];
  });

  const lessonData = {
    id: 1,
    title: "test",
    description: "test",
    modalite: "hybride",
    tagId: 1,
  };

  describe("Test PUT /update", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/lesson/update").send(lessonData).expect(403);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
