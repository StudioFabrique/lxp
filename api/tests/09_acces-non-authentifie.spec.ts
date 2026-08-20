import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";

const uploadsDirectory = path.join(import.meta.dirname, "..", "uploads");
const fichierActivite = path.join(uploadsDirectory, "activities", "files", "test-acces.txt");

/**
 * Surface exposée sans session.
 *
 * Ces deux protections vivent en dehors des routes `/v1` — l'une devant les
 * fichiers statiques, l'autre devant la connexion — et échappent donc au
 * contrôle de permissions qui couvre le reste de l'API.
 */
describe("Accès non authentifié", () => {
  let cookie: string[];

  beforeAll(async () => {
    await mongoConnect();
    await fs.mkdir(path.dirname(fichierActivite), { recursive: true });
    await fs.writeFile(fichierActivite, "contenu pédagogique de test", "utf8");

    const connexion = await request(app)
      .post("/v1/auth/login")
      .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" })
      .expect(200);
    cookie = connexion.headers["set-cookie"] as unknown as string[];
  });

  afterAll(async () => {
    await fs.rm(fichierActivite, { force: true });
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  describe("Fichiers déposés dans uploads/activities", () => {
    it("refuse un fichier de cours à un visiteur sans session", async () => {
      await request(app).get("/activities/files/test-acces.txt").expect(401);
    });

    it("sert le même fichier à une session valide", async () => {
      const reponse = await request(app)
        .get("/activities/files/test-acces.txt")
        .set("Cookie", cookie)
        .expect(200);

      expect(reponse.text).toContain("contenu pédagogique de test");
    });

    it("n'expose pas le listing du répertoire", async () => {
      await request(app)
        .get("/activities/files/")
        .set("Cookie", cookie)
        .expect(404);
    });

    it("laisse le logo de l'entreprise public, l'écran de connexion en dépend", async () => {
      const reponse = await request(app).get("/company/company-logo.jpeg");
      expect(reponse.status).not.toBe(401);
    });
  });

  describe("Plafond de tentatives de connexion", () => {
    it("bloque le bourrage d'identifiants et annonce le délai d'attente", async () => {
      const codes: number[] = [];
      let retryAfter: string | undefined;

      for (let tentative = 0; tentative < 12; tentative += 1) {
        const reponse = await request(app)
          .post("/v1/auth/login")
          .send({ email: "brute@studio.eco", password: "Mauvais@123456" });
        codes.push(reponse.status);
        retryAfter ??= reponse.headers["retry-after"];
      }

      // Le plafond est compté par IP et par chemin, et la connexion du
      // `beforeAll` en a déjà consommé une part : on vérifie la bascule, pas
      // le rang exact auquel elle tombe.
      const premierBlocage = codes.indexOf(429);

      expect(premierBlocage).toBeGreaterThan(0);
      expect(premierBlocage).toBeLessThanOrEqual(10);
      expect(codes.slice(0, premierBlocage)).toEqual(
        Array(premierBlocage).fill(401),
      );
      expect(codes.slice(premierBlocage).every((code) => code === 429)).toBe(true);
      expect(Number(retryAfter)).toBeGreaterThan(0);
    });
  });
});
