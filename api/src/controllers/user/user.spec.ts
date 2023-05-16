import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
dotenv.config();
import mongoConnect from "../../utils/services/db/mongo-connect";

describe("HTTP Handshake", () => {
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

  //  avec un jeu de données valides
  describe("Test GET /user/", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/user/admin/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  //  avec des jeux de données non valides

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/foo/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/<hacked>/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/user/student/<hacked>/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/student/lastname/asc?page=foo&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/student/lastname/asc?page=1&limit=foo")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  //    mise à jour du rôle des utilisateurs  avec des données valides
  describe("Test PUT /user/student-roles", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .put("/v1/user/student-roles")
        .set("Cookie", [`${authToken}`])
        .send({
          studentsToUpdate: [
            "645f953fbbc796bb65fa368e",
            "645f953fbbc796bb65fa3688",
            "645f953fbbc796bb65fa3679",
            "645f953fbbc796bb65fa368d",
            "645f953fbbc796bb65fa365d",
            "645f953fbbc796bb65fa3657",
            "645f953fbbc796bb65fa3639",
            "645f953fbbc796bb65fa364f",
            "645f953fbbc796bb65fa3649",
            "645f953fbbc796bb65fa3669",
          ],
          rolesId: ["645f953ebbc796bb65fa35f5"],
        })
        .expect(201);
    });
  });

  //    mise à jour du rôle des utilisateurs  avec des données nonvalides
  describe("Test PUT /user/student-roles", () => {
    test("It should respond with 500 server issue", async () => {
      await request(app)
        .put("/v1/user/student-roles")
        .set("Cookie", [`${authToken}`])
        .send({
          studentsToUpdate: [
            "foo",
            "645f953fbbc796bb65fa3688",
            "645f953fbbc796bb65fa3679",
            "645f953fbbc796bb65fa368d",
            "645f953fbbc796bb65fa365d",
            "645f953fbbc796bb65fa3657",
            "645f953fbbc796bb65fa3639",
            "645f953fbbc796bb65fa364f",
            "645f953fbbc796bb65fa3649",
            "645f953fbbc796bb65fa3669",
          ],
          rolesId: ["645f953ebbc796bb65fa35f5"],
        })
        .expect(500);
    });
  });

  describe("Test PUT /user/student-roles", () => {
    test("It should respond with 500 server issue", async () => {
      await request(app)
        .put("/v1/user/student-roles")
        .set("Cookie", [`${authToken}`])
        .send({
          studentsToUpdate: [
            "645f953fbbc796bb65fa368e",
            "645f953fbbc796bb65fa3688",
            "645f953fbbc796bb65fa3679",
            "645f953fbbc796bb65fa368d",
            "645f953fbbc796bb65fa365d",
            "645f953fbbc796bb65fa3657",
            "645f953fbbc796bb65fa3639",
            "645f953fbbc796bb65fa364f",
            "645f953fbbc796bb65fa3649",
            "645f953fbbc796bb65fa3669",
          ],
          rolesId: ["bar"],
        })
        .expect(500);
    });
  });

  describe("Test PUT /user/student-roles", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .put("/v1/user/student-roles")
        .set("Cookie", [`${authToken}`])
        .send({
          rolesId: ["645f953ebbc796bb65fa35f5"],
        })
        .expect(400);
    });
  });

  describe("Test PUT /user/student-roles", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .put("/v1/user/student-roles")
        .set("Cookie", [`${authToken}`])
        .send({
          studentsToUpdate: [
            "645f953fbbc796bb65fa368e",
            "645f953fbbc796bb65fa3688",
            "645f953fbbc796bb65fa3679",
            "645f953fbbc796bb65fa368d",
            "645f953fbbc796bb65fa365d",
            "645f953fbbc796bb65fa3657",
            "645f953fbbc796bb65fa3639",
            "645f953fbbc796bb65fa364f",
            "645f953fbbc796bb65fa3649",
            "645f953fbbc796bb65fa3669",
          ],
        })
        .expect(400);
    });
  });
});
