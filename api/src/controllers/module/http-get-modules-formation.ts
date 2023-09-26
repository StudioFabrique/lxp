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
    });
    return res.status(200).json(modules);
  } catch (error) {
    console.log(error);
  }
}

export default httpGetModuleFormation;
