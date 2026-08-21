import request from "supertest";
import app from "../src/app.ts";
import { isDemoWriteAllowed } from "../src/config/demo-read-only-allowlist.ts";
import { listMutatingRoutes } from "../src/utils/testing/express-routes.ts";

/**
 * Verrou lecture seule de l'instance de démonstration.
 *
 * Le middleware s'exécute avant toute authentification et avant tout accès aux
 * bases : ces scénarios n'ont donc besoin ni de session ni de connexion Mongo.
 */
describe("Mode démonstration — verrou lecture seule", () => {
  const modeInitial = process.env.DEMO_MODE;

  afterAll(() => {
    process.env.DEMO_MODE = modeInitial;
  });

  describe("quand le mode est actif", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "true";
    });

    it("refuse les écritures avec un code exploitable par le front", async () => {
      const reponse = await request(app)
        .post("/v1/formation")
        .send({ title: "Tentative" })
        .expect(403);

      expect(reponse.body.code).toBe("DEMO_READ_ONLY");
    });

    it.each([
      ["put", "/v1/parcours/update-infos"],
      ["patch", "/v1/parcours/1"],
      ["delete", "/v1/tag/deleteSingle/1"],
    ])("refuse %s %s", async (methode, chemin) => {
      await (request(app) as any)[methode](chemin).expect(403);
    });

    it("refuse un dépôt de fichier avant qu'il n'atteigne le disque", async () => {
      // `multer` est déclaré dans les routeurs : si le verrou était monté plus
      // loin que `/v1`, le fichier serait écrit avant d'être refusé.
      const reponse = await request(app)
        .post("/v1/activity/blog-image")
        .attach("image", Buffer.from("charge utile"), "test.png");

      expect(reponse.status).toBe(403);
      expect(reponse.body.code).toBe("DEMO_READ_ONLY");
    });

    it("laisse passer les lectures", async () => {
      // 401 et non 403 : la requête a traversé le verrou et bute sur la session.
      await request(app).get("/v1/formation").expect(401);
    });

    it("laisse passer la déconnexion", async () => {
      await request(app).get("/v1/auth/logout").expect(200);
    });

    it("laisse passer les lectures servies en POST", async () => {
      const reponse = await request(app).post("/v1/user/group").send({});
      expect(reponse.status).not.toBe(403);
    });

    it("expose la configuration d'exécution", async () => {
      const reponse = await request(app).get("/v1/demo/config").expect(200);
      expect(reponse.body.demoMode).toBe(true);
      expect(reponse.body.aiDisabled).toBe(true);
    });
  });

  describe("quand le mode est inactif", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "false";
    });

    it("ne s'interpose pas", async () => {
      // 401 : le refus vient du contrôle de session, pas du verrou.
      await request(app).post("/v1/formation").send({}).expect(401);
    });

    it("annonce que la démonstration est inactive", async () => {
      const reponse = await request(app).get("/v1/demo/config").expect(200);
      expect(reponse.body.demoMode).toBe(false);
    });
  });

  /**
   * Filet durable : toute route d'écriture ajoutée plus tard doit être refusée,
   * ou inscrite explicitement dans la liste blanche. Une lecture servie en POST
   * fera échouer ce test tant que le choix n'est pas assumé.
   */
  describe("couverture des routes déclarées", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "true";
    });

    it("couvre toutes les routes non-GET de l'application", () => {
      const routes = listMutatingRoutes(app);

      expect(routes.length).toBeGreaterThan(100);

      const horsPerimetre = routes.filter(
        (route) =>
          !route.path.startsWith("/v1/") ||
          isDemoWriteAllowed(route.method, route.path.replace("/v1", "")),
      );

      // Seules les exceptions déclarées échappent au verrou.
      expect(horsPerimetre.map((r) => `${r.method} ${r.path}`).sort()).toEqual([
        "POST /v1/demo/session",
        "POST /v1/user/group",
      ]);
    });
  });
});
