import express from "express";
import httpGetAllTags from "../../../controllers/tag/http-get-all-tags.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpPostManyTags from "../../../controllers/tag/http-post-many-tags.ts";
import {
  getPaginateSearchTagsValidator,
  getPaginateTagsValidator,
  postManyTagsValidator,
  tagIdValidator,
  tagPutValidator,
} from "./tag-validator.ts";
import httpDeleteTag from "../../../controllers/tag/http-delete-tag.ts";
import httpPutTag from "../../../controllers/tag/http-put-tag.ts";
import httpGetPaginateTags from "../../../controllers/tag/http-get-paginate-tags.ts";
import httpGetPaginateSearchTags from "../../../controllers/tag/http-get-paginate-search-tags.ts";
import httpDeleteManyTags from "../../../controllers/tag/http-delete-many-tags.ts";
import { regexStringManyNumberId } from "../../../utils/constantes.ts";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import { query } from "express-validator";

const tagRouter = express.Router();

tagRouter.get("/", checkPermissions("tag"), httpGetAllTags);

// Récupérer une liste de tag avec une pagination
tagRouter.get(
  "/paginate/:stype/:sdir",
  checkPermissions("tag"),
  getPaginateTagsValidator,
  httpGetPaginateTags,
);

// Récupérer une liste de tag en fonction d'une recherche avec une pagination
tagRouter.get(
  "/paginate-search/:entity/:value/:stype/:sdir",
  checkPermissions("tag"),
  getPaginateSearchTagsValidator,
  httpGetPaginateSearchTags,
);

// enregistre plusieurs tags dans la bdd
tagRouter.post(
  "/",
  checkPermissions("tag"),
  postManyTagsValidator,
  httpPostManyTags,
);

// Met à jour un tag
tagRouter.put("/:id", checkPermissions("tag"), tagPutValidator, httpPutTag);

// Supprime un tag
tagRouter.delete(
  "/deleteSingle/:id",
  checkPermissions("tag"),
  tagIdValidator,
  httpDeleteTag,
);

// Suppression multiple de tags
tagRouter.delete(
  "/deleteMany",
  [
    query("ids")
      .matches(regexStringManyNumberId)
      .withMessage("IDs de tags invalides"),
    checkValidatorResult,
  ],
  checkPermissions("tag"),
  httpDeleteManyTags,
);

export default tagRouter;
