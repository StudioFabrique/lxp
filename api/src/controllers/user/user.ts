import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../../utils/interfaces/db/user";

const MONGO_URL = "mongodb://127.0.0.1:27017/lxp-tests";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

async function deleteUser() {
  await User.deleteMany({ lastname: "martinot" });
}

describe("HTTP USER", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    await mongoConnect();
    // Perform any setup before running the tests, such as logging in and obtaining the authentication token
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "toto@toto.fr", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
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
        .get("/v1/user/1/lastname/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/admin/1/asc?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  describe("Test GET /user/", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get("/v1/user/student/lastname/1?page=1&limit=10")
        .set("Cookie", [`${authToken}`])
        .expect(400);
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

  /**
   * POST TEACHER
   */

  describe("Test POST /postTeacher", () => {
    test("It should responde 201 success", async () => {
      await request(app)
        .post("/v1/user/new-teacher")
        .set("Cookie", [`${authToken}`])
        .send({
          email: "rita@toto.fr",
          firstname: "ernestine",
          lastname: "martinot",
          nickname: "",
          address: "57 rue du dr lagourge",
          city: "pau",
          postCode: "64000",
          phoneNumber: "0559879765",
          isActive: true,
        })
        .expect(201);
    });

    describe("Test POST /postTeacher", () => {
      test("It should responde 500 failure", async () => {
        await request(app)
          .post("/v1/user/new-teacher")
          .set("Cookie", [`${authToken}`])
          .send({
            email: "rita@toto.fr",
            firstname: "ernestine",
            lastname: "martinot",
            nickname: "",
            address: "57 rue du dr lagourge",
            city: "pau",
            postCode: "64000",
            phoneNumber: "0559879765",
            isActive: true,
          })
          .expect(500);
      });

      describe("Test POST /postTeacher", () => {
        test("It should responde 400 failure", async () => {
          await request(app)
            .post("/v1/user/new-teacher")
            .set("Cookie", [`${authToken}`])
            .send({
              email: 1,
              firstname: "ernestine",
              lastname: "martinot",
              nickname: "",
              address: "57 rue du dr lagourge",
              city: "pau",
              postCode: "64000",
              phoneNumber: "0559879765",
              isActive: true,
            })
            .expect(400);
        });

        describe("Test POST /postTeacher", () => {
          test("It should responde 400 failure", async () => {
            await request(app)
              .post("/v1/user/new-teacher")
              .set("Cookie", [`${authToken}`])
              .send({
                email: "rita1@toto.fr",
                firstname: 1,
                lastname: "martinot",
                nickname: "",
                address: "57 rue du dr lagourge",
                city: "pau",
                postCode: "64000",
                phoneNumber: "0559879765",
                isActive: true,
              })
              .expect(400);
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: 1,
                  nickname: "",
                  address: "57 rue du dr lagourge",
                  city: "pau",
                  postCode: "64000",
                  phoneNumber: "0559879765",
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: 1,
                  address: "57 rue du dr lagourge",
                  city: "pau",
                  postCode: "64000",
                  phoneNumber: "0559879765",
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: "",
                  address: 1,
                  city: "pau",
                  postCode: "64000",
                  phoneNumber: "0559879765",
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: "",
                  address: "57 rue du dr lagourge",
                  city: 1,
                  postCode: "64000",
                  phoneNumber: "0559879765",
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: "",
                  address: "57 rue du dr lagourge",
                  city: "pau",
                  postCode: 1,
                  phoneNumber: "0559879765",
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: "",
                  address: "57 rue du dr lagourge",
                  city: "pau",
                  postCode: "64000",
                  phoneNumber: 1,
                  isActive: true,
                })
                .expect(400);
            });
          });

          describe("Test POST /postTeacher", () => {
            test("It should responde 400 failure", async () => {
              await request(app)
                .post("/v1/user/new-teacher")
                .set("Cookie", [`${authToken}`])
                .send({
                  email: "rita@toto.fr",
                  firstname: "ernestine",
                  lastname: "martinot",
                  nickname: "",
                  address: "57 rue du dr lagourge",
                  city: "pau",
                  postCode: "64000",
                  phoneNumber: "0559879765",
                  isActive: "foo",
                })
                .expect(400);
            });
          });

          afterAll(async () => {
            await deleteUser();
            // Fermer la connexion à MongoDB
            await disconnect();
          });
        });
      });
    });
  });
});
