import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import putTag from "../../models/tag/put-tag.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPutTag(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await putTag(+id, name, {
      userId: req.auth!.userId,
      isAdmin: req.auth!.userRoles.some(({ rank }) => rank <= 1),
    });
    return res
      .status(201)
      .json({ message: "Le tag a été modifié avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
