import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import mongoose from "mongoose";
import path from "path";

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
  let authToken2 = {}; // token secondaire pour tester le propriétaire d'un élément d'une table

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });
    const loginResponse2 = await request(app)
      .post("/v1/auth/login")
      .send({ email: "formateur@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
    authToken2 = loginResponse2.headers["set-cookie"][0];
  });

  describe("Test POST /", () => {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "tests",
      "test-image.png",
    );
    const module = {
      formationId: 1,
      title: "test course title",
      description: "Description random",
    };
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`]);
      await request(app)
        .post("/v1/course")
        .send({ title: "Test course" })
        .expect(403);
    });

    test("It should respond 201 success", async () => {
      await request(app)
        .post("/v1/course")
        .send({ title: "Test course", moduleId: 1 })
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .post("/v1/course")
        .send({ title: "test random", moduleId: 10000 })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/course")
        .send({ moduleId: 1 })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/course")
        .send({ title: "<hacked/>", moduleId: 1 })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/course")
        .send({ title: "<hacked/>" })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test Delete /delete-course", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).delete("/v1/course/delete-course/1").expect(403);
    });

    test("It should responde 400 bad request", async () => {
      //  tentative de suppression du cours nouvellement créé
      await request(app)
        .delete(`/v1/course/delete-course/toto`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should responde 404 not found", async () => {
      //  tentative de suppression du cours nouvellement créé
      await request(app)
        .delete(`/v1/course/delete-course`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should responde 404 not found", async () => {
      //  tentative de suppression du cours nouvellement créé
      await request(app)
        .delete(`/v1/course/delete-course/10000`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should responds 406 not acceptable", async () => {
      await request(app)
        .delete(`/v1/course/delete-course/1`)
        .set("Cookie", [`${authToken2}`])
        .expect(406);
    });

    test("It should responde 200 success", async () => {
      //  tentative de suppression du cours nouvellement créé
      await request(app)
        .delete(`/v1/course/delete-course/1`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test Reorder courses /reorder/:courseId", () => {
    test("It should responde 200 success", async () => {
      await request(app)
        .post("/v1/course")
        .send({ title: "Test 1", moduleId: 1 })
        .set("Cookie", [`${authToken}`]);
      await request(app)
        .post("/v1/course")
        .send({ title: "Test 2", moduleId: 1 })
        .set("Cookie", [`${authToken}`]);
      await request(app)
        .post("/v1/course")
        .send({ title: "Test 3", moduleId: 1 })
        .set("Cookie", [`${authToken}`]);
      await request(app)
        .put("/v1/course/reorder/1")
        .send([4, 3, 2])
        .set("Cookie", [`${authToken}`])
        .expect(200);
      const courses = await prisma.course.findMany({
        where: {
          moduleId: 1,
        },
        orderBy: { id: "asc" },
      });
      const orders = courses.map((item) => item.order);
      expect(orders).toEqual([2, 1, 0]);
    });

    test("It should respond 403 not authorized", async () => {
      await request(app)
        .put("/v1/course/reorder/1")
        .send([4, 3, 2])
        .expect(403);
    });

    test("It should response 400 bad request", async () => {
      await request(app)
        .put("/v1/course/reorder/toto")
        .send([4, 3, 2])
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should response 404 not found", async () => {
      await request(app)
        .put("/v1/course/reorder")
        .send([4, 3, 2])
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should response 400 bad request", async () => {
      await request(app)
        .put("/v1/course/reorder/1")
        .send(["toto", 3, 2])
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should response 400 bad request", async () => {
      await request(app)
        .put("/v1/course/reorder/1")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });
  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
