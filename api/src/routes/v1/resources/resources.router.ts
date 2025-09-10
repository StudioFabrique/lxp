import Router from "express";
import httpGetResourcesList from "../../../controllers/resources/http-get-resources-list";
import checkPermissions from "../../../middleware/check-permissions";
import httpPostResource from "../../../controllers/resources/http-post-resource";
import { uploadActivityImage } from "../../../middleware/upload-activity-image";
import mediatheque from "../../../middleware/mediatheque";
import { json } from "body-parser";
import jsonParser from "../../../middleware/json-parser";
import { postResourceValidator } from "./resources-validators";

const resourcesRouter = Router();

resourcesRouter.get(
  "/:stype/:sdir",
  checkPermissions("lesson"),
  httpGetResourcesList
);

resourcesRouter.post(
  "/",
  checkPermissions("lesson"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  postResourceValidator,
  httpPostResource
);

export default resourcesRouter;
