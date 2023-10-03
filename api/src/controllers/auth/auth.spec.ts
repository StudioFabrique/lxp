import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
dotenv.config();
import mongoConnect from "../../utils/services/db/mongo-connect";

describe("HTTP Handshake and Roles", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    await mongoConnect();
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token
    const loginResponse = await request(app)
      .post("/v1/auth/login/user")
      .send({ email: "toto@toto.fr", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  afterAll(async () => {
    // Perform any cleanup after running the tests, such as logging out or closing database connections
    // ...
  });

  //  avec cookie d'authentification
  describe("Test GET /auth/handshake", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/auth/handshake")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  //  sans cookie d'authentification
  describe("Test GET /auth/handshake", () => {
    test("It should respond with 403 failure", async () => {
      await request(app)
        .get("/v1/auth/handshake")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });
  });

  //  avec cookie d'authentification
  describe("Test GET /auth/roles", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/auth/roles")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  //  sans cookie d'authentification
  describe("Test GET /auth/roles", () => {
    test("It should respond with 403 failure", async () => {
      await request(app)
        .get("/v1/auth/roles")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });
  });
});
