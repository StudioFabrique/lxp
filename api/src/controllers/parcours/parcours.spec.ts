import request from "supertest";
import app from "../../app";
import dotenv from "dotenv";
import mongoConnect from "../../utils/services/db/mongo-connect";
import { PrismaClient } from "@prisma/client";
import { blobParcours } from "../../utils/tests/blob-parcours";
import mongoose from "mongoose";

dotenv.config();

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

let tags: any;
let contacts: any;
const image = blobParcours;
let title: string;

async function getTags() {
  return await prisma.tag.findMany();
}

async function getContacts() {
  return await prisma.teacher.findMany();
}

async function getParcours() {
  const parcours = await prisma.parcours.findMany();
  if (parcours && parcours.length === 0) {
    await prisma.parcours.create({
      data: {
        title: "test",
        formation: {
          connect: { id: 1 },
        },
        admin: {
          connect: { id: 1 },
        },
      },
    });
  }
  return parcours;
}

async function getFormation() {
  return await prisma.formation.findMany();
}

describe("HTTP PARCOURS", () => {
  let authToken = {}; // Store the authentication token

  beforeAll(async () => {
    await mongoConnect();
    tags = (await getTags()).map((item) => item.id);
    contacts = (await getContacts()).map((item: any) => item.id);

    // Perform any setup before running the tests, such as logging in and obtaining the authentication token
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "toto@toto.fr", password: "Abcdef@123456" });

    authToken = loginResponse.headers["set-cookie"][0];
  });

  describe("Test GET /user/contacts", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/user/contacts")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  /**
   * test POST-CREATE-PARCOURS
   */

  //  jeu de données valides
  describe("Test POST /parcours", () => {
    test("It should respond with 201 success", async () => {
      const parcours = await getParcours();

      if (parcours && parcours.length > 0) {
        console.log(`${parcours[0].title}-${parcours.length}`);

        title = `${parcours[0].title}-${parcours.length + 1}`;
      } else {
        title = "test-1";
      }
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          title: title,
          formation: 1,
        })
        .expect(201);
    });
  });

  // jeux de données non valides

  // le titre du parcours existe déjà
  describe("Test POST /parcours", () => {
    test("It should respond with 500 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          title: title,
          formation: 1,
        })
        .expect(500);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          title: 0,
          formation: 1,
        })
        .expect(400);
    });
  });

  describe("Test POST /parcours", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", [`${authToken}`])
        .send({
          title: "foo",
          formation: "<hacked>trolololol</hacked>",
        })
        .expect(400);
    });
  });

  /**
   * GET PARCOURS BY ID
   */

  describe("Test GET /parcours-by-id/:parcoursId", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/v1/parcours/parcours-by-id/1")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test GET /parcours-by-id/:parcoursId", () => {
    test("It should respond with 500 failure", async () => {
      const parcours = await getParcours();
      const id = parcours[parcours.length - 1].id + 1;
      await request(app)
        .get(`/v1/parcours/parcours-by-id/${id}`)
        .set("Cookie", [`${authToken}`])
        .expect(500);
    });
  });

  describe("Test GET /parcours-by-id/:parcoursId", () => {
    test("It should respond with 400 failure", async () => {
      await request(app)
        .get(`/v1/parcours/parcours-by-id/foo`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  /**
   * GET PARCOURS BY FORMATION
   */

  describe("Test Get /parcours-by-formation", () => {
    test("It should respond 200 success", async () => {
      const parcours = await getParcours();
      const id = parcours[0].formationId;
      await request(app)
        .get(`/v1/parcours/parcours-by-formation/${id}`)
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });
  });

  describe("Test Get /parcours-by-formation", () => {
    test("It should respond 404 failure", async () => {
      const formations = await getFormation();
      const id = formations[formations.length - 1].id + 1;

      await request(app)
        .get(`/v1/parcours/parcours-by-formation/${id}`)
        .set("Cookie", [`${authToken}`])
        .expect(404);
    });
  });

  describe("Test Get /parcours-by-formation", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .get(`/v1/parcours/parcours-by-formation/foo`)
        .set("Cookie", [`${authToken}`])
        .expect(400);
    });
  });

  /**
   * PUT UPDATE INFOS
   */

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 201 success", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1,
          title: "foo",
          description: "bar",
          formation: 1,
        })
        .expect(201);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: "toto",
          title: "<hacker>",
          description: "bar",
          formation: 1,
        })
        .expect(400);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1,
          title: 1,
          description: "bar",
          formation: 1,
        })
        .expect(400);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1,
          title: "foo",
          description: 1,
          formation: 1,
        })
        .expect(400);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1,
          title: "foo",
          description: "bar",
          formation: "test",
        })
        .expect(400);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1000000000,
          title: "foo",
          description: "bar",
          formation: 1,
        })
        .expect(500);
    });
  });

  describe("Test Put /parcours/update-infos", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-infos")
        .set("Cookie", [`${authToken}`])
        .send({
          parcoursId: 1,
          title: "foo",
          description: "bar",
          formation: 1000000000,
        })
        .expect(500);
    });
  });

  /**
   * UPDATE PARCOURS DATES
   */

  describe("Test Put /parcoours/update-dates", () => {
    test("It should respond 201 success", async () => {
      await request(app)
        .put("/v1/parcours/update-dates")
        .send({
          parcoursId: 1,
          startDate: "1947-10-14",
          endDate: "2000-01-01",
        })
        .expect(201);
    });
  });

  describe("Test Put /parcoours/update-dates", () => {
    test("It should respond 400 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-dates")
        .send({
          parcoursId: "foo",
          startDate: "1947-10-14",
          endDate: "2000-01-01",
        })
        .expect(400);
    });
  });

  describe("Test Put /parcoours/update-dates", () => {
    test("It should respond 500 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-dates")
        .send({
          parcoursId: 1,
          startDate: "1947-10-14",
          endDate: "foo",
        })
        .expect(400);
    });
  });

  describe("Test Put /parcoours/update-dates", () => {
    test("It should respond 500 failure", async () => {
      await request(app)
        .put("/v1/parcours/update-dates")
        .send({
          parcoursId: 1000000000,
          startDate: "1947-10-14",
          endDate: "2000-01-01",
        })
        .expect(500);
    });
  });

  afterAll(async () => {
    // Fermer la connexion à MongoDB
    await disconnect();
  });
});
