import { type Request, type Response } from "express";

export default function httpPostCompanyLogo(_req: Request, res: Response) {
  return res.json({
    message: "Le logo de l'organisme de formation a bien été téléversé",
  });
}
