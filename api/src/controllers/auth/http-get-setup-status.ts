import { type Request, type Response } from "express";
import { hostname } from "node:os";
import { getSetupStatus } from "../../models/auth/setup.ts";
import { env } from "../../config/env.ts";

export default async function httpGetSetupStatus(
  _req: Request,
  res: Response,
) {
  try {
    const hasAdmins = await getSetupStatus();

    // Docker donne au conteneur son identifiant court pour hostname, et c'est
    // exactement ce qu'attend `docker exec`. Le front peut donc afficher une
    // commande juste sans connaître le nom du projet Compose, sans qu'aucun
    // fichier compose ni `.env` n'ait à être déposé sur le serveur.
    //
    // Servi seulement pendant la fenêtre d'amorçage : dès qu'un administrateur
    // existe, la page `/init` est inaccessible et l'information n'a plus de
    // raison d'être publique.
    return res.status(200).json({
      hasAdmins,
      activationTokenTtlMinutes: env.ROOT_ACTIVATION_TOKEN_TTL_MINUTES,
      ...(hasAdmins ? {} : { containerId: hostname() }),
    });
  } catch {
    return res.status(200).json({
      hasAdmins: true,
      activationTokenTtlMinutes: env.ROOT_ACTIVATION_TOKEN_TTL_MINUTES,
    });
  }
}
