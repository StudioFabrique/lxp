import express from "express";

import httpGetContacts from "../../../controllers/parcours/http-get-contacts";
import isUser from "../../../middleware/is-user";
import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpCreateParcoursRouter from "./post-create-parcours";

const parcoursRouter = express.Router();

parcoursRouter.get("/", httpGetParcours);
parcoursRouter.use("/", httpCreateParcoursRouter);
parcoursRouter.get("/contacts", isUser, httpGetContacts);

export default parcoursRouter;
