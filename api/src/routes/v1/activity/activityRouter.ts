import express from "express";

// Middleware d'authentification et de permissions
import checkPermissions from "../../../middleware/check-permissions";
// Middleware pour l'upload d'images
import { uploadActivityImage } from "../../../middleware/upload-activity-image";
import httpPostBlogImage from "../../../controllers/activity/http-post-blog-image";
// Middleware pour l'upload de vidéos
import { uploadActivityVideo } from "../../../middleware/upload-activity-video";
import httpPostVideo from "../../../controllers/activity/http-post-activity-video";
import httpDeleteActivity from "../../../controllers/activity/http-delete-activity";
import httpPutUpdateVideo from "../../../controllers/activity/http-put-activity-video";
// Validateurs pour les leçons
import { lessonIdValidator } from "../lesson/lesson-validator";
// Validateurs pour les activités
import {
  activityIdValidator,
  postVideoValidator,
  putReorderActivitiesValidator,
  putResourceValidator,
  resourceIdValidator,
  updateActivityValidator,
  updateVideoValidator,
} from "./activityValidator";
// Middleware pour parser le JSON
import jsonParser from "../../../middleware/json-parser";
// Contrôleurs pour les différentes opérations sur les activités
import httpPutReorderActivities from "../../../controllers/activity/http-put-reorder-activities";
import httpPostImage from "../../../controllers/activity/http-post-image";
import httpGetActivity from "../../../controllers/activity/http-get-activity";
import httpPutActivityText from "../../../controllers/activity/http-put-activity-text";
import httpPostActivityText from "../../../controllers/activity/http-post-activity-text";
import httpPostActivityVideo from "../../../controllers/activity/http-post-activity-video";
import httpPutActivityVideo from "../../../controllers/activity/http-put-activity-video";
import httpPutImage from "../../../controllers/activity/http-put-image";
// Middleware pour l'upload de fichiers d'activité
import { uploadActivityFiles } from "../../../middleware/upload-activity-file";
// Contrôleurs pour la gestion des ressources
import httpPostActivityResource from "../../../controllers/activity/http-post-activity-resource";
import httpPutAddResource from "../../../controllers/activity/http-put-add-resource";
import httpPutReorderResource from "../../../controllers/activity/http-put-reorder-resource";
import httpGetResourceActivity from "../../../controllers/activity/http-get-resource-activity";
import httpDeleteResource from "../../../controllers/activity/http-delete-resource";
import httpPutResource from "../../../controllers/activity/http-put-resource";
import mediatheque from "../../../middleware/mediatheque";

const activityRouter = express.Router();

// Route pour mettre à jour une activité de type vidéo
activityRouter.put(
  "/video/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  uploadActivityVideo(),
  jsonParser,
  updateVideoValidator,
  httpPutActivityVideo
);

// Route pour uploader une image qui sera insérée dans un document de type texte
activityRouter.post(
  "/blog-image",
  checkPermissions("lesson"),
  uploadActivityImage(),
  httpPostBlogImage
);

// Route pour créer une nouvelle activité de type vidéo
activityRouter.post(
  "/video/:lessonId",
  checkPermissions("lesson"),
  uploadActivityVideo(),
  jsonParser,
  lessonIdValidator,
  postVideoValidator,
  httpPostActivityVideo
);

// Route pour créer une activité de type texte et l'associer à une leçon
activityRouter.post(
  "/text/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  updateActivityValidator,
  httpPostActivityText
);

// Route pour mettre à jour une activité de type texte existante
activityRouter.put(
  "/text/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  updateActivityValidator,
  httpPutActivityText
);

// Route pour supprimer une activité et toutes ses ressources associées
activityRouter.delete(
  "/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  httpDeleteActivity
);

// Route pour réorganiser l'ordre des activités dans une leçon
activityRouter.put(
  "/reorder/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  putReorderActivitiesValidator,
  httpPutReorderActivities
);

// Route pour créer une nouvelle activité de type image
activityRouter.post(
  "/image/:lessonId",
  checkPermissions("lesson"),
  uploadActivityImage(),
  mediatheque,
  jsonParser,
  httpPostImage
);

// Route pour mettre à jour une activité de type image existante
activityRouter.put(
  "/image/:activityId",
  checkPermissions("lesson"),
  uploadActivityImage(),
  jsonParser,
  activityIdValidator,
  httpPutImage
);

// Route pour récupérer les détails d'une activité spécifique
activityRouter.get(
  "/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  httpGetActivity
);

// Route pour ajouter des ressources à une activité
activityRouter.post(
  "/resource/:lessonId",
  checkPermissions("lesson"),
  uploadActivityFiles(),
  jsonParser,
  lessonIdValidator,
  httpPostActivityResource
);

// Route pour ajouter une ressource supplémentaire à une activité existante
activityRouter.put(
  "/add-resource/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  uploadActivityFiles(),
  jsonParser,
  httpPutAddResource
);

// Route pour réorganiser l'ordre des ressources dans une activité
activityRouter.put(
  "/reorder-resource/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  putReorderActivitiesValidator,
  httpPutReorderResource
);

// Route pour récupérer toutes les ressources d'une activité
activityRouter.get(
  "/resources/:activityId",
  checkPermissions("lesson"),
  activityIdValidator,
  httpGetResourceActivity
);

// Route pour supprimer une ressource spécifique
activityRouter.delete(
  "/resource/:resourceId",
  checkPermissions("lesson"),
  resourceIdValidator,
  httpDeleteResource
);

// Route pour mettre à jour une ressource spécifique
activityRouter.put(
  "/resource/:resourceId",
  checkPermissions("lesson"),
  resourceIdValidator,
  putResourceValidator,
  httpPutResource
);

export default activityRouter;
