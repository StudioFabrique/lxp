import { Request, Response } from "express";
import updateDatesModule from "../../models/module/update-dates-module";

export default async function httpUpdateDatesModule(
  req: Request,
  res: Response
) {
  try {
    const { moduleId, minDate, maxDate } = req.body;

    const response = await updateDatesModule(moduleId, minDate, maxDate);

    if (!response) {
      return res.status(404).send({ message: "module non existant" });
    }

    return res.status(200).send({
      message: "mis à jour des données effectués",
      data: { minDate, maxDate },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "problème serveur" });
  }
}
