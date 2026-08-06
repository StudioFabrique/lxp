import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import api from "./routes/v1/v1.router.ts";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import responseHandler from "./middleware/response-handler.ts";
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
          defaultSrc: ["'self'", "http://localhost:5001"],
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
  .use(morgan("combined"))
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
  .use(express.static(uploadsDirectory))
  .use("/v1", api)
  .set("trust proxy", ["loopback", "linklocal", "uniquelocal"])
  .get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(publicDirectory, "index.html"));
  })
  .use(responseHandler);

export default app;
