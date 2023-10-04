import express from "express";
import httpGetAllTags from "../../controllers/tag/http-get-all-tags";
import checkPermissions from "../../middleware/check-permissions";

const tagRouter = express.Router();

tagRouter.get("/", checkPermissions("tag"), httpGetAllTags);

export default tagRouter;
