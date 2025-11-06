import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpParcoursModules(req: Request, res: Response) {
  try {
    const parcoursId = +req.params.parcoursId;
    const modulesId = req.body;

    const result = await prisma.parcours.update({
      where: { id: parcoursId },
      data: {
        modules: {
          connect: modulesId.map((mId: number) => {
            return {
              module: {
                connect: { id: mId },
              },
            };
          }),
        },
      },
      select: {
        modules: { select: { id: true } },
      },
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
}

export default httpParcoursModules;
