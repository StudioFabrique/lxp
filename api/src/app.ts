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

app
  .use(helmet())
  .use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use(morgan("combined"))
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))

  .use("/v1", api)
  .use(({ res }: { res: Response }) => {
    const message = "Impossible de trouver les ressource demandées.";
    res.status(404).json(message);
  });

export default app;
