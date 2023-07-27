import express from "express";

import httpUpdateImage from "../../../controllers/parcours/http-update-image";

const putUpdateImageRouter = express.Router();

putUpdateImageRouter.put("/", httpUpdateImage);

export default putUpdateImageRouter;
