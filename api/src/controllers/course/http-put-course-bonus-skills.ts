import { Request, Response } from "express";

import putCourseBonusSkills from "../../models/course/put-course-skills";

async function httpPutCourseBonusSkills(req: Request, res: Response) {
  const { courseId } = req.params;
  const bonusSkillsIds = req.body;

  console.log("bonus skills : ", bonusSkillsIds);

  try {
    const response = await putCourseBonusSkills(+courseId, bonusSkillsIds);
    return res.status(201).json({
      success: true,
      message: "Les compétences du cours ont été mises à jour",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseBonusSkills;
