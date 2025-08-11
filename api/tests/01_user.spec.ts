import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import mongoConnect from "../src/utils/services/db/mongo-connect";
import Role from "../src/utils/interfaces/db/role";
import User, { IUser } from "../src/utils/interfaces/db/user";
import app from "../src/app";
const originalPrismaClient = require("@prisma/client").PrismaClient;

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const MONGO_TEST_URL = process.env.MONGO_TEST_URL;

describe("HTTP /user", () => {
  let authToken = {}; // Store the authentication token
  let token = "";

  beforeAll(async () => {
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token

    await mongoConnect();
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
    const role = await Role.findOne({ role: "admin" });
    const user = await User.findOne({ email: "admin@studio.eco" });
    token = jwt.sign(
      { userId: user!._id, userRoles: [role] },
      process.env.REGISTER_SECRET!,
      { expiresIn: "7d" }
    );
  });

  describe("Test POST /teacher", () => {
    // No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .expect(403);
    });

    // With authentication, successful writing
    test("it should responde 201 success", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(201);
    });

    // Missing fields
    test("it should responde 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/new-teacher")
        .send({})
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(3);
    });

    // Wrong email format
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto-toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });

    // Wrong field types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: true,
          firstname: 1,
          lastname: 3,
          nickname: 3,
          address: false,
          postCode: 64000,
          city: true,
          phoneNumber: 4,
          isActive: "toto",
        })
        .set("Cookie", [`${authToken}`]);

      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(9);
    });

    // Malicious code
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "<hacked/>",
          firstname: "<ernestine>",
          lastname: "<martinot>",
          nickname: "<Toto666/>",
          address: "<57 rue du dr lagourge>",
          postCode: "<64000>",
          city: "<pau>",
          phoneNumber: "<+33559879765>",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(8);
    });

    // Existing email
    test("It should respond 409 conflict", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .send({
          email: "toto@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          address: "57 rue du dr lagourge",
          postCode: "64000",
          city: "pau",
          phoneNumber: "+33559879765",
          isActive: true,
        })
        .set("Cookie", [`${authToken}`])
        .expect(409);
    });

    // TODO tests pour transaction distribuée failure
  });

  // Successful reading
  describe("Test GET /contacts", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/user/contacts")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    // Not authenticated
    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/user/contacts").expect(403);
    });
  });

  describe("Test PUT /update-many-status", () => {
    //  No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/user/update-many-status").expect(403);
    });

    // Missing datas
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-many-status")
        .send({})
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(3);
    });

    // Wrong types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-many-status")
        .send({
          usersIds: 42,
          status: "not_a_boolean",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Wrong ids types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-many-status")
        .send({
          usersIds: ["invalid_id"],
          status: "actif",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });

    test("It should respond 201 success", async () => {
      const users = await User.find({});
      const res = await request(app)
        .put("/v1/user/update-many-status")
        .send({
          usersIds: users.map((user) => user._id),
          status: "actif",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(201);
    });

    //  Malicious code
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-many-status")
        .send({
          usersIds: ["<hacked>"],
          status: "<hacked>",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });
  });

  describe("PUT /update-user-status", () => {
    // No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/user/update-user-status").expect(403);
    });

    // Missing datas
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-user-status")
        .send({})
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Wrong types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-user-status")
        .send({
          userId: 1,
          value: "not_a_boolean",
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Wrong ids types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/update-user-status")
        .send({
          userId: ["invalid_id"],
          value: true,
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });

    // Successful update
    test("It should respond 201 success", async () => {
      const users = await User.find({});
      const res = await request(app)
        .put("/v1/user/update-user-status")
        .send({
          userId: users[1]._id,
          value: true,
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        `Le compte de l'utilisateur ${users[1].email} a été activé.`
      );
    });

    // Failure own status update
    test("It should respond 400 bad request", async () => {
      const users = await User.find({});
      const res = await request(app)
        .put("/v1/user/update-user-status")
        .send({
          userId: users[0]._id,
          value: true,
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Vous ne pouvez pas changer le statut de votre propre compte."
      );
    });
  });

  describe("GET /:role/:stype/:sdir", () => {
    // No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/user/list/teacher/lastname/asc?page=1&limit=10")
        .expect(403);
    });

    // Missing datas
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .get("/v1/user/list/teacher/lastname/asc")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
      //expect(res.body.errors).toHaveLength(3);
    });

    // Wrong types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .get("/v1/user/list/teacher/lastname/asc?page=toto&limit=false")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Malicious code
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .get(
          "/v1/user/list/teacher/lastname/asc?page=<hacker/>>&limit=<hacker/>"
        )
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Not role found
    test("It should respond 404 not found", async () => {
      const res = await request(app)
        .get("/v1/user/list/toto/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Aucun rôle trouvé.");
    });
  });

  describe("PUT /user-roles", () => {
    // No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app).put("/v1/user/user-roles").expect(403);
    });

    // No datas in the request body
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/user-roles")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(4);
    });

    // Empty lists in the request body
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({ usersToUpdate: [], rolesId: [] })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Wrong types for arrays elements
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: [1, 2, 3],
          rolesId: ["not_a_mongo_id"],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(4);
    });

    // Malicious code in arrays
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: ["<hacked/>"],
          rolesId: ["<hacked/>"],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Successful update
    test("It should respond 200 success", async () => {
      const studentRole = await Role.findOne({ role: "student" }, { _id: 1 });
      const students = await User.find({ roles: { $in: studentRole } });

      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: students.map((user: any) => user._id),
          rolesId: [studentRole!._id],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(200);
    });

    // Unauthorized role for user - a student cant become an admin
    test("It should respond 400 bad request", async () => {
      const studentRole = await Role.findOne({ role: "student" }, { _id: 1 });
      const adminRole = await Role.findOne({ role: "admin" }, { _id: 1 });
      const students = await User.find({ roles: { $in: studentRole } });

      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: students.map((user: any) => user._id),
          rolesId: [adminRole!._id],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour."
      );
    });

    // Unauthorized role for user - an admin cant become a student
    test("It should respond 400 bad request", async () => {
      const studentRole = await Role.findOne({ role: "student" }, { _id: 1 });
      const adminRole = await Role.findOne({ role: "admin" }, { _id: 1 });
      const admins = await User.find({ roles: { $in: adminRole } });

      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: admins.map((user: any) => user._id),
          rolesId: [studentRole!._id],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour."
      );
    });

    // Role not found
    test("It should responde 404 not found", async () => {
      const studentRole = await Role.findOne({ role: "student" }, { _id: 1 });
      const users = await User.find({ roles: { $in: studentRole } });
      const nonExistingRole = users![0]._id;
      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: users.map((user: any) => user._id),
          rolesId: [nonExistingRole!],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Aucun rôle trouvé avec les ID fournis.");
    });

    // Some users not found
    test("It should responde 404 not found", async () => {
      const studentRole = await Role.findOne({ role: "student" }, { _id: 1 });
      let users = (await User.find(
        { roles: { $in: studentRole } },
        { _id: 1 }
      )) as { _id: string }[];

      users = [...users, { _id: studentRole!._id }];

      const res = await request(app)
        .put("/v1/user/user-roles")
        .send({
          usersToUpdate: users.map((user: any) => user._id),
          rolesId: [studentRole!._id],
        })
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(
        "Un ou plusieurs utilisateurs n'existent pas."
      );
    });
  });

  describe("GET / /search/:role/:entity/:value/:stype/:sdir", () => {
    // No authentication
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/user/search/teacher/value/lastname/asc?page=1&limit=10")
        .expect(403);
    });
  });

  /*describe("Test /:role/:stype/:sdir", () => {
  /*
    test("It should respond 403 forbidden", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=1&limit=10")
        //.set("Cookie", [`${authToken}`])
        .expect(403);
    });

    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/<hacked>lol/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/<hacked>lol/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/<hacked>lol?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=toto&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  // en tant que formateur
  describe("Test /last-feedbacks", () => {
    test("It should respond 200 success", async () => {
      await mongoConnect();
      const loginResponse = await request(app)
        .post("/v1/auth/login")
        .send({ email: "formateur@studio.eco", password: "Abcdef@123456" });

      authToken = loginResponse.headers["set-cookie"][0];
      await request(app)
        .get("/v1/user/last-feedbacks/true")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 forbidden", async () => {
      await request(app).get("/v1/user/last-feedbacks/true").expect(403);
    });
  });

  describe("Test /activate", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: token, password: "Abcdef@123456" })
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: "", password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token: "<hacked ! />", password: "Abcdef@123456" })
        .expect(400);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@<hacked !/>" })
        .expect(400);
    });
  });

  describe("Test /invitation/:userId", () => {
    test("It should respond 200 success", async () => {
      const loginResponse = await request(app)
        .post("/v1/auth/login")
        .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

      authToken = loginResponse.headers["set-cookie"][0];
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/${user._id}`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    test("It should respond 403 not authorized", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation2@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app).put(`/v1/user/invitation/${user._id}`).expect(403);
    });

    test("It should respond 404 not found", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation3@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/${role!._id}`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation4@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      await request(app)
        .put(`/v1/user/invitation/toto`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test /check-invitation", () => {
    test("It should respond 200 success", async () => {
      const role = await Role.findOne({ role: "admin" });
      const user = await User.create({
        email: "invitation5@test.fr",
        firstname: "invitation",
        lastname: "test",
        isActive: false,
        roles: [role],
      });
      token = jwt.sign(
        { userId: user._id, userRoles: [role] },
        process.env.REGISTER_SECRET!,
        { expiresIn: "7d" }
      );
      await request(app)
        .post("/v1/user/check-invitation")
        .send({ token })
        .expect(200);
    });

    test("It should respond 400 bad reques", async () => {
      await request(app).post("/v1/user/check-invitation").expect(400);
    });

    test("It should respond 400 bad reques", async () => {
      await request(app)
        .post("/v1/user/check-invitation")
        .send({ token: "toto" })
        .expect(400);
    });
  });

  describe("Test /check-email", () => {
    test("It should respond 200 success", async () => {
      await request(app)
        .post("/v1/user/check-email")
        .send({ email: "admin@studio.eco" })
        .expect(200);
    });

    test("It should respond 400 bad request", async () => {
      await request(app).post("/v1/user/check-email").expect(400);
    });

    test("It should respond 404 not found", async () => {
      await request(app)
        .post("/v1/user/check-email")
        .send({ email: "zoubida3000@toto.fr" })
        .expect(404);
    });

    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/check-email")
        .send({ email: "<hacker/>@toto.fr" })
        .expect(400);
    });
  });*/

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
