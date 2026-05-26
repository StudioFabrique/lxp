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
import { corsOrigins } from "./config/config";

const app = express();

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
      origin: corsOrigins,
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
