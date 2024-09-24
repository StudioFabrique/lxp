import { Request, Response, NextFunction } from "express";

/**
 * TO DO NEXT :
 * - enlever la vérification de module
 * - Utiliser seulement data dans le contenu du body lors d'une requête qui implique un form data
 */
export default async function jsonParser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log({ body: req.body });
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
