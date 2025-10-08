import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const { formationId } = req.params;

    const modulesIdList = await prisma.modulesOnFormation.findMany({
      where: { formationId: +formationId },
    });

    const toto = await prisma.modulesOnFormation.findMany({
      where: { formationId: +formationId },
      include: {
        module: {
          select: { id: true, title: true, description: true, thumb: true },
        },
      },
    });

    const result = toto.map((item) => ({
      ...item.module,
      thumb: item.module.thumb?.toString("base64") ?? null,
    }));

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
