import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logs/logger";

import CustomRequest from "../utils/interfaces/express/custom-request";

export default function responseHandler(
  data: { statusCode: number; data?: any; message?: string },
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  if (data) {
    const childLogger = logger.child({
      from: req.socket.remoteAddress ?? "unknown",
    });
    const message = `${req.auth?.userId}-${req.auth?.userRoles[0]!.label}-${
      req.method
    }-${req.path}`;
    if (data.statusCode >= 500) {
      childLogger.error(message + "-" + data.message);
    } else if (data.statusCode < 400) {
      childLogger.info(message);
      return res.status(data.statusCode).json(data.data);
    } else {
      childLogger.warn(message + "-" + data.message);
    }
    return res.status(data.statusCode).json({ message: data.message });
  }
  next();
}
