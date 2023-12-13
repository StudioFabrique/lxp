import express from "express";

import checkPermissions from "../../middleware/check-permissions";
import httpPostActivity from "../../controllers/activity/activity";

const activityRouter = express.Router();

activityRouter.post("/:lessonId", checkPermissions("lesson"), httpPostActivity);

export default activityRouter;
