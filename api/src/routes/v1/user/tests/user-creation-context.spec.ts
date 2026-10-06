import express, { type Request, type Response } from "express";
import request from "supertest";
import { userCreationContextValidator } from "../user-validators.ts";

const app = express();
app.post("/user", userCreationContextValidator, (_req: Request, res: Response) => res.sendStatus(204));

describe("validation du contexte de création utilisateur", () => {
  it.each(["/user", "/user?creationContext=group"])("accepte %s", async (url) => {
    await request(app).post(url).expect(204);
  });
  it.each([
    "/user?creationContext=admin",
    "/user?creationContext=",
    "/user?creationContext=group&creationContext=group",
  ])("rejette %s avant le contrôleur", async (url) => {
    await request(app).post(url).expect(400);
  });
});
