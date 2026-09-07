import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import deleteManyTags from "../../models/tag/delete-many-tags.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteManyTags(
  req: CustomRequest,
  res: Response,
) {
  const tagsIds = req.query.ids?.toString().split(",") || [];

  try {
    await deleteManyTags(tagsIds, {
      userId: req.auth!.userId,
      isAdmin: req.auth!.userRoles.some(({ rank }) => rank <= 1),
    });

    return res.status(201).json({
      message: "Tags supprimés",
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
