import Router from "express";
import httpGetResourcesList from "../../../controllers/resources/http-get-resources-list.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpPostResource from "../../../controllers/resources/http-post-resource.ts";
import { uploadActivityImage } from "../../../middleware/upload-activity-image.ts";
import mediatheque from "../../../middleware/mediatheque.ts";
import jsonParser from "../../../middleware/json-parser.ts";
import {
  postResourceValidator,
  resourceIdValidator,
} from "./resources-validators.ts";
import httpGetResourceDetails from "../../../controllers/resources/http-get-resource-details.ts";
import httpPutResource from "../../../controllers/resources/http-put-resource.ts";
import httpDeleteResource from "../../../controllers/resources/http-delete-resource.ts";

const resourcesRouter = Router();

resourcesRouter.get(
  "/:stype/:sdir",
  checkPermissions("resource"),
  httpGetResourcesList,
);

resourcesRouter.post(
  "/",
  checkPermissions("resource"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  postResourceValidator,
  httpPostResource,
);

resourcesRouter.get(
  "/:resourceId",
  checkPermissions("resource"),
  httpGetResourceDetails,
);

resourcesRouter.put(
  "/:resourceId",
  checkPermissions("resource"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  httpPutResource,
);

resourcesRouter.delete(
  "/:resourceId",
  checkPermissions("resource"),
  resourceIdValidator,
  httpDeleteResource,
);

export default resourcesRouter;
