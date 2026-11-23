import express from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkRoleRank from "../../../middleware/check-role-rank.ts";
import {
  httpObservabilityDetails,
  httpObservabilityOverview,
  httpObservabilityUserActivity,
} from "../../../controllers/observability/http-observability-activity.ts";
import {
  detailsValidator,
  overviewValidator,
  userActivityValidator,
} from "./observability.validators.ts";
import httpObservabilityProxy, {
  httpObservabilityStatus,
} from "../../../controllers/observability/http-observability-proxy.ts";

const observabilityRouter = express.Router();

const rootOnly = [
  checkPermissions("formation"),
  checkRoleRank([0], "Cet espace est réservé au compte root."),
];

observabilityRouter.get("/status", ...rootOnly, httpObservabilityStatus);
observabilityRouter.get(
  "/overview",
  ...rootOnly,
  overviewValidator,
  httpObservabilityOverview,
);
observabilityRouter.get(
  "/details/:kind",
  ...rootOnly,
  detailsValidator,
  httpObservabilityDetails,
);
observabilityRouter.get(
  "/users/:userId/activity",
  ...rootOnly,
  userActivityValidator,
  httpObservabilityUserActivity,
);

// Réservé au root (rang 0), comme les réglages d'instance. Lecture seule.
observabilityRouter.get(
  "/select/{*path}",
  ...rootOnly,
  httpObservabilityProxy,
);

// Requêtes LogsQL de l'interface (lecture), restreintes à /select/logsql/.
observabilityRouter.post(
  "/select/logsql/{*path}",
  ...rootOnly,
  httpObservabilityProxy,
);

export default observabilityRouter;
