import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.ts";
import { createPrismaClient } from "../src/utils/create-prisma-client.ts";

import mongoConnect from "../src/utils/services/db/mongo-connect.ts";

const prisma = createPrismaClient();

describe("PUT /v1/course/tags/:courseId with Prisma 8", () => {
  let authCookie: string;

  beforeAll(async () => {
    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" })
      .expect(200);
    authCookie = loginResponse.headers["set-cookie"][0];
  });

  afterAll(async () => {
    await prisma.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  test("replaces the course tags without a relation mutation error", async () => {
    const response = await request(app)
      .put("/v1/course/tags/1")
      .set("Cookie", authCookie)
      .send([2, 3])
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      data: { id: 1 },
    });

    const assignments = await prisma.orm.public.TagsOnCourse.where({
      courseId: 1,
    }).all();

    expect(assignments.map(({ tagId }) => tagId).sort()).toEqual([2, 3]);
  });
});
