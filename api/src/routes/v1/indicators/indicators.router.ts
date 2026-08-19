import express from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetIndicators from "../../../controllers/indicators/http-get-indicators.ts";
import { getIndicatorsValidator } from "./indicators-validators.ts";

const indicatorsRouter = express.Router();

/**
 * Tous les indicateurs d'un apprenant en un appel.
 *
 * `from` et `to` sont facultatifs : sans eux, la fenêtre par défaut est de
 * trente jours, cohérente avec `GET /v1/user/data/:userId`.
 */
indicatorsRouter.get(
  "/:userId",
  checkPermissions("stats", "read"),
  getIndicatorsValidator,
  httpGetIndicators,
);

export default indicatorsRouter;
