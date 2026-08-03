import express from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetParcours from "../../../controllers/evaluation/http-get-parcours.ts";

const evaluationRouter = express.Router();

evaluationRouter.get("/parcours", checkPermissions("user"), httpGetParcours);

export default evaluationRouter;
