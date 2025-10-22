import { Request, Response } from "express";
import { prisma } from "../../utils/db";

type Result = {
  id: number;
  title: string;
  description: string | null;
  thumb: string | null;
};

type ResultWithMetadatas = Result & {
  metadatas: {
    id: number;
    courses: {
      id: number;
      lessons: { id: number; title: string }[];
    }[];
  }[];
};

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const { formationId, duplicate = false } = req.params;

    const modules = await prisma.modulesOnFormation.findMany({
      where: { formationId: +formationId },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            description: true,
            thumb: true,
            metadatas: {
              select: {
                id: true,
                courses: {
                  select: {
                    id: true,
                    lessons: { select: { id: true, title: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    let result: Result[] | ResultWithMetadatas[] | null = null;

    result = !duplicate
      ? modules.map((item) => ({
          ...item.module,
          thumb: item.module.thumb?.toString("base64") ?? null,
        }))
      : modules.map((item) => ({
          ...item.module,
          thumb: item.module.thumb?.toString("base64") ?? null,
          metadatas: item.module.metadatas,
        }));

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
