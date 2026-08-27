import express from "express";

// Middleware d'authentification et de permissions
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";
// Middleware pour l'upload d'images
import { uploadActivityImage } from "../../../middleware/upload-activity-image.ts";
import httpPostBlogImage from "../../../controllers/activity/http-post-blog-image.ts";
// Middleware pour l'upload de vidéos
import { uploadActivityVideo } from "../../../middleware/upload-activity-video.ts";
// Validateurs pour les leçons
import {
  lessonIdValidator,
  parentIdValidator,
} from "../lesson/lesson-validator.ts";
// Validateurs pour les activités
import {
  activityIdValidator,
  idValidator,
  postIframeValidator,
  //postImage,
  postImageValidator,
  postVideoValidator,
  putImageValidator,
  putReorderActivitiesValidator,
  putResourceValidator,
  resourceIdValidator,
  updateActivityValidator,
  updateActivityTitleValidator,
  updateIframeValidator,
  updateVideoValidator,
} from "./activityValidator.ts";
// Middleware pour parser le JSON
import jsonParser from "../../../middleware/json-parser.ts";
// Contrôleurs pour les différentes opérations sur les activités
import httpPutReorderActivities from "../../../controllers/activity/http-put-reorder-activities.ts";
import httpPostImage from "../../../controllers/activity/http-post-image.ts";
import httpGetActivity from "../../../controllers/activity/http-get-activity.ts";
import httpPutActivityText from "../../../controllers/activity/http-put-activity-text.ts";
import httpPostActivityText from "../../../controllers/activity/http-post-activity-text.ts";
import httpPostActivityVideo from "../../../controllers/activity/http-post-activity-video.ts";
import httpPutActivityVideo from "../../../controllers/activity/http-put-activity-video.ts";
import httpPutImage from "../../../controllers/activity/http-put-image.ts";
// Middleware pour l'upload de fichiers d'activité
import { uploadActivityFiles } from "../../../middleware/upload-activity-file.ts";
// Contrôleurs pour la gestion des ressources
import httpPostActivityResource from "../../../controllers/activity/http-post-activity-resource.ts";
import httpPutAddResource from "../../../controllers/activity/http-put-add-resource.ts";
import httpPutReorderResource from "../../../controllers/activity/http-put-reorder-resource.ts";
import httpGetResourceActivity from "../../../controllers/activity/http-get-resource-activity.ts";
import httpDeleteResource from "../../../controllers/activity/http-delete-resource.ts";
import httpPutResource from "../../../controllers/activity/http-put-resource.ts";
import mediatheque from "../../../middleware/mediatheque.ts";
import httpDeleteActivity from "../../../controllers/activity/http-delete-activity.ts";
import httpPostActivityIframe from "../../../controllers/activity/http-post-activity-iframe.ts";
import httpPutActivityIframe from "../../../controllers/activity/http-put-activity-iframe.ts";
import httpPutActivityTitle from "../../../controllers/activity/http-put-activity-title.ts";

const activityRouter = express.Router();

// Route pour mettre à jour une activité de type vidéo
activityRouter.put(
  "/video/:activityId",
  checkPermissions("activity"),
  activityIdValidator,
  uploadActivityVideo(),
  jsonParser,
  updateVideoValidator,
  httpPutActivityVideo,
);

// Route pour uploader une image qui sera insérée dans un document de type texte
activityRouter.post(
  "/blog-image",
  checkPermissions("activity"),
  uploadActivityImage(),
  mediatheque("image"),
  httpPostBlogImage,
);

// Route pour créer une nouvelle activité de type vidéo
activityRouter.post(
  "/video/:lessonId",
  checkPermissions("activity"),
  uploadActivityVideo(),
  mediatheque("video"),
  jsonParser,
  lessonIdValidator,
  postVideoValidator,
  httpPostActivityVideo,
);

// Route pour créer une activité de type texte et l'associer à une leçon
activityRouter.post(
  "/text/:parentId",
  checkPermissions("activity"),
  parentIdValidator,
  updateActivityValidator,
  httpPostActivityText,
);

