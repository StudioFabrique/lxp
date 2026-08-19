import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpPostBeginContentRead from "../../../controllers/content-read/http-post-begin-content-read.ts";
import httpPostContentReadHeartbeat from "../../../controllers/content-read/http-post-content-read-heartbeat.ts";
import httpPutFinishContentRead from "../../../controllers/content-read/http-put-finish-content-read.ts";
import { contentReadValidator } from "./content-read-validators.ts";

/**
 * Suivi de consultation des contenus, tous niveaux confondus.
 *
 * Un routeur unique paramétré par `:type` plutôt que trois jeux de routes
 * quasi identiques : le comportement ne varie pas d'un niveau à l'autre.
 * Les routes historiques `POST|PUT /v1/lesson/read/:lessonId` restent en place.
 */
const contentReadRouter = Router();

// Ouverture d'un contenu.
contentReadRouter.post(
  "/:type/:id/begin",
  checkPermissions("cursus", "write"),
  contentReadValidator,
  httpPostBeginContentRead,
);

// Battement périodique : crédite le temps écoulé depuis le précédent.
contentReadRouter.post(
  "/:type/:id/heartbeat",
  checkPermissions("cursus", "write"),
  contentReadValidator,
  httpPostContentReadHeartbeat,
);

// Contenu terminé.
contentReadRouter.put(
  "/:type/:id/finish",
  checkPermissions("cursus", "update"),
  contentReadValidator,
  httpPutFinishContentRead,
);

export default contentReadRouter;
