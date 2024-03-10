import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express, { Response } from "express";
import api from "./routes/v1/v1.router";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

const origins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];
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
          ],
          childSrc: ["'self'", "youtube.com", "www.youtube.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: true,
      referrerPolicy: false,
      originAgentCluster: false,
    })
  )
  .use(
    cors({
      origin: origins,
      credentials: true,
    })
  )
  .use(cookieParser())
  .use(morgan("combined"))
  .use(express.json())
  .use(express.static(path.join(__dirname, "..", "public")))
  .use(express.static(path.join(__dirname, "..", "uploads")))
  .use("/v1", api);
/*   .use(({ res }: { res: Response }) => {
    const message = "Impossible de trouver les ressources demandées.";
    res.status(404).json(message);
  }); */
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
