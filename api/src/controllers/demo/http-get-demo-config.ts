import { type Request, type Response } from "express";
import {
  demoExitUrl,
  demoUrl,
  isAiDisabled,
  isDemoMode,
} from "../../config/config.ts";

/**
 * Configuration que le front ne peut pas connaître à la construction.
 *
 * Le front est bâti une seule fois, dans l'image Docker partagée par toutes les
 * instances (`front/.env.production` est versionné et copié par le Dockerfile) :
 * une variable `VITE_*` vaut donc la même chose en production et sur l'instance
 * de démonstration. Ce qui distingue les deux doit être servi au moment de
 * l'exécution, et c'est le rôle de cette route.
 */
export default function httpGetDemoConfig(_req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).json({
    demoMode: isDemoMode(),
    demoUrl: demoUrl(),
    exitUrl: demoExitUrl(),
    aiDisabled: isAiDisabled(),
  });
}
