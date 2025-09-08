import Router from "express";
import httpGetResourcesList from "../../../controllers/resources/http-get-resources-list";
import checkPermissions from "../../../middleware/check-permissions";

const resourcesRouter = Router();

resourcesRouter.get(
  "/:stype/:sdir",
  checkPermissions("lesson"),
  httpGetResourcesList
);

export default resourcesRouter;
