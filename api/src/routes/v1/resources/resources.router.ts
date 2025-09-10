import Router from "express";
import httpGetResourcesList from "../../../controllers/resources/http-get-resources-list";
import checkPermissions from "../../../middleware/check-permissions";
import { http } from "winston";
import httpPostResource from "../../../controllers/resources/http-post-resource";

const resourcesRouter = Router();

resourcesRouter.get(
  "/:stype/:sdir",
  checkPermissions("lesson"),
  httpGetResourcesList
);

resourcesRouter.post("/", checkPermissions("lesson"), httpPostResource);

export default resourcesRouter;
