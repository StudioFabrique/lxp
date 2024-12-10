import request from "supertest";
import { prisma } from "../src/utils/db";
import path from "path";
import fs from "fs";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import app from "../src/app";

describe("HTTP Activity", () => {
  let authToken: string;
  let lessonId: number;
  let activityId: number;

  beforeAll(async () => {
    await mongoConnect();
    // Login pour obtenir le token
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];

    // Créer une leçon test
    const lesson = await prisma.lesson.create({
      data: {
        title: "Test Lesson",
        description: "Test Description",
        courseId: 1,
        order: 0,
        modalite: "hybride",
        author: "admin",
        adminId: 1,
        tagId: 1,
      },
    });
    lessonId = lesson.id;
  });

  afterAll(async () => {
    // Nettoyer la leçon test
    await prisma.lesson.delete({ where: { id: lessonId } });
  });

  describe("Test POST /text/:lessonId", () => {
    test("It should respond 403 forbidden without auth", async () => {
      await request(app)
        .post(`/v1/activity/text/${lessonId}`)
        .send({
          title: "Test Activity",
          description: "Test Description",
          value: "# Test Content",
        })
        .expect(403);
    });

    test("It should respond 201 created with valid data", async () => {
      const response = await request(app)
        .post(`/v1/activity/text/${lessonId}`)
        .set("Cookie", [`${authToken}`])
        .send({
          title: "Test Activity",
          description: "Test Description",
          value: "# Test Content",
        })
        .expect(201);

      activityId = response.body.id;
    });

    test("It should respond 400 with invalid lessonId", async () => {
      await request(app)
        .post("/v1/activity/text/invalid")
        .set("Cookie", [`${authToken}`])
        .send({
          title: "Test Activity",
          description: "Test Description",
          value: "# Test Content",
        })
        .expect(400);
    });
  });

  describe("Test PUT /text/:activityId", () => {
    test("It should respond 200 with valid update", async () => {
      await request(app)
        .put(`/v1/activity/text/${activityId}`)
        .set("Cookie", [`${authToken}`])
        .send({
          title: "Updated Activity",
          description: "Updated Description",
          value: "# Updated Content",
        })
        .expect(200);
    });

    test("It should respond 404 with non-existent activity", async () => {
      await request(app)
        .put("/v1/activity/text/99999")
        .set("Cookie", [`${authToken}`])
        .send({
          title: "Updated Activity",
          description: "Updated Description",
          value: "# Updated Content",
        })
        .expect(404);
    });
  });

  describe("Test DELETE /:activityId", () => {
    test("It should respond 200 with valid deletion", async () => {
      await request(app)
        .delete(`/v1/activity/${activityId}`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 404 with non-existent activity", async () => {
      await request(app)
        .delete(`/v1/activity/${activityId}`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test POST /resource/:lessonId", () => {
    test("It should respond 400 without files", async () => {
      await request(app)
        .post(`/v1/activity/resource/${lessonId}`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 201 with valid file upload", async () => {
      const testFilePath = path.join(__dirname, "test-files", "test.pdf");

      await request(app)
        .post(`/v1/activity/resource/${lessonId}`)
        .set("Cookie", [`${authToken}`])
        .attach("files", testFilePath)
        .field(
          "data",
          JSON.stringify([
            {
              filename: "test.pdf",
              label: "Test PDF",
            },
          ])
        )
        .expect(201);
    });

    test("It should respond 400 with invalid file type", async () => {
      const testFilePath = path.join(__dirname, "test-files", "test.exe");

      await request(app)
        .post(`/v1/activity/resource/${lessonId}`)
        .set("Cookie", [`${authToken}`])
        .attach("files", testFilePath)
        .field(
          "data",
          JSON.stringify([
            {
              filename: "test.exe",
              label: "Test EXE",
            },
          ])
        )
        .expect(400);
    });
  });
});
