import express from "express";

import checkPermissions from "../../middleware/check-permissions";
import httpPostActivity from "../../controllers/activity/http-post-activity";

const activityRouter = express.Router();

activityRouter.post("/:lessonId", checkPermissions("lesson"), httpPostActivity);

export default activityRouter;
