import { Request, Response, NextFunction } from "express";

export default async function httpPostCheckActivationToken(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Lien valide.",
      },
    };
    next(result);
  } catch (error: any) {
    const err = {
      statusCode: 500,
      message: error.message,
    };
    next(err);
  }
}
