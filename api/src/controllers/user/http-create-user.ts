import { Request, Response } from "express";
import { alreadyExist, creationSuccessfull } from "../../utils/constantes";
import createUser from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";
import { IUser } from "../../utils/interfaces/db/user.model";
import createManyGraduations from "../../models/graduation/create-many-graduations";
import { IGraduation } from "../../utils/interfaces/db/graduation";
import { ILink } from "../../utils/interfaces/db/link";
import { IHobby } from "../../utils/interfaces/db/hobby";
import createManyLinks from "../../models/links/create-many-links";

export default async function httpCreateUser(req: Request, res: Response) {
  const userDataRequest: IUser = req.body;
  const graduationsDataRequest: IGraduation[] | undefined =
    userDataRequest.graduations;
  const linksDataRequest: ILink[] | undefined = userDataRequest.links;
  const hobbiesDataRequest: IHobby[] | undefined = userDataRequest.hobbies;
  const { userType } = req.body;

  console.log(userDataRequest);
  console.log(graduationsDataRequest ?? "no graduations data");
  console.log(linksDataRequest ?? "no links data");
  console.log(hobbiesDataRequest ?? "no hobbies data");

  try {
    const userResponse = await createUser(userDataRequest, userType); // crée un user + insert une référence mongodb dans prisma si le type utilisateur le permet

    if (!userResponse) {
      res.status(409).json({ message: alreadyExist });
    }

    if (graduationsDataRequest) {
      const graduationsResponse = await createManyGraduations(
        userResponse!._id,
        graduationsDataRequest
      ); // insert graduations in mongodb with user ref _id
    }

    if (linksDataRequest) {
      const linksResponse = await createManyLinks(
        userResponse!._id,
        linksDataRequest
      ); // insert links in mongodb with user ref _id
    }

    if (hobbiesDataRequest) {
      const hobbiesResponse = await createHobbies(
        userResponse!._id,
        hobbiesDataRequest
      ); // insert hobbies in mongodb with user ref _id
    }

    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: serverIssue + e });
  }
}
