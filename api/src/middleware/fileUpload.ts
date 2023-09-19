import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      console.log("problem with file :");
      console.log(file);
      return;
    }
  },
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
});

export default fileUpload;
