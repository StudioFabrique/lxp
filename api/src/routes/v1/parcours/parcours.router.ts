import express from "express";
import { body } from "express-validator";

import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpDeleteParcoursById from "../../../controllers/parcours/http-delete-parcours-by-id";
import httpCreateParcours from "../../../controllers/parcours/http-create-parcours";
import putUpdateImageRouter from "./put-update-image";
import httpPutVirtualClass from "../../../controllers/parcours/http-put-virtual-class";
import httpPutParcoursObjectives from "../../../controllers/parcours/http-put-parcours-objectives";
import httpPutReorderObjectives from "../../../controllers/parcours/http-put-reorder-objectives";
import {
  getParcoursByFormationValidator,
  parcoursByIdValidator,
  postParcoursValidator,
  putParcoursContactsValidator,
  putParcoursTagsValidator,
  updateDatesValidator,
  updateInfosValidator,
  virtualClassValidator,
} from "./parcours-validator";
import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation";
import httpGetParcoursById from "../../../controllers/parcours/http-get-parcours-by-id";
import isAdmin from "../../../middleware/is-admin";
import httpUpdateParcoursInfos from "../../../controllers/parcours/http-update-parcours-infos";
import httpUpdateParcoursDates from "../../../controllers/parcours/http-update-parcours-dates";
import httpPutParcoursTags from "../../../controllers/parcours/http-put-parcours-tags";
import httpPutParcoursContacts from "../../../controllers/parcours/http-put-parcours-contacts";

const parcoursRouter = express.Router();

parcoursRouter.post("/", isAdmin, postParcoursValidator, httpCreateParcours);
parcoursRouter.delete(
  "/:parcoursId",
  isAdmin,
  parcoursByIdValidator,
  httpDeleteParcoursById
);
parcoursRouter.get(
  "/parcours-by-formation/:formationID",
  isAdmin,
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  isAdmin,
  parcoursByIdValidator,
  httpGetParcoursById
);
parcoursRouter.get("/", isAdmin, httpGetParcours);
parcoursRouter.put(
  "/update-infos",
  isAdmin,
  updateInfosValidator,
  httpUpdateParcoursInfos
);
parcoursRouter.put(
  "/update-dates",
  isAdmin,
  updateDatesValidator,
  httpUpdateParcoursDates
);
parcoursRouter.put(
  "/update-tags",
  isAdmin,
  putParcoursTagsValidator,
  httpPutParcoursTags
);
parcoursRouter.put(
  "/update-contacts",
  isAdmin,
  //putParcoursContactsValidator,
  httpPutParcoursContacts
);
//parcoursRouter.use("/update-skills", putParcoursSkillsRouter);
parcoursRouter.put(
  "/update-virtual-class",
  isAdmin,
  virtualClassValidator,
  httpPutVirtualClass
);
parcoursRouter.put(
  "/update-objectives",
  isAdmin,
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);
parcoursRouter.put("/reorder-objectives", isAdmin, httpPutReorderObjectives);
parcoursRouter.use("/update-image", isAdmin, putUpdateImageRouter);

export default parcoursRouter;
