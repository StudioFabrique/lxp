import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetTotalTokens from "../../../controllers/dashboard-ia/http-get-total-tokens.ts";
import httpGetAllGroupsStats from "../../../controllers/dashboard-ia/http-get-all-groups-stats.ts";
import httpGetTopFiveUsers from "../../../controllers/dashboard-ia/http-get-top-five-users.ts";
import { paginationValidator } from "../../../helpers/custom-validators.ts";
import { getDropoutPreferences, putDropoutPreferences, getDropoutSummaries, getGroupDropoutAnalysis, reviewGroupDropoutAlert, putGroupDropoutAlertSettings } from "../../../controllers/dashboard-ia/http-dropout-analysis.ts";

const router = Router();
router.get("/dropout/preferences", checkPermissions("dashboardIa", "read"), getDropoutPreferences);
router.put("/dropout/preferences", checkPermissions("dashboardIa", "read"), putDropoutPreferences);
router.get("/dropout/summaries", checkPermissions("dashboardIa", "read"), getDropoutSummaries);
router.get("/dropout/groups/:groupId", checkPermissions("dashboardIa", "read"), getGroupDropoutAnalysis);
router.post("/dropout/groups/:groupId/review", checkPermissions("dashboardIa", "read"), reviewGroupDropoutAlert);
router.put("/dropout/groups/:groupId/alert-settings", checkPermissions("dashboardIa", "read"), putGroupDropoutAlertSettings);

router.get(
  "/total-tokens",
  checkPermissions("dashboardIa", "read"),
  httpGetTotalTokens,
);
router.get(
  "/groups-all-stats",
  checkPermissions("dashboardIa", "read"),
  httpGetAllGroupsStats,
);
router.get(
  "/top-users/:stype/:sdir",
  checkPermissions("dashboardIa", "read"),
  paginationValidator,
  httpGetTopFiveUsers,
);

export default router;
