import request from "supertest";
import app from "../src/app.ts";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import mongoose from "mongoose";
import path from "path";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
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

  // tests/02_formation.spec.ts
  describe("Formation tests", () => {
    test("should pass", () => {
      expect(true).toBe(true);
    });
  });

  // No authentication
  describe("Test GET /formation", () => {
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .get("/v1/formation")
        //.set("Cookie", [`${authToken}`])
        .expect(401);
    });

    // Successful retrieval
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/formation")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  // No authentication
  describe("Test PUT /update-tags", () => {
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .put("/v1/formation/update-tags")
        //.set("Cookie", [`${authToken}`])
        .expect(401);
    });

    // Successful update
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

    // Not found
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

    // Malicous code
    test("It should respond with 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/formation/update-tags")
        .send({
          formationId: 1,
          tags: ["<hacker/>", "<malicious>code</malicious>"],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });
  });

  /**
   * /v1/formation/new-module
   * This route is used to create a new module for a formation.
   * It requires authentication and the user must have the "formation" permission.
   * It accepts a multipart/form-data request with the module data and an optional image file.
   * The module data must include the formationId, title, and description.
   * The image file is optional and must be an image.
   * The route validates the module data and the image file, and then creates the new module
   * in the database.
   * If the module is created successfully, it responds with a 201 status code.
   * If the user does not have the "formation" permission, it responds with a 403 status code.
   * If the module data is invalid, it responds with a 400 status code and an error message.
   * If the image file is not an image, it responds with a 400 status code and an error message.
   * If the formationId does not exist, it responds with a 404 status code.
   * If the module already exists, it responds with a 409 status code.
   */

  describe("Test POST /new-module", () => {
    const filePath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "front",
      "src",
      "assets",
      "images",
      "module-default-thumb.png"
    );

    // No authentication
    test("It should respond 401 unauthorized", async () => {
      const module = {
        formationId: 1,
        parcoursId: 1,
        title: "Random title",
        description: "Description random",
      };
      await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        //.set("Cookie", [`${authToken}`])
        .expect(401);
    });

    // Successful creation with image
    test("It should respond 201 success", async () => {
      const module = {
        formationId: 1,
        parcoursId: 1,
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

    // Successful creation without image
    test("It should response 201 success", async () => {
      const module = {
        formationId: 1,
        parcoursId: 1,
        title: "Second random title",
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
        parcoursId: "toto",
        title: 12,
        description: false,
      };
      const res = await request(app)
        .post("/v1/formation/new-module")
        .field("module", JSON.stringify(module))
        .attach("image", filePath)
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(4);
    });

    // Malicious code
    test("It should respond 400 bad request", async () => {
      const module = {
        formationId: 1,
        parcoursId: 1,
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

  /**
   * /v1/formation
   */

  //No authentication
  describe("Test POST /", () => {
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .post("/v1/formation")
        .send({
          title: "random title",
          description: "random description",
          code: "random code",
          level: "random level",
          tags: [1, 2, 3],
        })
        .expect(401);
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
      expect(res.body.errors).toHaveLength(4);
    });

    // Wrong data types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/formation")
        .send({
          title: 1,
          description: false,
          code: 2,
          level: true,
          tags: "hello world!",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(6);
    });

    // Malicious code
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/formation")
        .send({
          title: "<random title>",
          description: "<hacker/>",
          code: "<script>hacked lol</script>",
          level: "<hack66>hello</hack66>",
          tags: ["<'yo'/>"],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
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

  /** Update formation */

  describe("Test PUT /", () => {
    // Fixtures
    const formation1 = {
      title: "formation 1",
      description: "description 1",
      code: "code 1",
      level: "level 1",
      tags: [1, 2, 3],
    };

    const formation2 = {
      title: "formation 2",
      description: "description 2",
      code: "code 2",
      level: "level 2",
      tags: [1, 2, 3],
    };

    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: "formation1",
            description: "random description",
            code: "random code",
            level: "random level",
            tags: [1, 2, 3],
          },
        })
        .expect(401);
    });

    // Already existing formation
    test("It should respond 409 conflict", async () => {
      // Recording fixtures
      const result = await prisma.formation.create({
        data: {
          ...formation1,
          admin: { connect: { id: 1 } },
          tags: {
            create: [
              { tag: { connect: { id: 1 } } },
              { tag: { connect: { id: 2 } } },
              { tag: { connect: { id: 3 } } },
            ],
          },
        },
      });
      await prisma.formation.create({
        data: {
          ...formation2,
          admin: { connect: { id: 1 } },
          tags: {
            create: [
              { tag: { connect: { id: 1 } } },
              { tag: { connect: { id: 2 } } },
              { tag: { connect: { id: 3 } } },
            ],
          },
        },
      });

      await request(app)
        .put(`/v1/formation/${result.id}`)
        .send({
          formation: {
            title: "formation 2",
            description: "random",
            code: "random",
            level: "random",
            tags: [1, 2, 3],
          },
        })
        .set("Cookie", [`${authToken}`])
        .expect(409);
    });

    // Missng data
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/formation/1")
        .send({ formation: {} })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(4);
    });

    // Wrong data types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/formation/1")
        .send({
          formation: {
            title: 1,
            description: false,
            code: 2,
            level: true,
            tags: ["hello world!"],
          },
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(5);
    });
  });
});
