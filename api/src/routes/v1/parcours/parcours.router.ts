import express from "express";

import httpGetContacts from "../../../controllers/parcours/http-get-contacts";
import isUser from "../../../middleware/is-user";
import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpCreateParcoursRouter from "./post-create-parcours";
import httpGetParcoursByFormationRouter from "./get-parcours-by-formation";

const parcoursRouter = express.Router();

parcoursRouter.get("/", httpGetParcours);
parcoursRouter.use("/", httpCreateParcoursRouter);
parcoursRouter.use("/parcours-by-formation", httpGetParcoursByFormationRouter);
parcoursRouter.get("/contacts", isUser, httpGetContacts);

export default parcoursRouter;
