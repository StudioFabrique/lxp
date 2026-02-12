import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetTotalTokens from "../../../controllers/dashboard-ia/http-get-total-tokens";
import httpGetAllGroupsStats from "../../../controllers/dashboard-ia/http-get-all-groups-stats";

const router = Router();

router.get("/total-tokens", checkToken, httpGetTotalTokens);
router.get("/groups-all-stats", checkToken, httpGetAllGroupsStats);

export default router;
