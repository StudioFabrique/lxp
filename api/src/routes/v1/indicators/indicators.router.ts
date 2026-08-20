import express from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetIndicators from "../../../controllers/indicators/http-get-indicators.ts";
import httpPostIndicatorsPrediction from "../../../controllers/indicators/http-post-indicators-prediction.ts";
import { indicatorsWindowValidator } from "./indicators-validators.ts";

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
  indicatorsWindowValidator,
  httpGetIndicators,
);

/**
 * Prédiction du modèle IA à partir des indicateurs de l'apprenant.
 *
 * En POST parce que l'appel déclenche une inférence sur le service IA, et sous
 * la même fenêtre `from`/`to` que les indicateurs affichés : la prédiction doit
 * porter sur exactement ce que l'utilisateur a sous les yeux.
 */
indicatorsRouter.post(
  "/:userId/prediction",
  checkPermissions("stats", "read"),
  indicatorsWindowValidator,
  httpPostIndicatorsPrediction,
);

export default indicatorsRouter;
