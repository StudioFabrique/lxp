import express from "express";
import isUser from "../../middleware/is-user";
import httpGetAllTags from "../../controllers/tag/http-get-all-tags";
import httpPutParcoursTags from "../../controllers/tag/http-put-parcours-tags";

const tagRouter = express.Router();

tagRouter.get("/", isUser, httpGetAllTags);

export default tagRouter;
