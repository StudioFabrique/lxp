import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetTotalTokens from "../../../controllers/dashboard-ia/http-get-total-tokens";

const router = Router();

router.get("/total-tokens", checkToken, httpGetTotalTokens);

export default router;
