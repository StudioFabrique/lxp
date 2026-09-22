import { type Request, type Response } from "express";

export default function httpPostInstanceLogo(_req: Request, res: Response) {
  return res.json({
    message: "La personnalisation du logo a bien été sauvegardée",
  });
}
