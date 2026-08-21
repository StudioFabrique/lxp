import { type NextFunction, type Request, type Response } from "express";
import { isDemoMode } from "../config/config.ts";
import { isDemoWriteAllowed } from "../config/demo-read-only-allowlist.ts";

/** Code renvoyé au front pour qu'il distingue ce refus d'un refus de droits. */
export const DEMO_READ_ONLY_CODE = "DEMO_READ_ONLY";

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Interdit toute écriture quand l'instance tourne en démonstration.
 *
 * Ce middleware est la protection principale, et non un filet : les comptes de
 * démonstration empruntent des rôles complets pour que l'interface s'affiche
 * telle qu'un client la verrait, donc le contrôle de permissions ne refuse rien.
 *
 * Il doit être monté **devant** le montage de `/v1`, et non à l'intérieur des
 * routeurs : `multer` y est déclaré au niveau des routes, si bien qu'un montage
 * plus tardif laisserait les fichiers déposés atteindre le disque avant le refus.
 */
export default function demoReadOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!isDemoMode()) return next();
  if (READ_METHODS.has(req.method)) return next();
  if (isDemoWriteAllowed(req.method, req.path)) return next();

  return res.status(403).json({
    code: DEMO_READ_ONLY_CODE,
    message:
      "Action indisponible : ANDRIA est en mode démonstration (lecture seule).",
  });
}
