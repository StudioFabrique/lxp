import { Request, Response } from "express";
import fs from "fs";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import { serverIssue } from "../../utils/constantes";
import createManyGraduations from "../../models/graduation/create-many-graduations";
import { IGraduation } from "../../utils/interfaces/db/graduation";
import { ILink } from "../../utils/interfaces/db/link";
import { IHobby } from "../../utils/interfaces/db/hobby";
import createManyLinks from "../../models/links/create-many-links";
import createManyHobbies from "../../models/hobby/create-many-hobbies";
import createUser from "../../models/user/create-user";

export default async function httpCreateUser(req: Request, res: Response) {
  let userDataRequest = JSON.parse(req.body.user);
  const graduationsDataRequest: IGraduation[] | undefined =
    userDataRequest.graduations;
  console.log("toto", userDataRequest.roleId);
  const linksDataRequest: ILink[] | undefined = userDataRequest.links;
  const hobbiesDataRequest: IHobby[] | undefined = userDataRequest.hobbies;
  const { roleId } = userDataRequest;
  const uploadedFile = req.file;

  console.log(graduationsDataRequest);
  console.log(hobbiesDataRequest);

  console.log(userDataRequest);
  console.log(graduationsDataRequest ?? "no graduations data");
  console.log(linksDataRequest ?? "no links data");
  console.log(hobbiesDataRequest ?? "no hobbies data");

  console.log({ roleId });

  try {
    if (uploadedFile) {
      const avatar = await fs.promises.readFile(uploadedFile.path);
      userDataRequest = { ...userDataRequest, avatar };
    }

    if (!graduationsDataRequest || !linksDataRequest || !hobbiesDataRequest) {
      return res.status(404).send({ message: badQuery });
    }

    const userResponse = await createUser(userDataRequest, roleId); // crée un user + insert une référence mongodb dans prisma si le type utilisateur le permet

    if (!userResponse) {
      return res.status(409).json({ message: alreadyExist });
    }

    console.log(graduationsDataRequest);

    await createManyGraduations(userResponse!._id, graduationsDataRequest); // insert graduations in mongodb with user ref _id

    await createManyLinks(userResponse!._id, linksDataRequest); // insert links in mongodb with user ref _id

    await createManyHobbies(userResponse!._id, hobbiesDataRequest); // insert hobbies in mongodb with user ref _id

    if (uploadedFile) {
      await fs.promises.unlink(uploadedFile.path);
    }

    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: serverIssue + e });
  }
}
