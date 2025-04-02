import express from "express";
import httpGetAllTags from "../../../controllers/tag/http-get-all-tags";
import checkPermissions from "../../../middleware/check-permissions";
import httpPostManyTags from "../../../controllers/tag/http-post-many-tags";
import {
  postManyTagsValidator,
  tagIdValidator,
  tagPutValidator,
} from "./tag-validator";
import httpDeleteTag from "../../../controllers/tag/http-delete-tag";
import httpPutTag from "../../../controllers/tag/http-put-tag";
import httpGetPaginateTags from "../../../controllers/tag/http-get-paginate-tags";

const tagRouter = express.Router();

tagRouter.get("/", checkPermissions("tag"), httpGetAllTags);

// Récupérer une liste de tag avec une pagination
tagRouter.get(
  "/paginate/:stype/:sdir",
  checkPermissions("tag"),
  httpGetPaginateTags,
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
  "/:id",
  checkPermissions("tag"),
  tagIdValidator,
  httpDeleteTag,
);

export default tagRouter;
