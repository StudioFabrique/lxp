import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";
import getLessonsByTag from "../../models/lesson/get-lessons-by-tag.ts";

async function httpGetLessonsByTag(req: CustomRequest, res: Response) {
  const { tagId } = req.params;
  const includeCourseContents = req.query.includeCourseContents === "true";
  const supplementaryResources = req.query.supplementaryResources === "true";

  try {
    const response = await getLessonsByTag(
      +tagId,
      includeCourseContents,
      supplementaryResources,
      await resolveAccessScope(req.auth!),
    );
    return res.status(200).json({ total: response.length, data: response });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpGetLessonsByTag;
