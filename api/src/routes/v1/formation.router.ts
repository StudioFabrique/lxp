import express from "express";
import httpGetFormation from "../../controllers/formation/http-get-formation";
import httpPutFormationTags from "../../controllers/formation/htttp-put-formation-tags";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import httpPostModule from "../../controllers/formation/http-post-module";
import checkPermissions from "../../middleware/check-permissions";

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
  // checkToken,
  upload.single("image"),
  httpPostModule
);

export default formationRouter;
