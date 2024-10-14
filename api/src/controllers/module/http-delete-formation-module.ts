import { Request, Response } from "express";
import deleteFormationModule from "../../models/module/delete-formation-module";
import { serverIssue } from "../../utils/constantes";

export default async function httpDeleteFormationModule(
  req: Request,
  res: Response,
) {
  try {
    const { moduleId } = req.params;
    await deleteFormationModule(+moduleId);
    return res.status(200).json({ message: "Module supprimé avec succès" });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message:
          "Le module n'a pas pu être effacé car un ou plusieurs parcours l'utilisent.",
      });
  }
}
