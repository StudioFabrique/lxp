import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const { formationId } = req.params;

    const modulesIdList = await prisma.modulesOnFormation.findMany({
      where: { formationId: +formationId },
    });
    const modules = await prisma.module.findMany({
      where: {
        id: { in: modulesIdList.map((item: any) => item.moduleId) },
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        thumb: true,
        contacts: true,
        bonusSkills: true,
      },
    });

    //console.log({ modules });

    const result = modules.map((module) => ({
      ...module,
      thumb: module.thumb?.toString("base64") ?? null,
    }));

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
