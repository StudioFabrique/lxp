import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const modulesIdList = await prisma.modulesOnFormation.findMany({
      where: { formationId: 1 },
    });
    const modules = await prisma.module.findMany({
      where: {
        id: { in: modulesIdList.map((item: any) => item.moduleId) },
      },
    });
    return res.status(201).json(modules);
  } catch (error) {
    console.log(error);
  }
}

export default httpGetModuleFormation;
