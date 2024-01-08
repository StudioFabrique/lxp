import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getGroupsById from "../../models/group/get-groups-by-id";

async function httpGetGroupsById(req: Request, res: Response) {
  const { groupsIds } = req.body;

  try {
    const response = await getGroupsById(groupsIds);
    return res.status(200).json(response);
  } catch (error: any) {
    //console.log("error", error);

    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetGroupsById;
