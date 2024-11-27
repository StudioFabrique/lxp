import express from "express";

import checkPermissions from "../../../middleware/check-permissions";
import { uploadActivityImage } from "../../../middleware/upload-activity-image";
import httpPostBlogImage from "../../../controllers/activity/http-post-blog-image";
import { uploadActivityVideo } from "../../../middleware/upload-activity-video";
import httpPostVideo from "../../../controllers/activity/http-post-activity-video";
import httpDeleteActivity from "../../../controllers/activity/http-delete-activity";
import httpPutUpdateVideo from "../../../controllers/activity/http-put-activity-video";
import { lessonIdValidator } from "../lesson/lesson-validator";
import {
  activityIdValidator,
  postVideoValidator,
  putReorderActivitiesValidator,
  updateActivityValidator,
  updateVideoValidator,
} from "./activityValidator";
import jsonParser from "../../../middleware/json-parser";
import httpPutReorderActivities from "../../../controllers/activity/http-put-reorder-activities";
import httpPostImage from "../../../controllers/activity/http-post-image";
import httpGetActivity from "../../../controllers/activity/http-get-activity";
import httpPutActivityText from "../../../controllers/activity/http-put-activity-text";
import httpPostActivityText from "../../../controllers/activity/http-post-activity-text";
import httpPostActivityVideo from "../../../controllers/activity/http-post-activity-video";
import httpPutActivityVideo from "../../../controllers/activity/http-put-activity-video";
import httpPutImage from "../../../controllers/activity/http-put-image";
import { uploadActivityFiles } from "../../../middleware/upload-activity-file";
import httpPostActivityResource from "../../../controllers/activity/http-post-activity-resource";

const activityRouter = express.Router();

// mise à jour d'une activité de type vidéo
activityRouter.put(
  "/video/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  uploadActivityVideo(),
  jsonParser,
  updateVideoValidator,
  httpPutActivityVideo
);
// upload d'une image insérée dans un document de type texte
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
  jsonParser,
  lessonIdValidator,
  postVideoValidator,
  httpPostActivityVideo
);

// enregistre une activité et l'attache à une lesson
activityRouter.post(
  "/text/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  updateActivityValidator,
  httpPostActivityText
);

// met à jour un document texte
activityRouter.put(
  "/text/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  updateActivityValidator,
  httpPutActivityText
);
// supprime une activité et les ressources associées (fichiers md, images, etc...)
activityRouter.delete(
  "/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  httpDeleteActivity
);
// réorganise l'ordre des activités liées à une leçon
activityRouter.put(
  "/reorder/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  putReorderActivitiesValidator,
  httpPutReorderActivities
);

//  sauvegarde une activité de type image en bdd
activityRouter.post(
  "/image/:lessonId",
  checkPermissions("lesson"),
  uploadActivityImage(),
  jsonParser,
  httpPostImage
);

// met à jour une activité de type image
activityRouter.put(
  "/image/:activityId",
  checkPermissions("lesson"),
  uploadActivityImage(),
  jsonParser,
  activityIdValidator,
  httpPutImage
);

// récupère une activité
activityRouter.get(
  "/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  httpGetActivity
);

// upload des ressources pour une activiité
activityRouter.post(
  "/resource/:lessonId",
  checkPermissions("lesson"),
  uploadActivityFiles(),
  jsonParser,
  lessonIdValidator,
  httpPostActivityResource
);

export default activityRouter;
