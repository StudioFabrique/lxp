import express from "express";

import httpGetContacts from "../../../controllers/parcours/http-get-contacts";
import isUser from "../../../middleware/is-user";
import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpCreateParcoursRouter from "./post-create-parcours";
import httpGetParcoursByFormationRouter from "./get-parcours-by-formation";
import getParcoursByIdRouter from "./get-parcours-by-id";
import putUpdateImageRouter from "./put-update-image";
import httpUpdateParcoursInfos from "../../../controllers/parcours/http-update-parcours-infos";

const parcoursRouter = express.Router();

parcoursRouter.get("/", httpGetParcours);
parcoursRouter.use("/", httpCreateParcoursRouter);
parcoursRouter.use("/parcours-by-formation", httpGetParcoursByFormationRouter);
parcoursRouter.use("/parcours-by-id", getParcoursByIdRouter);
parcoursRouter.use("/update-image", putUpdateImageRouter);
parcoursRouter.get("/contacts", isUser, httpGetContacts);
parcoursRouter.put("/update-infos", httpUpdateParcoursInfos);

export default parcoursRouter;
