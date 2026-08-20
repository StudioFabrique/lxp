import { type Response, type NextFunction } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postResource from "../../models/resources/post-resource.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { validationResult } from "express-validator";

export default async function httpPostResource(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });

    const userId = req.auth?.userId;
    const { data } = req.body;
    const { title, description, tags } = data;
    const file = req.file;

    const filename = file ? file.filename : null;

    const response = await postResource(
      userId!,
      title,
      description,
      tags,
      filename ?? null
    );
    next({
      statusCode: 201,
      data: response,
    });
  } catch (error: any) {

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
