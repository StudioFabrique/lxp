import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import getGroupDetails from "../../models/group/get-group-details";

export default async function httpGetGroupDetails(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const response = await getGroupDetails(id);

    if (!response) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ data: response });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}
