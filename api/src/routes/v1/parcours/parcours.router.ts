import express from "express";

import httpGetContacts from "../../../controllers/parcours/http-get-contacts";
import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpCreateParcoursRouter from "./post-create-parcours";
import httpGetParcoursByFormationRouter from "./get-parcours-by-formation";
import getParcoursByIdRouter from "./get-parcours-by-id";
import putUpdateImageRouter from "./put-update-image";
import putUpdateInfosRouter from "./put-update-infos";
import putUpdateDatesRouter from "./put-updates-dates";
import httpPutParcoursTags from "../../../controllers/parcours/http-put-parcours-tags";
import deleteParcoursByIdRouter from "./delete-parcours-bu-id";
import putParcoursContactsRouter from "./put-parcours-contacts";

const parcoursRouter = express.Router();

parcoursRouter.get("/", httpGetParcours);
parcoursRouter.use("/", httpCreateParcoursRouter);
parcoursRouter.use("/parcours-by-formation", httpGetParcoursByFormationRouter);
parcoursRouter.use("/parcours-by-id", getParcoursByIdRouter);
parcoursRouter.use("/update-image", putUpdateImageRouter);
parcoursRouter.use("/update-infos", putUpdateInfosRouter);
parcoursRouter.use("/update-dates", putUpdateDatesRouter);
parcoursRouter.use("/update-tags", httpPutParcoursTags);
parcoursRouter.use("/delete", deleteParcoursByIdRouter);
parcoursRouter.use("/update-contacts", putParcoursContactsRouter);

export default parcoursRouter;
