import { Request, Response } from "express";
import { alreadyExist, creationSuccessfull } from "../../utils/constantes";
import createUser from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";
import { IUser } from "../../utils/interfaces/db/user.model";

export default async function httpCreateUser(req: Request, res: Response) {
  const userDataRequest: IUser = req.body;
  const graduationsDataRequest = userDataRequest.graduations;
  const linksDataRequest = userDataRequest.links;
  const hobbiesDataRequest = userDataRequest.hobbies;

  console.log(userDataRequest);
  console.log(graduationsDataRequest ?? "no graduations data");
  console.log(linksDataRequest ?? "no links data");
  console.log(hobbiesDataRequest ?? "no hobbies data");

  try {
    const userResponse = await createUser(userDataRequest); // crée un user + insert une référence mongodb dans prisma

    if (!userResponse) {
      res.status(409).json({ message: alreadyExist });
    }

    /* const graduationsResponse = await createGraduations(
      userResponse!._id,
      graduationsDataRequest
    ); // insert graduations in mongodb with user ref _id

    const linksResponse = await createLinks(
      userResponse!._id,
      linksDataRequest
    ); // insert links in mongodb with user ref _id

    const hobbiesResponse = await createHobbies(
      userResponse!._id,
      hobbiesDataRequest
    ); // insert hobbies in mongodb with user ref _id */

    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
