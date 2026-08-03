import { type Request, type Response } from "express";
import fs from "fs";
import createManyGraduations from "../../models/graduation/create-many-graduations.ts";
import createManyLinks from "../../models/links/create-many-links.ts";
import createUser from "../../models/user/create-user.ts";
import { badQuery } from "../../utils/constantes.ts";
import type { IGraduation } from "../../utils/interfaces/db/graduation.ts";
import type { IHobby } from "../../utils/interfaces/db/hobby.ts";
import type { ILink } from "../../utils/interfaces/db/link.ts";
import createManyHobbies from "../../models/user/hobby/create-many-hobbies.ts";

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
      graduationsDataRequest
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
