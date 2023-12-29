import express from "express";

import checkPermissions from "../../../middleware/check-permissions";
import { uploadActivityImage } from "../../../middleware/upload-activity-image";
import httpPostBlogImage from "../../../controllers/activity/http-post-blog-image";
import { uploadActivityVideo } from "../../../middleware/upload-activity-video";
import httpPostVideo from "../../../controllers/activity/http-post-video";
import httpPostActivity from "../../../controllers/activity/http-post-activity";
import httpUpdateActivity from "../../../controllers/activity/update/http-update-activity";
import httpDeleteActivity from "../../../controllers/activity/http-delete-activity";
import httpPutUpdateVideo from "../../../controllers/activity/http-put-update-video";

const activityRouter = express.Router();

activityRouter.post(
  "/blog-image",
  checkPermissions("lesson"),
  uploadActivityImage(),
  httpPostBlogImage
);
// création d'une activité de type video
activityRouter.post(
  "/video/:lessonId",
  checkPermissions("lesson"),
  uploadActivityVideo(),
  httpPostVideo
);
// enregistre une activité et l'attache à une lesson
activityRouter.post("/:lessonId", checkPermissions("lesson"), httpPostActivity);
// met à jour un document texte
activityRouter.put(
  "/:activityId",
  checkPermissions("lesson"),
  httpUpdateActivity
);
// mise à jour d'une activité de type vidéo
activityRouter.put(
  "/video/:activityId",
  checkPermissions("lesson"),
  uploadActivityVideo(),
  httpPutUpdateVideo
);
// supprime une activité et les ressources associées (fichiers md, images, etc...)
activityRouter.delete(
  "/:activId",
  checkPermissions("lesson"),
  httpDeleteActivity
);

export default activityRouter;
