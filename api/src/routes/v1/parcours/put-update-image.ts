import express from "express";

import httpUpdateImage from "../../../controllers/parcours/http-update-image";
import multer from "multer";
import path from "path";

const putUpdateImageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    console.log("coucou");

    const newFileName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
    cb(null, file.fieldname + "-" + newFileName);
  },
});

const upload = multer({ storage: storage });

putUpdateImageRouter.put("/", upload.single("image"), httpUpdateImage);

export default putUpdateImageRouter;
