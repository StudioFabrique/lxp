import { Request, Response } from "express";

import getContacts from "../../models/parcours/get-contacts";
import { serverIssue } from "../../utils/constantes";

async function httpGetContacts(req: Request, res: Response) {
  try {
    const contacts = await getContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetContacts;
