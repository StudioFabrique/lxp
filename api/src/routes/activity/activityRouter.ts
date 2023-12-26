import express from "express";

import checkPermissions from "../../middleware/check-permissions";
import httpPostActivity from "../../controllers/activity/http-post-activity";
import httpUpdateActivity from "../../controllers/activity/update/http-update-activity";
import { uploadActivityImage } from "../../middleware/upload-activity-image";
import httpPostBlogImage from "../../controllers/activity/http-post-blog-image";
import httpDeleteActivity from "../../controllers/activity/http-delete-activity";

const activityRouter = express.Router();

activityRouter.post(
  "/blog-image",
  checkPermissions("lesson"),
  uploadActivityImage(),
  httpPostBlogImage
);

// enregistre une activité et l'attache à une lesson
activityRouter.post("/:lessonId", checkPermissions("lesson"), httpPostActivity);

// met à jour un document texte
activityRouter.put(
  "/:activityId",
  checkPermissions("lesson"),
  httpUpdateActivity
);

// supprime une activité et les ressources associées (fichiers md, images, etc...)
activityRouter.delete(
  "/:activId",
  checkPermissions("lesson"),
  httpDeleteActivity
);

export default activityRouter;
