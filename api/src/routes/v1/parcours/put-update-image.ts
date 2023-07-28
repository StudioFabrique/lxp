import express from "express";
import multer from "multer";
import path from "path";
import { body } from "express-validator";

import httpUpdateImage from "../../../controllers/parcours/http-update-image";

const putUpdateImageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "..", "uploads"));
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

putUpdateImageRouter.put(
  "/",
  upload.single("image"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  httpUpdateImage
);

export default putUpdateImageRouter;
