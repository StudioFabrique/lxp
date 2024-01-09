import { Router } from "express";
import { searchParcoursValidator } from "./search-validators";
import httpRestrictedSearchParcours from "../../../controllers/restricted-search/http-restricted-search-parcours";

const restrictedSearchRouter = Router();

/**
 * Search all information powered by AI on a parcours
 */
restrictedSearchRouter.get(
  "/parcours/:userId/:parcoursId/:searchValue",
  searchParcoursValidator,
  httpRestrictedSearchParcours
);

export default restrictedSearchRouter;
