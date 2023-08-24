import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import putVirtualClass from "../../models/parcours/put-virtual-class";

async function httpPutVirtualClass(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }

    const { parcoursId, virtualClass } = req.body;

    const response = await putVirtualClass(parcoursId, virtualClass);
    return res.status(201).json({
      success: true,
      message: "Le lien vers la classe virtuelle a été mis à jour",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default httpPutVirtualClass;
