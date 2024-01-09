import { NextFunction, Response, Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import { searchParcoursValidator } from "./search-validators";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import httpSearchParcours from "../../../controllers/search/http-search-parcours";

const searchRouter = Router();

/**
 * Search all information powered by AI on a parcours
 */
searchRouter.get(
  "/parcours/:parcoursId/:searchValue",
  searchParcoursValidator,
  (req: CustomRequest, res: Response, next: NextFunction) =>
    checkPermissions(
      "parcours",
      "update",
      `/v1/restrictedSearch/parcours/[:userId]/${req.params.parcoursId}/${req.params.searchValue}`
    )(req, res, next),
  httpSearchParcours
);

export default searchRouter;
