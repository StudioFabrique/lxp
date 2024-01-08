import { Request, Response, NextFunction } from "express";

export default async function jsonParser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body.module && req.body.module !== undefined) {
    const module = JSON.parse(req.body.module);
    req.body.module = module;
  }
  if (req.body.data && req.body.data !== undefined) {
    const data = JSON.parse(req.body.data);
    req.body.data = data;
  }
  next();
}
