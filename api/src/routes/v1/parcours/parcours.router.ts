import express from "express";
import { body } from "express-validator";

import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpDeleteParcoursById from "../../../controllers/parcours/http-delete-parcours-by-id";
import httpCreateParcours from "../../../controllers/parcours/http-create-parcours";
import putUpdateImageRouter from "./put-update-image";
import putUpdateInfosRouter from "./put-update-infos";
import putUpdateDatesRouter from "./put-updates-dates";
import putParcoursContactsRouter from "./put-parcours-contacts";
import putParcoursTagsRouter from "./put-parcours-tags";
import putParcoursSkillsRouter from "./put-parcours-skills";
import httpPutVirtualClass from "../../../controllers/parcours/http-put-virtual-class";
import checkToken from "../../../middleware/check-token";
import httpPutParcoursObjectives from "../../../controllers/parcours/http-put-parcours-objectives";
import httpPutReorderObjectives from "../../../controllers/parcours/http-put-reorder-objectives";
import {
  getParcoursByFormationValidator,
  parcoursByIdValidator,
  postParcoursValidator,
} from "./parcours-validator";
import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation";
import httpGetParcoursById from "../../../controllers/parcours/http-get-parcours-by-id";

const parcoursRouter = express.Router();

parcoursRouter.post("/", checkToken, postParcoursValidator, httpCreateParcours);
parcoursRouter.delete(
  "/:parcoursId",
  checkToken,
  parcoursByIdValidator,
  httpDeleteParcoursById
);
parcoursRouter.get(
  "/parcours-by-formation/:formationID",
  checkToken,
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkToken,
  parcoursByIdValidator,
  httpGetParcoursById
);
parcoursRouter.get("/", checkToken, httpGetParcours);

parcoursRouter.use("/update-image", putUpdateImageRouter);
parcoursRouter.use("/update-infos", putUpdateInfosRouter);
parcoursRouter.use("/update-dates", putUpdateDatesRouter);
parcoursRouter.use("/update-tags", putParcoursTagsRouter);
parcoursRouter.use("/update-contacts", checkToken, putParcoursContactsRouter);
parcoursRouter.use("/update-skills", putParcoursSkillsRouter);
parcoursRouter.put(
  "/update-virtual-class",
  body("virtualClass").isURL().notEmpty(),
  body("parcoursId").isNumeric().notEmpty(),
  httpPutVirtualClass
);
parcoursRouter.put(
  "/update-objectives",
  checkToken,
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);
parcoursRouter.put("/reorder-objectives", checkToken, httpPutReorderObjectives);

export default parcoursRouter;
