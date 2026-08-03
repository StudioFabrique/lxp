import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getPaginateTags from "../../models/tag/get-paginate-tags.ts";

async function httpGetPaginateTags(req: Request, res: Response) {
  const { stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!stype || !sdir || !page || !limit) {
    return res.status(400).json({
      message: "Paramètres manquants",
    });
  }

  try {
    const result = await getPaginateTags(
      +page,
      +limit,
      stype,
      sdir as "asc" | "desc",
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetPaginateTags;
