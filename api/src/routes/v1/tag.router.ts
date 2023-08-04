import express from "express";
import isUser from "../../middleware/is-user";
import httpGetAllTags from "../../controllers/tag/http-get-all-tags";
import httpPutParcoursTags from "../../controllers/parcours/http-put-parcours-tags";

const tagRouter = express.Router();

tagRouter.get("/", httpGetAllTags);

export default tagRouter;
