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

    //console.log({ modules });

    const result = modules.map((module) => ({
      ...module,
      thumb: module.thumb.toString("base64"),
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
}

export default httpGetModuleFormation;
