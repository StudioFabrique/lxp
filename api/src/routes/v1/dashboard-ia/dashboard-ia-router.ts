import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetTotalTokens from "../../../controllers/dashboard-ia/http-get-total-tokens";
import httpGetAllGroupsStats from "../../../controllers/dashboard-ia/http-get-all-groups-stats";
import httpGetTopFiveUsers from "../../../controllers/dashboard-ia/http-get-top-five-users";
import { paginationValidator } from "../../../helpers/custom-validators";

const router = Router();

router.get("/total-tokens", checkToken, httpGetTotalTokens);
router.get("/groups-all-stats", checkToken, httpGetAllGroupsStats);
router.get(
  "/top-users/:stype/:sdir",
  checkToken,
  paginationValidator,
  httpGetTopFiveUsers,
);

export default router;
