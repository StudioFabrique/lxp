import { type NextFunction, type Response } from "express";
import { isContentType } from "../config/content-read.ts";
import { noData } from "../utils/constantes.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import {
  type AccessCheckedContent,
  findParcoursIdForContent,
  getAccessibleParcoursIds,
  isRestrictedToEnrollment,
} from "../utils/services/permissions/accessible-parcours.ts";

/**
 * Restreint un contenu pédagogique aux parcours auxquels l'appelant est inscrit.
 *
 * `checkPermissions` répond à « cet utilisateur a-t-il le droit de lire *des*
 * leçons ? », jamais à « a-t-il le droit de lire *cette* leçon ? ». Sans ce
 * second contrôle, un apprenant muni d'une session valide énumère l'intégralité
 * du catalogue en incrémentant l'identifiant de l'URL.
 *
 * À placer après `checkPermissions`, qui a déjà renseigné `req.auth`.
 *
 * L'échec renvoie 404 et non 403 : répondre « interdit » confirmerait que
 * l'identifiant existe, ce qui laisserait cartographier le catalogue.
 */
export default function checkContentAccess(
  type: AccessCheckedContent,
  parameterName = "id",
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const auth = req.auth;
      if (!auth) return res.status(401).json({ message: "Session absente" });

      // Administrateurs et formateurs encadrent tout le catalogue.
      if (!isRestrictedToEnrollment(auth.userRoles)) return next();

      const contentId = Number(req.params[parameterName]);
      if (!Number.isInteger(contentId) || contentId <= 0) {
        return res.status(404).json({ message: noData });
      }

      const parcoursId = await findParcoursIdForContent(type, contentId);
      if (parcoursId === null) {
        return res.status(404).json({ message: noData });
      }

      const accessibleParcoursIds = await accessibleParcoursFor(req, auth.userId);
      if (!accessibleParcoursIds.includes(parcoursId)) {
        return res.status(404).json({ message: noData });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Variante pour les routes dont le type de contenu est porté par l'URL
 * (`/content-read/:type/:id/...`) plutôt que fixé à la déclaration.
 */
export function checkContentAccessFromParams(
  typeParameterName = "type",
  parameterName = "id",
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const type = req.params[typeParameterName];
    // Un type inconnu n'est pas un défaut d'habilitation mais une URL malformée :
    // on laisse le validateur de la route répondre 400, ce qui reste plus
    // exact que le 404 servi lorsqu'un contenu existe mais est hors périmètre.
    if (!isContentType(type)) return next();

    return checkContentAccess(type, parameterName)(req, res, next);
  };
}

/**
 * Mémoïse la liste des parcours accessibles le temps de la requête : plusieurs
 * gardes peuvent se succéder sur une même route, et la résolution coûte une
 * lecture Mongo plus une lecture PostgreSQL.
 */
async function accessibleParcoursFor(req: CustomRequest, userId: string) {
  const cache = req as CustomRequest & { accessibleParcoursIds?: number[] };
  cache.accessibleParcoursIds ??= await getAccessibleParcoursIds(userId);
  return cache.accessibleParcoursIds;
}
