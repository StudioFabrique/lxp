import { type Response, type NextFunction } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postResource from "../../models/resources/post-resource.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import putResource from "../../models/resources/put-resource.ts";

export default async function httpPutResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    const resourceId = parseInt(req.params.resourceId, 10);
    const { data } = req.body;
    const { title, description, tags } = data;
    const file = req.file;

    const filename = file ? file.filename : null;

    const response = await putResource(
      userId!,
      resourceId,
      title,
      description,
      tags,
      filename ?? null,
    );
    next({
      statusCode: 201,
      data: { response },
    });
  } catch (error: any) {

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
