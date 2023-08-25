import { Request, Response } from "express";
import { alreadyExist, creationSuccessfull } from "../../utils/constantes";
import createUser, { ICreateUserRequest } from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";

export default async function httpCreateUser(req: Request, res: Response) {
  const graduationsData: { graduations: any[] } = req.body;
  const linksData: { links: string[] } = req.body;
  const hobbiesData: { hobbies: string[] } = req.body;
  const userData: ICreateUserRequest = req.body;

  try {
    const graduationsResponse = await createGraduations(graduationsData);
    const linksResponse = await createLinks(linksData);
    const hobbiesData = await createHobbies(hobbiesData);
    const useResponse = await createUser(userData);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }

    res.status(409).json({ message: alreadyExist });
    return;
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
