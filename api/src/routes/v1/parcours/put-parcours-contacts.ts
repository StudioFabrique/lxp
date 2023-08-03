import express from "express";
import { body } from "express-validator";

import httpPutParcoursContacts from "../../../controllers/parcours/http-put-parcours-contacts";

const putParcoursContactsRouter = express.Router();

putParcoursContactsRouter.put(
  "/" /* 
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("contacts").isArray().notEmpty(),
  body("contacts.*").isNumeric().notEmpty().escape(), */,
  httpPutParcoursContacts
);

export default putParcoursContactsRouter;
