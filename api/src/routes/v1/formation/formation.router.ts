import express from "express";
import httpGetFormation from "../../../controllers/formation/http-get-formation.ts";
import httpPutFormationTags from "../../../controllers/formation/htttp-put-formation-tags.ts";
import { body, param } from "express-validator";
import multer from "multer";
import path from "path";
import httpPostModule from "../../../controllers/formation/http-post-module.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import jsonParser from "../../../middleware/json-parser.ts";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators.ts";
import httpPostFormation from "../../../controllers/formation/http-post-formation.ts";
import {
  fomrationIdValidator,
  postFormationValidator,
  putFormationValidator,
} from "./formation-validators.ts";
import httpGetAllFormations from "../../../controllers/formation/http-get-all-formations.ts";
import httpPutFormation from "../../../controllers/formation/http-put-formation.ts";
import httpDeleteFormation from "../../../controllers/formation/http-delete-formation.ts";
import checkFormationAccess from "../../../middleware/check-formation-access.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";

const formationRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(import.meta.dirname, "..", "..", "..", "..", "uploads")
    );
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      return;
    }
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

export const validationModule = [
  body("module.formationId")
    .isInt()
    .withMessage("L'identifiant de la formation doit être un nombre entier."),
  body("module.parcoursId")
    .isInt()
    .withMessage("Un parcours valide est obligatoire."),
  body("module.title")
    .isString()
    .withMessage("Le titre du module doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du module contient des caractères invalides.")
    .not()
    .matches(/[<>]/)
    .withMessage("Le titre du module contient des balises non autorisées."),
  body("module.description")
    .isString()
    .withMessage("La description du module doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage(
      "La description du module contient des caractères non autorisés."
    )
    .not()
    .matches(/[<>]/)
    .withMessage("La description du module contient des balises non autorisées.")
    .optional(),
  body("module.duration")
    .isInt({ min: 1 })
    .withMessage("La durée doit être un nombre entier positif.")
    .optional(),
  body("module.contacts")
    .isArray()
    .withMessage("Les contacts doivent être un tableau.")
    .optional(),
  body("module.contacts.*")
    .isInt()
    .withMessage("Chaque identifiant de contact doit être un nombre entier."),
  body("module.skills")
    .isArray()
    .withMessage("Les compétences doivent être un tableau.")
    .optional(),
  body("module.skills.*")
    .isInt()
    .withMessage("Chaque identifiant de compétence doit être un nombre entier.")
    .optional(),
  param("moduleId")
    .isInt()
    .withMessage("L'identifiant du module doit être un nombre entier.")
    .optional(),
];

formationRouter.get("/", checkPermissions("formation"), httpGetFormation);

formationRouter.put(
  "/update-tags",
  checkPermissions("formation"),
  checkFormationAccess("formationId"),
  body("formationId")
    .isNumeric()
    .withMessage("L'identifiant de la formation doit être un nombre entier"),
  body("tags").isArray().withMessage("Un tableau est requis"),
  body("tags.*")
    .isNumeric()
    .withMessage("Chaque tag doit être un nombre entier"),
  httpPutFormationTags
);

formationRouter.post(
  "/new-module/:moduleId?",
  checkPermissions("module", "write"),
  upload.single("image"),
  jsonParser,
  checkContentAccess("parcours", "module.parcoursId"),
  validationModule,
  httpPostModule
);

// création d'une nouvelle formation
formationRouter.post(
  "/",
  checkPermissions("formation"),
  postFormationValidator,
  httpPostFormation
);

// retourne la liste des formations comprenant le nombre de parcours associé à chaque formation
formationRouter.get(
  "/list",
  checkPermissions("formation"),
  httpGetAllFormations
);

// mise à jour d'une formation
formationRouter.put(
  "/:formationId",
  checkPermissions("formation"),
  checkFormationAccess("formationId"),
  fomrationIdValidator,
  putFormationValidator,
  httpPutFormation
);

formationRouter.delete(
  "/:formationId",
  checkPermissions("formation"),
  checkFormationAccess("formationId"),
  fomrationIdValidator,
  httpDeleteFormation
);

export default formationRouter;
