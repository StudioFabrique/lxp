import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getPaginateSearchTags from "../../models/tag/get-paginate-search-tags.ts";

async function httpGetPaginateSearchTags(req: Request, res: Response) {
  const { entity, value, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!stype || !sdir || !page || !limit) {
    return res.status(400).json({
      message: "Paramètres manquants",
    });
  }

  try {
    const result = await getPaginateSearchTags(
      +page,
      +limit,
      stype,
      sdir as "asc" | "desc",
      entity,
      value,
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetPaginateSearchTags;
