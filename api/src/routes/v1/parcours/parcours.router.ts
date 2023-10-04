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
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpDeleteParcoursById
);
parcoursRouter.get(
  "/parcours-by-formation/:formationId",
  checkPermissions("parcours"),
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpGetParcoursById
); // accès accordé à l'étudiant
parcoursRouter.get("/", checkPermissions("parcours"), httpGetParcours); // accès accordé à l'étudiant
parcoursRouter.put(
  "/update-infos",
  checkPermissions("parcours"),
  updateInfosValidator,
  httpUpdateParcoursInfos
);
parcoursRouter.put(
  "/update-dates",
  checkPermissions("parcours"),
  updateDatesValidator,
  httpUpdateParcoursDates
);
parcoursRouter.put(
  "/update-tags",
  checkPermissions("parcours"),
  putParcoursTagsValidator,
  httpPutParcoursTags
);
parcoursRouter.put(
  "/update-contacts",
  checkPermissions("parcours"),
  //putParcoursContactsValidator,
  httpPutParcoursContacts
);
//parcoursRouter.use("/update-skills", putParcoursSkillsRouter);
parcoursRouter.put(
  "/update-virtual-class",
  checkPermissions("parcours"),
  virtualClassValidator,
  httpPutVirtualClass
);
parcoursRouter.put(
  "/update-objectives",
  checkPermissions("parcours"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);
parcoursRouter.put(
  "/reorder-objectives",
  checkPermissions("parcours"),
  httpPutReorderObjectives
);
parcoursRouter.use(
  "/update-image",
  checkPermissions("parcours"),
  putUpdateImageRouter
);

parcoursRouter.put(
  "/groups",
  checkPermissions("parcours"),
  httpPutParcoursGroups
);

parcoursRouter.put(
  "/publish/:parcoursId",
  checkPermissions("parcours"),
  httpPublishParcours
);

export default parcoursRouter;
