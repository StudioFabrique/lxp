import { NextFunction, Request, Response } from "express";

import { badQuery } from "../utils/constantes";

function isValidBlobString(req: Request, res: Response, next: NextFunction) {
  const regex =
    /^blob:http:\/\/localhost:3000\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{0}$/i;

  if (regex.test(req.body.image)) {
    next();
  } else {
    return res.status(400).json({ message: badQuery });
  }
}

export default isValidBlobString;
