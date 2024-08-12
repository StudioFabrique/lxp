import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logs/logger";

export default function errorHandler(
  data: any,
  req: Request,
  res: Response,
) {
  if (data) {
    const childLogger = logger.child({
      from: req.socket.remoteAddress ?? "unknown",
    });
    const message = `${req.auth?.userId}-${req.auth?.userRoles[0]!.label}-${req.method}-${req.path.split("/")[2]}`;
    if (data.statusCode >= 500) {
      childLogger.error(message + "-"+data.message);
    } else if (data.statusCode < 400) {
      childLogger.info(message);
      console.log(message);
     return res.status(result.statusCode).json(result.data);

    }
    else {
      childLogger.warn(message + "-"+data.message)
    }
    return res.status(data.statusCode ?? 500).json({ message: data.message });
  }
  return
}

// TODO ajouter les infos du user dans le cas d'une erreur'
