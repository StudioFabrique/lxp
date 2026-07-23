import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const formationId = Number(req.params.formationId);
    const modules = await prisma.module.findMany({
      where: { parcours: { formationId } },
      orderBy: [{ parcours: { title: "asc" } }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        quizInstructions: true,
        description: true,
        thumb: true,
        duration: true,
        parcours: { select: { id: true, title: true } },
        courses: {
          select: {
            id: true,
            title: true,
            courseSlug: true,
            lessons: { select: { id: true, title: true } },
          },
        },
        contacts: {
          select: {
            contact: { select: { id: true, name: true, role: true } },
          },
        },
        bonusSkills: {
          select: {
            bonusSkill: { select: { id: true, description: true } },
          },
        },
      },
    });

    return res.status(200).json(
      modules.map(({ contacts, bonusSkills, courses, ...module }) => ({
        ...module,
        thumb: module.thumb
          ? Buffer.from(module.thumb as any).toString("base64")
          : null,
        contacts: contacts.map(({ contact }) => contact),
        bonusSkills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
        courses: courses.map((course) => ({
          ...course,
          aiIndexed: Boolean(course.courseSlug),
        })),
      })),
    );
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
