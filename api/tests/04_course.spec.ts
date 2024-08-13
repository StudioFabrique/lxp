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

describe("HTTP Course", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  describe("Test Delete /detach-course", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).delete("/v1/course/detach-course/1").expect(403);
    });
    test("It should responde 200 success", async () => {
      const parcours = await request(app)
        .post("/v1/parcours/")
        .send({ title: "parcours test", description: "bla bla" })
        .set("Cookie", [`${authToken}`]);
      //  création d'un cours
      const course = await request(app)
        .post("/v1/course/")
        .send({ title: "test delete course", moduleId: 1 })
        .set("Cookie", [`${authToken}`]);
      //  tentative de suppression du cours nouvellement créé
      await request(app)
        .delete(`/v1/course/detach-course/${course.body.course.id}`)
        .set("Cookie", [`${authToken}`])
        .expect(418);
    });
  });
  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
