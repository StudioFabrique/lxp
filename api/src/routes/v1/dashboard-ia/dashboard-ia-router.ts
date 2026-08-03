import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetTotalTokens from "../../../controllers/dashboard-ia/http-get-total-tokens.ts";
import httpGetAllGroupsStats from "../../../controllers/dashboard-ia/http-get-all-groups-stats.ts";
import httpGetTopFiveUsers from "../../../controllers/dashboard-ia/http-get-top-five-users.ts";
import { paginationValidator } from "../../../helpers/custom-validators.ts";

const router = Router();

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
