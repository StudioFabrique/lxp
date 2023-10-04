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
import checkToken from "../../../middleware/check-token";
import httpPutParcoursGroups from "../../../controllers/parcours/http-put-parcours-groups";
import httpPublishParcours from "../../../controllers/parcours/http-publish-parcours";
import isStudent from "../../../middleware/is-student";
import checkPermissions from "../../../middleware/check-permissions";

const parcoursRouter = express.Router();
parcoursRouter.get("/", checkToken, httpGetParcours);
parcoursRouter.post("/", isAdmin, postParcoursValidator, httpCreateParcours);
parcoursRouter.delete(
  "/:parcoursId",
  checkPermissions(1, "parcours"),
  parcoursByIdValidator,
  httpDeleteParcoursById
);
parcoursRouter.get(
  "/parcours-by-formation/:formationId",
  checkPermissions(1, "parcours"),
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkPermissions(3, "parcours"),
  parcoursByIdValidator,
  httpGetParcoursById
); // accès accordé à l'étudiant
parcoursRouter.get("/", checkPermissions(3, "parcours"), httpGetParcours); // accès accordé à l'étudiant
parcoursRouter.put(
  "/update-infos",
  checkPermissions(1, "parcours"),
  updateInfosValidator,
  httpUpdateParcoursInfos
);
parcoursRouter.put(
  "/update-dates",
  checkPermissions(1, "parcours"),
  updateDatesValidator,
  httpUpdateParcoursDates
);
parcoursRouter.put(
  "/update-tags",
  checkPermissions(1, "parcours"),
  putParcoursTagsValidator,
  httpPutParcoursTags
);
parcoursRouter.put(
  "/update-contacts",
  checkPermissions(1, "parcours"),
  //putParcoursContactsValidator,
  httpPutParcoursContacts
);
//parcoursRouter.use("/update-skills", putParcoursSkillsRouter);
parcoursRouter.put(
  "/update-virtual-class",
  checkPermissions(1, "parcours"),
  virtualClassValidator,
  httpPutVirtualClass
);
parcoursRouter.put(
  "/update-objectives",
  checkPermissions(1, "parcours"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);
parcoursRouter.put(
  "/reorder-objectives",
  checkPermissions(1, "parcours"),
  httpPutReorderObjectives
);
parcoursRouter.use(
  "/update-image",
  checkPermissions(1, "parcours"),
  putUpdateImageRouter
);

parcoursRouter.put(
  "/groups",
  checkPermissions(1, "parcours"),
  httpPutParcoursGroups
);

parcoursRouter.put(
  "/publish/:parcoursId",
  checkPermissions(1, "parcours"),
  httpPublishParcours
);

export default parcoursRouter;
