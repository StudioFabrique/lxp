import express from "express";
import { body } from "express-validator";
import httpGetDemoConfig from "../../../controllers/demo/http-get-demo-config.ts";
import httpGetDemoChallenge from "../../../controllers/demo/http-get-demo-challenge.ts";
import httpPostDemoSession from "../../../controllers/demo/http-post-demo-session.ts";
import rateLimiter, { clientIp } from "../../../middleware/rate-limiter.ts";

const demoRouter = express.Router();

// Configuration d'exécution (publique) : lue par le front avant toute session,
// y compris par un visiteur anonyme sur /demo.
demoRouter.get("/config", rateLimiter(60, 60_000), httpGetDemoConfig);

// Défi anti-robot (public). La limite est large : un visiteur peut recharger
// la page, et un défi ne coûte qu'un hachage.
demoRouter.get("/challenge", rateLimiter(30, 60_000), httpGetDemoChallenge);

// Ouverture de session (publique, protégée par le défi et par le débit).
// La portée est l'adresse seule : c'est bien la machine qu'on veut compter ici,
// contrairement à la connexion où l'adresse visée élargit la clé.
demoRouter.post(
  "/session",
  rateLimiter(10, 15 * 60_000, (req) => `demo-session:${clientIp(req)}`),
  body("profile")
    .isIn(["admin", "student"])
    .withMessage("Profil de démonstration inconnu."),
  body("solution")
    .isObject()
    .withMessage("Vérification anti-robot manquante."),
  httpPostDemoSession,
);

export default demoRouter;
