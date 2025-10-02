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
import { validationResult } from "express-validator";

/**
 * HTTP handler for updating user information including their profile, graduations, links, and hobbies
 * @param req Express request object containing user data and file upload
 * @param res Express response object
 */
export default async function httpUpdateUser(req: Request, res: Response) {
  const { id } = req.params;
  let userDataRequest = req.body.data.user;
  // Extract related data from the request
  const graduationsDataRequest: IGraduation[] | undefined =
    userDataRequest.graduations;
  const linksDataRequest: ILink[] | undefined = userDataRequest.links;
  const hobbiesDataRequest: IHobby[] | undefined = userDataRequest.hobbies;

  const uploadedFile = req.file;

  try {
    // Handle avatar file upload if present
    if (uploadedFile) {
      const avatar = await fs.promises.readFile(uploadedFile.path);
      userDataRequest = { ...userDataRequest, avatar };
    }

    // Validate required data
    if (!graduationsDataRequest || !linksDataRequest || !hobbiesDataRequest) {
      return res.status(404).send({ message: badQuery });
    }

    // Update user basic information
    const userResponse = await editUser(id, userDataRequest);

    if (userResponse === null)
      throw {
        message: "La mise à jour de l'utilisateur a échoué.",
        statusCode: 500,
      };

    // Update user's associated data
    await editManyGraduations(
      userResponse!.updatedUser!._id,
      graduationsDataRequest
    );

    await editManyLinks(userResponse!.updatedUser!._id, linksDataRequest);

    await editManyHobbies(userResponse!.updatedUser!._id, hobbiesDataRequest);

    // Clean up uploaded file after processing
    if (uploadedFile) {
      await fs.promises.unlink(uploadedFile.path);
    }

    // Send success response
    return res.status(201).json({
      success: true,
      message: "L'utilisateur a été modifié avec succès.",
    });
  } catch (error: any) {
    console.log({ error });
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
