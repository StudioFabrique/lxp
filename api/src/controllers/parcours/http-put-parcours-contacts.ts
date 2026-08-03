import { type Request, type Response } from "express";
import { validationResult } from "express-validator";

import { badQuery, noAccess, serverIssue } from "../../utils/constantes.ts";
import putParcoursContacts from "../../models/parcours/put-parcours-contacts.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpPutParcoursContacts(req: CustomRequest, res: Response) {
  try {
    //console.log(req.body);

    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }

    const { parcoursId, contacts } = req.body;
    const response = await putParcoursContacts(+parcoursId, contacts, userId);
    console.log(response);

    return res.status(201).json({
      success: true,
      message: "Contacts mis à jour avec succès",
      data: response,
    });
  } catch (error: any) {
    let returnedError: any;

    if (error.status === 403) {
      returnedError = { ...error, from: req.socket.remoteAddress };
    } else {
      returnedError = error;
    }

    return res
      .status(returnedError.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutParcoursContacts;