// Route pour créer une activité de type iframe et l'associer à une leçon
activityRouter.post(
  "/iframe/:lessonId",
  checkPermissions("activity"),
  lessonIdValidator,
  postIframeValidator,
  httpPostActivityIframe,
);

// Route pour créer une activité de type iframe et l'associer à une leçon
activityRouter.put(
  "/iframe/:activityId",
  checkPermissions("activity"),
  activityIdValidator,
  updateIframeValidator,
  httpPutActivityIframe,
);

// Route pour mettre à jour une activité de type texte existante
activityRouter.put(
  "/text/:id",
  checkPermissions("activity"),
  idValidator,
  updateActivityValidator,
  httpPutActivityText,
);

// Route pour mettre à jour le titre d'une activité de leçon ou de ressource
activityRouter.put(
  "/title/:activityId/:parent",
  checkPermissions("activity"),
  activityIdValidator,
  updateActivityTitleValidator,
  httpPutActivityTitle,
);

// Route pour supprimer une activité et toutes ses ressources associées
activityRouter.delete(
  "/:activityId",
  checkPermissions("activity"),
  checkContentAccess("activity", "activityId"),
  activityIdValidator,
  httpDeleteActivity,
);

// Route pour réorganiser l'ordre des activités dans une leçon
activityRouter.put(
  "/reorder/:lessonId",
  checkPermissions("activity"),
  lessonIdValidator,
  putReorderActivitiesValidator,
  httpPutReorderActivities,
);

// Route pour créer une nouvelle activité de type image
activityRouter.post(
  "/image/:lessonId/:parent",
  checkPermissions("activity"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  postImageValidator,
  httpPostImage,
);

// Route pour mettre à jour une activité de type image existante
activityRouter.put(
  "/image/:activityId/:parent",
  checkPermissions("activity"),
  uploadActivityImage(),
  mediatheque("image"),
  jsonParser,
  putImageValidator,
  httpPutImage,
);

// Route pour récupérer les détails d'une activité spécifique
activityRouter.get(
  "/:activityId",
  checkPermissions("activity"),
  checkContentAccess("activity", "activityId"),
  activityIdValidator,
  httpGetActivity,
);

// Route pour ajouter des ressources à une activité
activityRouter.post(
  "/resource/:lessonId",
  checkPermissions("activity"),
  uploadActivityFiles(),
  mediatheque("image"),
  jsonParser,
  lessonIdValidator,
  httpPostActivityResource,
);

// Route pour ajouter une ressource supplémentaire à une activité existante
activityRouter.put(
  "/add-resource/:activityId/:parent",
  checkPermissions("activity"),
  activityIdValidator,
  uploadActivityFiles(),
  jsonParser,
  httpPutAddResource,
);

// Route pour réorganiser l'ordre des ressources dans une activité
activityRouter.put(
  "/reorder-resource/:activityId",
  checkPermissions("activity"),
  activityIdValidator,
  putReorderActivitiesValidator,
  httpPutReorderResource,
);

// Route pour récupérer toutes les ressources d'une activité
activityRouter.get(
  "/resources/:activityId/:parent",
  checkPermissions("activity"),
  checkContentAccess("activity", "activityId"),
  activityIdValidator,
  httpGetResourceActivity,
);

// Route pour supprimer une ressource spécifique
activityRouter.delete(
  "/activity-resource/:resourceId",
  checkPermissions("activity"),
  resourceIdValidator,
  httpDeleteResource,
);

// Route pour mettre à jour une ressource spécifique
activityRouter.put(
  "/resource/:resourceId",
  checkPermissions("activity"),
  resourceIdValidator,
  putResourceValidator,
  httpPutResource,
);

activityRouter.delete(
  "/:type/:activityId/:parent",
  checkPermissions("activity"),
  activityIdValidator,
  httpDeleteActivity,
);

export default activityRouter;
