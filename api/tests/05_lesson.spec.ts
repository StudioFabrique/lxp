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
    id: 2,
    title: "test",
    description: "test",
    modalite: "hybride",
    tagId: 1,
  };

  describe("Test PUT /update", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/lesson/update").send(lessonData).expect(403);
    });

    test("It should respond 201 ok", async () => {
      const course = await prisma?.course.findFirst();
      console.log({ course });

      const lesson = await prisma?.lesson.create({
        data: {
          title: "test",
          description: "test",
          modalite: "hybride",
          tag: { connect: { id: 1 } },
          course: { connect: { id: course?.id } },
          order: 0,
          author: "jacques test",
          admin: { connect: { id: 1 } },
        },
      });

      console.log("LEÇON CRÉÉE : ", lesson);

      await request(app)
        .put("/v1/lesson/update")
        .send(lessonData)
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({ ...lessonData, id: 1000 })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({ ...lessonData, id: "toto" })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          title: "test",
          description: "test",
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,

          description: "test",
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "<hacked/>",
          description: "test",
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: 1,
          description: "test",
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",

          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          desription: "<hacked/>",
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: 1,
          modalite: "hybride",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",

          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",
          modalite: "<hacked/>",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",
          modalite: 1,
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 2,
          title: "test title",
          description: "test",
          modalite: "toto",
          tagId: 1,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",
          modalite: "hybride",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",
          modalite: "hybride",
          tagId: "toto",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .put("/v1/lesson/update")
        .send({
          id: 1,
          title: "test title",
          description: "test",
          modalite: "hybride",
          tagId: 10000,
        })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test GET /tag/:tagId", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/lesson/tag/1").expect(403);
    });

    test("It should respond 200 ok", async () => {
      const response = await request(app)
        .get("/v1/lesson/tag/10000")
        .set("Cookie", [`${authToken}`])
        .expect(200);
      expect(response.body.total).toBe(0);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
