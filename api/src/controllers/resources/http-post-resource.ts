import { Response, NextFunction } from "express";
import { serverIssue } from "../../utils/constantes";
import postResource from "../../models/resources/post-resource";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.userId;
    const { title, description, tags } = req.body;

    const result = await postResource(userId!, title, description, tags);
    next({
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
