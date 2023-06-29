import express from "express";
import isUser from "../../middleware/is-user";
import httpGetBadgeIcon from "../../controllers/badge/http-get-badge-icon";
import cors from "cors";

const badgeRouter = express.Router();

badgeRouter.get(
  "/icon/:filename",
  isUser,
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
  }),
  httpGetBadgeIcon
);

export default badgeRouter;
