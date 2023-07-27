import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express, { Response } from "express";
import api from "./routes/v1/v1.router";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

const upload = multer(); // Add parentheses here to create a multer instance

app
  .use(helmet())
  .use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use(upload.array("image", 1))
  .use(morgan("combined"))
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))

  .use("/v1", api)
  .use(({ res }: { res: Response }) => {
    const message = "Impossible de trouver les ressources demandées.";
    res.status(404).json(message);
  });

export default app;
