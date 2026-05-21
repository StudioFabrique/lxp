import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import api from "./routes/v1/v1.router";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import responseHandler from "./middleware/response-handler";

const app = express();

const HTTPS_ENABLED = process.env.HTTPS_ENABLED === "true";

const origins =
  process.env.ENVIRONMENT === "production"
    ? ["https://fnp.lxp.andria.ovh"]
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        // Toujours inclure HTTPS en dev pour éviter les problèmes de CORS
        "https://localhost:5173",
        "https://localhost:5174",
        "https://localhost:5175",
      ];

console.log("🌐 CORS origins autorisées:", origins);
console.log("🔒 HTTPS enabled:", HTTPS_ENABLED);
app
  .use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "http://localhost:5001"],
          imgSrc: ["'self'", "data:"],
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
      origin: origins,
      credentials: true,
    }),
  )
  .use(cookieParser())
  .use(morgan("combined"))
  .use(express.json())
  .use(express.static(path.join(__dirname, "..", "public")))
  .use(express.static(path.join(__dirname, "..", "uploads")))
  .use("/v1", api)
  .set("trust proxy", ["loopback", "linklocal", "uniquelocal"])
  .get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  })
  .use(responseHandler);

export default app;
