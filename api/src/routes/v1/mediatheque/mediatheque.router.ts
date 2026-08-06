// Import des dépendances nécessaires
import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpGetMedias from "../../../controllers/mediatheque/http-get-medias.ts";

// Création du routeur pour la médiathèque
const mediaRouter = Router();

// Route GET pour récupérer toutes les images de la médiathèque
// Nécessite un token d'authentification valide
mediaRouter.get("/", checkPermissions("mediatheque", "read"), httpGetMedias);

// Export du routeur
export default mediaRouter;
