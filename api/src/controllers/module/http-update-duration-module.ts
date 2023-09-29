import { Request, Response } from "express";
import updateDurationModule from "../../models/module/update-duration-module";

export default async function httpUpdateDurationModule(
  req: Request,
  res: Response
) {
  try {
    const { duration, id }: { duration: number; id: number } = req.body;

    const response = updateDurationModule(id, duration);

    if (!response) {
      return res.status(404).send({ message: "ressource non trouvé" });
    }

    return res.status(200).send({ message: "mis à jour effectué avec succes" });
  } catch (e) {
    return res.status(500).send({ message: "erreur serveur" });
  }
}
