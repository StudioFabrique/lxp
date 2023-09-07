import { Request, Response } from "express";
import { prisma } from "../../utils/db";

async function httpParcoursModules(req: Request, res: Response) {
  try {
    const parcoursId = +req.params.parcoursId;
    const modulesId = req.body;

    let result;

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.modulesOnParcours.deleteMany({
        where: { parcoursId },
      });

      result = await tx.parcours.update({
        where: { id: parcoursId },
        data: {
          modules: {
            create: modulesId.map((mId: number) => {
              return {
                module: {
                  connect: { id: mId },
                },
              };
            }),
          },
        },
        select: {
          modules: {
            select: {
              module: { select: { id: true } },
            },
          },
        },
      });
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
}

export default httpParcoursModules;
