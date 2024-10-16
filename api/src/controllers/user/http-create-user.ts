import { Request, Response } from "express";
import fs from "fs";
import createManyGraduations from "../../models/graduation/create-many-graduations";
import createManyHobbies from "../../models/hobby/create-many-hobbies";
import createManyLinks from "../../models/links/create-many-links";
import createUser from "../../models/user/create-user";
import { badQuery } from "../../utils/constantes";
import { IGraduation } from "../../utils/interfaces/db/graduation";
import { IHobby } from "../../utils/interfaces/db/hobby";
import { ILink } from "../../utils/interfaces/db/link";

export default async function httpCreateUser(req: Request, res: Response) {
  let userDataRequest = req.body.data.user;
  const graduationsDataRequest: IGraduation[] | undefined =
    userDataRequest.graduations;
  const linksDataRequest: ILink[] | undefined = userDataRequest.links;
  const hobbiesDataRequest: IHobby[] | undefined = userDataRequest.hobbies;
  const { roleId } = userDataRequest;
  const uploadedFile = req.file;

  try {
    if (uploadedFile) {
      const avatar = await fs.promises.readFile(uploadedFile.path);
      userDataRequest = { ...userDataRequest, avatar };
    }

    if (!graduationsDataRequest || !linksDataRequest || !hobbiesDataRequest) {
      return res.status(404).send({ message: badQuery });
    }

    const userResponse = await createUser(userDataRequest, roleId); // crée un user + insert une référence mongodb dans prisma si le type utilisateur le permet

    await createManyGraduations(
      userResponse!.createdUser._id,
      graduationsDataRequest,
    ); // insert graduations in mongodb with user ref _id

    await createManyLinks(userResponse!.createdUser._id, linksDataRequest); // insert links in mongodb with user ref _id

    await createManyHobbies(userResponse!.createdUser._id, hobbiesDataRequest); // insert hobbies in mongodb with user ref _id

    if (uploadedFile) {
      await fs.promises.unlink(uploadedFile.path);
    }

    return res.status(201).json({
      success: true,
      message: "L'utilisateur a été créé avec succès.",
    });
  } catch (error: any) {
    console.log({ error });
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
