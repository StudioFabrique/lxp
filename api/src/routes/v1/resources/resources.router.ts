import Router from "express";
import httpGetResourcesList from "../../../controllers/resources/http-get-resources-list";
import checkPermissions from "../../../middleware/check-permissions";
import httpPostResource from "../../../controllers/resources/http-post-resource";
import { uploadActivityImage } from "../../../middleware/upload-activity-image";
import mediatheque from "../../../middleware/mediatheque";
import jsonParser from "../../../middleware/json-parser";
import {
  postResourceValidator,
  resourceIdValidator,
} from "./resources-validators";
import httpGetResourceDetails from "../../../controllers/resources/http-get-resource-details";
import httpPutResource from "../../../controllers/resources/http-put-resource";
import httpDeleteResource from "../../../controllers/resources/http-delete-resource";

const resourcesRouter = Router();

resourcesRouter.get(
  "/:stype/:sdir",
  checkPermissions("lesson"),
  httpGetResourcesList,
);

resourcesRouter.post(
  "/",
  checkPermissions("lesson"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  postResourceValidator,
  httpPostResource,
);

resourcesRouter.get(
  "/:resourceId",
  checkPermissions("lesson"),
  httpGetResourceDetails,
);

resourcesRouter.put(
  "/:resourceId",
  checkPermissions("lesson"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  httpPutResource,
);

resourcesRouter.delete(
  "/:resourceId",
  checkPermissions("lesson"),
  resourceIdValidator,
  httpDeleteResource,
);

export default resourcesRouter;
