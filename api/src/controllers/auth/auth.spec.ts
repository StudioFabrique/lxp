import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
import mongoConnect from "../../utils/services/db/mongoConnect";
dotenv.config();

describe("AUTH API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  //  connexion admin formateur avec des identifiants corrects
  describe("Test POST /auth", () => {
    test("it should respond with 200 success", async () => {
      await request(app).post("/v1/auth/user/login").expect(200).send({
        email: "toto@toto.fr",
        password: "Abcdef@123456",
      });
    });
  });

  //  connexion admin formateur avec des identifiants incorrects
  describe("Test POST /auth", () => {
    test("it should respond with 401 failure", async () => {
      await request(app).post("/v1/auth/user/login").expect(401).send({
        email: "toto@toto.frr",
        password: "Abcdef@123456",
      });
    });
  });

  //  connexion admin formateur avec des identifiants incorrects
  describe("Test POST /auth", () => {
    test("it should respond with 401 failure", async () => {
      await request(app).post("/v1/auth/user/login").expect(401).send({
        email: "toto@toto.fr",
        password: "Abcdef@12",
      });
    });
  });

  //  connexion apprenant avec des identifiants corrects
  describe("Test POST /auth", () => {
    test("it should respond with 200 success", async () => {
      await request(app).post("/v1/auth/student/login").expect(200).send({
        email: "test@toto.fr",
        password: "Abcdef@123456",
      });
    });
  });

  //  connexion apprenant avec des identifiants incorrects
  describe("Test POST /auth", () => {
    test("it should respond with 401 failure", async () => {
      await request(app).post("/v1/auth/student/login").expect(401).send({
        email: "test@toto.frr",
        password: "Abcdef@123456",
      });
    });
  });

  //  connexion apprenant avec des identifiants incorrects
  describe("Test POST /auth", () => {
    test("it should respond with 401 failure", async () => {
      await request(app).post("/v1/auth/student/login").expect(401).send({
        email: "test@toto.fr",
        password: "Abcdef@12",
      });
    });
  });
});
