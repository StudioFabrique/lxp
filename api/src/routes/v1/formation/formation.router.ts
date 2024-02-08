import express from "express";
import httpGetFormation from "../../../controllers/formation/http-get-formation";
import httpPutFormationTags from "../../../controllers/formation/htttp-put-formation-tags";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import httpPostModule from "../../../controllers/formation/http-post-module";
import checkPermissions from "../../../middleware/check-permissions";
import jsonParser from "../../../middleware/json-parser";
import { stringValidateGeneric } from "../../../helpers/custom-validators";
import httpPostFormation from "../../../controllers/formation/http-post-formation";
import {
  fomrationIdValidator,
  postFormationValidator,
  putFormationValidator,
} from "./formation-validators";
import httpGetAllFormations from "../../../controllers/formation/http-get-all-formations";
import httpPutFormation from "../../../controllers/formation/http-put-formation";
const formationRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "uploads"));
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

const validationModule = [
  body("module.formationId")
    .notEmpty()
    .withMessage("L'identifiant de la formation est requis.")
    .isInt()
    .withMessage("L'identifiant de la formation doit être un nombre entier."),
  body("module.title")
    .notEmpty()
    .withMessage("Le titre du module est requis.")
    .isString()
    .withMessage("Le titre du module doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du module contient des caractères invalides."),
  body("module.description")
    .notEmpty()
    .withMessage("La description du module est requise.")
    .isString()
    .withMessage("La description du module doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("La description du module contient des caractères"),
];

formationRouter.get("/", checkPermissions("formation"), httpGetFormation);
formationRouter.put(
  "/update-tags",
  checkPermissions("formation"),
  body("formationId").isNumeric().notEmpty().escape(),
  body("tags").isArray().notEmpty(),
  body("tags.*").isNumeric().notEmpty().escape(),
  httpPutFormationTags
);
formationRouter.post(
  "/new-module",
  checkPermissions("formation"),
  upload.single("image"),
  jsonParser,
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
  fomrationIdValidator,
  putFormationValidator,
  httpPutFormation
);

export default formationRouter;
