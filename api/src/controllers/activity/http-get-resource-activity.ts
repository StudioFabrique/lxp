import { Request, Response, NextFunction } from "express";
import getResourceActivity from "../../models/activity/get-resource-activity";

export default async function httpGetResourceActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { activityId } = req.params;
    let parent = req.params.parent as "lesson" | "resource";

    if (!parent) parent = "lesson";
    const resources = await getResourceActivity(+activityId, parent);
    next({ statusCode: 200, data: { success: true, resources } });
  } catch (error: any) {
    next({ statusCode: 500, message: error.message });
  }
}
