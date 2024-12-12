// Import des dépendances nécessaires
import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetMediaImages from "../../../controllers/mediatheque/http-get-media-images";

// Création du routeur pour la médiathèque
const mediaRouter = Router();

// Route GET pour récupérer toutes les images de la médiathèque
// Nécessite un token d'authentification valide
mediaRouter.get("/images", checkToken, httpGetMediaImages);

// Export du routeur
export default mediaRouter;
