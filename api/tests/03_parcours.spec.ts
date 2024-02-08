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

describe("HTTP Parcours", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  describe("Test POST /", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: 1,
          title: "web dev - 2024",
        })
        .expect(403);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          //formation: 1,
          title: "web dev - 2024",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: 1,
          //title: "web dev - 2024",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: 100,
          title: "web dev - 2024",
        })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: "toto",
          title: "web dev - 2024",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: 1,
          title: "<hacked>lol</hacked>",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 201 created", async () => {
      await request(app)
        .post("/v1/parcours")
        .send({
          formation: 1,
          title: "Web Dev - 2024",
        })
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });
  });

  describe("Test GET /", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/parcours").expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test DELETE /:parcoursId", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).delete(`/v1/parcours/1`).expect(403);
    });

    test("It should respond 200 success", async () => {
      const parcours: any = await request(app)
        .post("/v1/parcours")
        .send({ formation: 2, title: "CDA - 2026" })
        .set("Cookie", [`${authToken}`]);
      const id = JSON.parse(parcours.text).parcoursId;

      await request(app)
        .delete(`/v1/parcours/${id}`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .delete(`/v1/parcours/toto`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .delete(`/v1/parcours/1000`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test GET /parcours-by-formation/:formationId", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-formation/1")
        .expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-formation/1000")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-formation/toto")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-formation")
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test GET /parcours-by-id/:parcoursId", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/parcours/parcours-by-id/1").expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-id/1")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-id/10000")
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-id/toto")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-id/")
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test PUT /update-infos", () => {
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/parcours/update-infos").expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          //parcoursId: 1,
          title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: "<hacked>oops</hacked>>",
          title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          //parcoursId: "<hacked>oops</hacked>>",
          title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 10000,
          title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          //title: "update-infos test",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "<hacked>oops</hacked>",
          description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          //description: "random description",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          description: "<hacked>oops</hacked>>",
          formation: 1,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          description: "random description",
          formation: "toto",
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          description: "random description",
          formation: 10000,
          visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          description: "random description",
          formation: 1,
          //visibility: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .send({
          parcoursId: 1,
          title: "random title",
          description: "random description",
          formation: 1,
          visibility: "toto",
        })
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
