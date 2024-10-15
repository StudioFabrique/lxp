import { Request, Response } from "express";
import fs from "fs";
import { badQuery } from "../../utils/constantes";
import { IGraduation } from "../../utils/interfaces/db/graduation";
import { IHobby } from "../../utils/interfaces/db/hobby";
import { ILink } from "../../utils/interfaces/db/link";
import editUser from "../../models/user/edit-user";
import editManyGraduations from "../../models/graduation/edit-many-graduations";
import editManyLinks from "../../models/links/edit-many-links";
import editManyHobbies from "../../models/hobby/edit-many-hobbies";

export default async function httpUpdateUser(req: Request, res: Response) {
  const { id } = req.params;
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

    const userResponse = await editUser(id, userDataRequest, roleId);

    await editManyGraduations(
      userResponse!.updatedUser._id,
      graduationsDataRequest,
    );

    await editManyLinks(userResponse!.updatedUser._id, linksDataRequest);

    await editManyHobbies(userResponse!.updatedUser._id, hobbiesDataRequest);

    if (uploadedFile) {
      await fs.promises.unlink(uploadedFile.path);
    }

    return res.status(201).json({
      success: true,
      message: "L'utilisateur a été modifié avec succès.",
    });
  } catch (error: any) {
    console.log({ error });
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
