import express from "express";
import multer from "multer";
import path from "path";

import httpPutModuleImage from "../../../controllers/parcours/http-put-module-parcours";
import checkToken from "../../../middleware/check-token";
import httpPutModule from "../../../controllers/clone/http-put-module";

const putModuleImageRouter = express.Router();

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

putModuleImageRouter.put(
  "/",
  checkToken,
  upload.single("image"),
  httpPutModuleImage
);

putModuleImageRouter.put(
  "/update",
  checkToken,
  upload.single("image"),
  httpPutModule
);

export default putModuleImageRouter;
