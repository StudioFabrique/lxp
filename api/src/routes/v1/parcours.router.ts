import express from "express";
import httpGetContacts from "../../controllers/parcours/http-get-contacts";
import isUser from "../../middleware/is-user";

const parcoursRouter = express.Router();

parcoursRouter.get("/contacts", isUser, httpGetContacts);

export default parcoursRouter;
