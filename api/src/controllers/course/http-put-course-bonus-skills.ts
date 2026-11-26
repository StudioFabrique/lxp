import { type Request, type Response } from "express";

import putCourseBonusSkills from "../../models/course/put-course-skills.ts";

async function httpPutCourseBonusSkills(req: Request, res: Response) {
  const { courseId } = req.params;
  const bonusSkillsIds = req.body;


  try {
    await putCourseBonusSkills(+courseId, bonusSkillsIds);
    return res.status(201).json({
      success: true,
      message: "Les compétences du cours ont été mises à jour",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message,
    });
  }
}

export default httpPutCourseBonusSkills;
