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

console.log(path.join(__dirname, "..", "public", "index.html"));
app
  /*.use
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
    })
   
  ()*/
  .use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
      ],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use(morgan("combined"))
  .use(express.json())
  .use(express.static(path.join(__dirname, "..", "public")))
  .use(express.static(path.join(__dirname, "..", "uploads")))
  .use("/v1", api)
  .use(({ res }: { res: Response }) => {
    const message = "Impossible de trouver les ressources demandées.";
    res.status(404).json(message);
  });

export default app;
