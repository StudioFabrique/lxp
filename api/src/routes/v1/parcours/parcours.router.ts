import express from "express";

import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpCreateParcoursRouter from "./post-create-parcours";
import httpGetParcoursByFormationRouter from "./get-parcours-by-formation";
import getParcoursByIdRouter from "./get-parcours-by-id";
import putUpdateImageRouter from "./put-update-image";
import putUpdateInfosRouter from "./put-update-infos";
import putUpdateDatesRouter from "./put-updates-dates";
import putParcoursContactsRouter from "./put-parcours-contacts";
import putParcoursTagsRouter from "./put-parcours-tags";
import deleteParcoursByIdRouter from "./delete-parcours-by-id";
import putParcoursSkillsRouter from "./put-parcours-skills";

const parcoursRouter = express.Router();

parcoursRouter.get("/", httpGetParcours);
parcoursRouter.use("/", httpCreateParcoursRouter);
parcoursRouter.use("/parcours-by-formation", httpGetParcoursByFormationRouter);
parcoursRouter.use("/parcours-by-id", getParcoursByIdRouter);
parcoursRouter.use("/update-image", putUpdateImageRouter);
parcoursRouter.use("/update-infos", putUpdateInfosRouter);
parcoursRouter.use("/update-dates", putUpdateDatesRouter);
parcoursRouter.use("/update-tags", putParcoursTagsRouter);
parcoursRouter.use("/delete", deleteParcoursByIdRouter);
parcoursRouter.use("/update-contacts", putParcoursContactsRouter);
parcoursRouter.use("/update-skills", putParcoursSkillsRouter);

export default parcoursRouter;
