import path from "path";
import express from "express";
import api from "./routes/v1/v1.router.ts";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import responseHandler from "./middleware/response-handler.ts";
import requireSession from "./middleware/require-session.ts";
import demoReadOnly from "./middleware/demo-read-only.ts";
import requestLogger from "./middleware/request-logger.ts";
import { corsOrigins } from "./config/config.ts";

const app = express();
const publicDirectory = path.join(import.meta.dirname, "..", "public");
const assetsDirectory = path.join(publicDirectory, "assets");
const uploadsDirectory = path.join(import.meta.dirname, "..", "uploads");

app
  .use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
          scriptSrc: ["'self'", "https://www.youtube.com"],
          frameSrc: [
            "'self'",
            "https://youtube.com",
            "https://www.youtube.com",
            "https://*.canva.com/",
            "https://canva.com/",
            "https://docs.google.com/",
            "https://drive.google.com/",
            "https://*.googleusercontent.com/",
          ],
          childSrc: ["'self'", "youtube.com", "www.youtube.com"],
          workerSrc: ["'self'", "blob:"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: true,
      referrerPolicy: false,
      originAgentCluster: false,
    }),
  )
  .use(
    cors({
      origin: corsOrigins,
      credentials: true,
      exposedHeaders: ["X-Course-Slug"],
    }),
  )
  .use(cookieParser())
  .use(requestLogger)
  .use(
    compression({
      filter: (req, res) => {
        const contentType = res.getHeader("Content-Type")?.toString();

        if (contentType?.startsWith("text/event-stream")) return false;

        return compression.filter(req, res);
      },
    }),
  )
  .use(express.json())
  .use(
    "/assets",
    express.static(assetsDirectory, {
      immutable: true,
      maxAge: "1y",
    }),
  )
  .use(
    express.static(publicDirectory, {
      setHeaders: (res, filePath) => {
        if (path.basename(filePath) === "index.html") {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    }),
  )
  // Les fichiers déposés dans `activities` (documents, images et vidéos de
  // cours) sont des contenus pédagogiques : ils ne doivent être lisibles que
  // par une session valide. Le cookie `accessToken` étant httpOnly et le front
  // servi par ce même serveur, le navigateur le joint automatiquement aux
  // requêtes `<img src>` et `window.open` : les URLs restent inchangées.
  .use(
    "/activities",
    requireSession,
    express.static(path.join(uploadsDirectory, "activities"), {
      index: false,
      dotfiles: "deny",
    }),
  )
  // Le logo et la couleur de l'entreprise sont affichés sur l'écran de
  // connexion, donc avant toute authentification.
  .use(
    "/company",
    express.static(path.join(uploadsDirectory, "company"), {
      index: false,
      dotfiles: "deny",
    }),
  )
  .use("/v1", demoReadOnly, api)
  .set("trust proxy", ["loopback", "linklocal", "uniquelocal"])
  .get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(publicDirectory, "index.html"));
  })
  .use(responseHandler);

export default app;
