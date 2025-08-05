import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import mongoose from "mongoose";
import path from "path";
import exp from "constants";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const MONGO_TEST_URL = process.env.MONGO_TEST_URL;

describe("HTTP Formation", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });
  /*
  describe("Test GET /formation", () => {
    test("It should respond with 403 forbidden", async () => {
      await request(app)
        .get("/v1/formation")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });

    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/formation")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test PUT /update-tags", () => {
    test("It should respond with 403 forbidden", async () => {
      await request(app)
        .put("/v1/formation/update-tags")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });

    test("It should respond with 200 success", async () => {
      await request(app)
        .put("/v1/formation/update-tags")
        .send({
          formationId: 1,
          tags: [29, 30],
        })
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond with 404 not found", async () => {
      await request(app)
        .put("/v1/formation/update-tags")
        .send({
          formationId: 50,
          tags: [29, 30],
        })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    // missing datas
    test("It should respond with 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/formation/update-tags")
        .send({})
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // wrong data types
    test("It should respond with 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/formation/update-tags")
        .send({
          formationId: "toto",
          tags: ["tata", "titi"],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(3);
    });
  });

  describe("Test POST /new-module", () => {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "tests",
      "test-image.png"
    );

       test("It should respond 403 forbidden", async () => {
      const module = {
        formationId: 1,
        title: "Random title",
        description: "Description random",
      };
      await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });

    test("It should respond 201 success", async () => {
      const module = {
        formationId: 1,
        title: "Random title",
        description: "Description random",
      };
      await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    // same as before without an image file
    test("It should response 201 success", async () => {
      const module = {
        formationId: 1,
        title: "Random title",
        description: "Description random",
      };
      await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    // Datas are missing
    test("It should respond 400 bad request", async () => {
      const module = {};
      const res = await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(3);
    });

    // Wrong data types
    test("It should respond 400 bad request", async () => {
      const module = {
        formationId: "toto",
        title: 12,
        description: false,
      };
      const res = await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(3);
    });*/
  /*
    // Malicious code
    test("It should respond 400 bad request", async () => {
      const module = {
        formationId: 1,
        title: "<hacked>lol</hacked>",
        description: "<malicious>code</malicious>",
      };
      const res = await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });
  });
*/

  //No authentication
  describe("Test POST /", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .expect(403);
    });

    // Already existing formation
    test("It should respond 409 conflict", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "Développeur Web",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(409);
    });

    // Missing data
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/formation")
        .send({})
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(5);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "<hacker/>",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "<hacker/>",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",

          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "<hacker/>",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "<hacker/>",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: ["toto", 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: ["<hacker/>", 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 201 success", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });
  });

  describe("Test PUT /", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .expect(403);
    });

    /*     test("It should respond 409 conflict", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "Développeur Web",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(409);
    }); */

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "<hacker/>",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "<hacker/>",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",

            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "<hacker/>",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "random code",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "random code",
            level: "<hacker/>",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: ["toto", 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "random title",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: ["<hacker/>", 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "not random title",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
