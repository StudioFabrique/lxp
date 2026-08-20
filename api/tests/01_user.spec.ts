import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import User, { type IUser } from "../src/utils/interfaces/db/user.ts";
import app from "../src/app.ts";

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
  let teacherToken = "";
  let studentId = "";
  let studentToken = "";

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

    const teacherLogin = await request(app)
      .post("/v1/auth/login")
      .send({ email: "formateur@studio.eco", password: "Abcdef@123456" });
    teacherToken = teacherLogin.headers["set-cookie"][0];

    const student = await User.findOne({ email: "apprenant@studio.eco" });
    studentId = student?._id.toString();
  });

  describe("Test POST /teacher", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
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
        .expect(401);
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
      expect(res.body.errors).toHaveLength(1);
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
    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/v1/user/contacts").expect(401);
    });
  });

  describe("Test PUT /update-many-status", () => {
    //  No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).put("/v1/user/update-many-status").expect(401);
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

    // Successful update
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
    test("It should respond 401 unauthorized", async () => {
      await request(app).put("/v1/user/update-user-status").expect(401);
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
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .get("/v1/user/list/teacher/lastname/asc?page=1&limit=10")
        .expect(401);
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
    test("It should respond 401 unauthorized", async () => {
      await request(app).put("/v1/user/user-roles").expect(401);
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
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .get(
          "/v1/user/search/teacher/firstname/value/lastname/asc?page=1&limit=10"
        )
        .expect(401);
    });

    // No datas
    test("It should respond 404 not found", async () => {
      await request(app).get("/v1/user/search/?page=1&limit=10").expect(404);
    });

    // Wrong types
    test("It should respond 200 success", async () => {
      await request(app)
        .get(
          "/v1/user/search/teacher/firstname/value/lastname/asc?page=toto&limit=tata"
        )
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    // No data to retrieve
    test("It should respond 200 success", async () => {
      const res = await request(app)
        .get(
          `/v1/user/search/teacher/firstname/toto/lastname/asc?page=1&limit=10`
        )
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.list).toHaveLength(0);
    });

    // Found data
    test("It should respond 200 success", async () => {
      const res = await request(app)
        .get(
          `/v1/user/search/teacher/firstname/raymond/lastname/asc?page=1&limit=10`
        )
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.total).toBeGreaterThan(0);
      expect(res.body.list).toHaveLength(2);
    });

    // Role not found
    test("It should respond 404 not found", async () => {
      const res = await request(app)
        .get(
          `/v1/user/search/toto/firstname/raymond/lastname/asc?page=1&limit=10`
        )
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Le rôle n'existe pas.");
    });

    // Malicious code
    test("It should responde 400 bad request", async () => {
      const res = await request(app)
        .get(
          "/v1/user/search/teacher/firstname/<hacked lol/>/lastname/asc?page=1&limit=10"
        )
        .set("Cookie", [`${authToken}`]);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /last-parcours", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/V1/user/last-parcours").expect(401);
    });

    // User is not a teacher
    test("It should respond 404 not found", async () => {
      const res = await request(app)
        .get("/V1/user/last-parcours")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(
        "L'utilisateur n'existe pas dans la liste des contacts."
      );
    });

    // Successful reading
    test("It should respond 200 success", async () => {
      const res = await request(app)
        .get("/V1/user/last-parcours")
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(200);

      expect(res.body.message).toBe("");
      expect(res.body.response).toHaveLength(1);
      expect(res.body.response[0].title).toBe("Parcours Test 1");
    });
  });

  describe("GET /data/:userId", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/v1/user/data/1").expect(401);
    });

    // Successful reading
    test("It should respond 200 success", async () => {
      const res = await request(app)
        .get(`/v1/user/data/${studentId}`)
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.user.connectionInfos.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("parcours");
    });

    // Wrong userId format
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .get("/v1/user/data/invalid_user_id")
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].msg).toBe("Identifiant d'utilisateur invalide");
    });

    // User not found
    test("It should respond 404 not found", async () => {
      const res = await request(app)
        .get("/v1/user/data/999999999999999999999999")
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("L'apprenant n'existe pas.");
    });

    // User exists but is not a student
    /*
    test("It should respond 404 not found", async () => {
      const teacher = await User.findOne({ email: "formateur@studio.eco" })
        .select("_id")
        .lean();
      const res = await request(app)
        .get(`/v1/user/data/${teacher!._id}`)
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("L'apprenant n'existe pas.");
    });
    */
  });

  describe("GET /own-feedback", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/v1/user/own-feedback").expect(401);
    });

    // Successful reading
    test("It should respond 200 success", async () => {
      const studentLogin = await request(app)
        .post("/v1/auth/login")
        .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" });
      studentToken = studentLogin.headers["set-cookie"][0];

      await request(app).put("/v1/user/update-user-status").send({
        userId: studentId,
        value: true,
      });

      const res = await request(app)
        .get("/v1/user/own-feedback")
        .set("Cookie", [`${studentToken}`]);
      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toBe(null);
    });
  });

  describe("GET /last-feedbacks/:notReviewed", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/v1/user/last-feedbacks/true").expect(401);
    });

    // Successful reading
    test("It should respond 200 success", async () => {
      await request(app)
        .get("/v1/user/last-feedbacks/true")
        .set("Cookie", [`${teacherToken}`])
        .expect(200);
    });

    // Wrong data types
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .get("/v1/user/last-feedbacks/invalid")
        .set("Cookie", [`${teacherToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });
  });

  describe("Test /activate", () => {
    // No datas
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/activate")
        .send({})
        .expect(400);
      expect(res.body.message).toBe("Un token est requis");
    });

    // Invalid token
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/activate")
        .send({ token: 10, password: false });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Ce lien n'est plus valide.");
    });

    // Invalid password
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/activate")
        .send({ token, password: false });
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(2);
    });

    // Malicious code
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "<hacked/>" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });

    // Successful activation
    test("It should respond 200 success", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@123456" })
        .expect(200);
    });

    // Blacklisted token
    test("It should respond 400 bad request", async () => {
      await request(app)
        .post("/v1/user/activate")
        .send({ token, password: "Abcdef@123456" })
        .expect(400);
    });
  });

  describe("PUT /user/invitation/:userId", () => {
    // No authentication
    test("It should respond 401 unauthorized", async () => {
      await request(app).put("/v1/user/invitation/123").expect(401);
    });

    // Successful invitation
    test("It should respond 200 success", async () => {
      await User.updateOne({ _id: studentId }, { $set: { isActive: false } });

      try {
        await request(app)
          .put("/v1/user/invitation/" + studentId)
          .set("Cookie", [`${authToken}`])
          .expect(200);
      } finally {
        await User.updateOne({ _id: studentId }, { $set: { isActive: true } });
      }
    });

    // Invalid userId
    test("It should respond 400 bad request", async () => {
      const res = await request(app)
        .put("/v1/user/invitation/invalid")
        .set("Cookie", [`${authToken}`]);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveLength(1);
    });

    // Not
  });

  /*describe("Test /:role/:stype/:sdir", () => {
  /*
    test("It should respond 401 unauthorized", async () => {
      await request(app)
        .get("/v1/user/teacher/lastname/asc?page=1&limit=10")
        //.set("Cookie", [`${authToken}`])
        .expect(401);
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

    test("It should respond 401 unauthorized", async () => {
      await request(app).get("/v1/user/last-feedbacks/true").expect(401);
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
      await request(app).put(`/v1/user/invitation/${user._id}`).expect(401);
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

  // Unicité de l'adresse email : le doublon était refusé sans que le motif
  // remonte, et rien ne le contrôlait à la modification.
  describe("Unicité de l'adresse email", () => {
    const baseUser = {
      firstname: "camille",
      lastname: "delorme",
      graduations: [],
      links: [],
      hobbies: [],
    };

    const createdEmails = [
      "unicite-creation@studio.eco",
      "unicite-modification@studio.eco",
    ];

    let studentRoleId = "";

    const postUser = (user: Record<string, unknown>) =>
      request(app)
        .post("/v1/user")
        .set("Cookie", [`${authToken}`])
        .field("data", JSON.stringify({ user }));

    beforeAll(async () => {
      const studentRole = await Role.findOne({ rank: 3 });
      studentRoleId = studentRole!._id.toString();
    });

    afterAll(async () => {
      await User.deleteMany({ email: { $in: createdEmails } });
    });

    test("le premier enregistrement passe", async () => {
      await postUser({
        ...baseUser,
        email: createdEmails[0],
        roleId: studentRoleId,
      }).expect(201);
    });

    test("la même adresse est refusée en 409 avec son motif", async () => {
      const res = await postUser({
        ...baseUser,
        email: createdEmails[0],
        roleId: studentRoleId,
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        "Un utilisateur a déjà été enregistré avec cette adresse email."
      );
    });

    test("la même adresse dans une autre casse est refusée aussi", async () => {
      const res = await postUser({
        ...baseUser,
        email: createdEmails[0].toUpperCase(),
        roleId: studentRoleId,
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        "Un utilisateur a déjà été enregistré avec cette adresse email."
      );
    });

    test("reprendre l'adresse d'un autre compte est refusé à la modification", async () => {
      await postUser({
        ...baseUser,
        email: createdEmails[1],
        roleId: studentRoleId,
      }).expect(201);

      const userToUpdate = await User.findOne({ email: createdEmails[1] });

      const res = await request(app)
        .put(`/v1/user/${userToUpdate!._id.toString()}`)
        .set("Cookie", [`${authToken}`])
        .field(
          "data",
          JSON.stringify({
            user: { ...baseUser, email: createdEmails[0] },
          })
        );

      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        "Un autre utilisateur utilise déjà cette adresse email."
      );
    });

    test("conserver sa propre adresse reste possible", async () => {
      const userToUpdate = await User.findOne({ email: createdEmails[1] });

      await request(app)
        .put(`/v1/user/${userToUpdate!._id.toString()}`)
        .set("Cookie", [`${authToken}`])
        .field(
          "data",
          JSON.stringify({
            user: {
              ...baseUser,
              firstname: "camille-marie",
              email: createdEmails[1].toUpperCase(),
            },
          })
        )
        .expect(201);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
