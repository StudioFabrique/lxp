import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import { INDICATORS } from "../src/models/indicators/get-all-indicators.ts";

const EXPECTED_KEYS = Object.keys(INDICATORS);

async function login(email: string) {
  const response = await request(app)
    .post("/v1/auth/login")
    .send({ email, password: "Abcdef@123456" })
    .expect(200);

  return {
    cookie: response.headers["set-cookie"],
    userId: response.body._id as string,
  };
}

describe("GET /v1/indicators/:userId", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("refuse une requête sans session", async () => {
    await request(app)
      .get("/v1/indicators/000000000000000000000000")
      .expect(401);
  });

  it("rejette un identifiant qui n'est pas un ObjectId", async () => {
    const admin = await login("admin@studio.eco");

    await request(app)
      .get("/v1/indicators/pas-un-objectid")
      .set("Cookie", admin.cookie)
      .expect(400);
  });

  it("renvoie tous les indicateurs à un administrateur", async () => {
    const admin = await login("admin@studio.eco");
    const student = await login("apprenant@studio.eco");

    const response = await request(app)
      .get(`/v1/indicators/${student.userId}`)
      .set("Cookie", admin.cookie)
      .expect(200);

    expect(Object.keys(response.body.indicators).sort()).toEqual(
      EXPECTED_KEYS.sort(),
    );
    expect(response.body.userId).toBe(student.userId);
    expect(typeof response.body.from).toBe("string");
    expect(typeof response.body.to).toBe("string");
  });

  it("donne à chaque indicateur une disponibilité explicite", async () => {
    const admin = await login("admin@studio.eco");
    const student = await login("apprenant@studio.eco");

    const response = await request(app)
      .get(`/v1/indicators/${student.userId}`)
      .set("Cookie", admin.cookie)
      .expect(200);

    for (const [key, indicator] of Object.entries<any>(
      response.body.indicators,
    )) {
      expect(typeof indicator.available).toBe("boolean");
      // Un indicateur indisponible ne doit jamais afficher un zéro trompeur.
      if (!indicator.available) expect(indicator.value).toBeNull();
      expect(indicator.key).toBe(key);
    }
  });

  it("autorise un apprenant à consulter ses propres indicateurs", async () => {
    const student = await login("apprenant@studio.eco");

    await request(app)
      .get(`/v1/indicators/${student.userId}`)
      .set("Cookie", student.cookie)
      .expect(200);
  });

  it("interdit à un apprenant de consulter ceux d'un autre", async () => {
    // `stats:read` est accordé aux apprenants pour leur propre suivi : sans
    // contrôle d'appartenance, n'importe lequel lirait les données des autres.
    const student = await login("apprenant@studio.eco");
    const other = await login("rssi@studio.eco");

    await request(app)
      .get(`/v1/indicators/${other.userId}`)
      .set("Cookie", student.cookie)
      .expect(403);
  });

  it("accepte une fenêtre temporelle explicite", async () => {
    const admin = await login("admin@studio.eco");
    const student = await login("apprenant@studio.eco");

    const response = await request(app)
      .get(`/v1/indicators/${student.userId}`)
      .query({ from: "2026-01-01T00:00:00.000Z", to: "2026-02-01T00:00:00.000Z" })
      .set("Cookie", admin.cookie)
      .expect(200);

    expect(response.body.from).toBe("2026-01-01T00:00:00.000Z");
    expect(response.body.to).toBe("2026-02-01T00:00:00.000Z");
  });

  it("rejette une date de fenêtre mal formée", async () => {
    const admin = await login("admin@studio.eco");

    await request(app)
      .get("/v1/indicators/000000000000000000000000")
      .query({ from: "hier" })
      .set("Cookie", admin.cookie)
      .expect(400);
  });
});
