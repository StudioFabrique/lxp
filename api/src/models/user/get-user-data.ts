import { sortArray } from "../../helpers/sortArray";
import { prisma } from "../../utils/db";
import { IConnectionInfos } from "../../utils/interfaces/db/connection-infos";
import User, { IUser } from "../../utils/interfaces/db/user";

export default async function getUserData(userId: string) {
  let user = (await User.findOne({ _id: userId }, { password: 0 })
    .populate("connectionInfos")
    .populate("group", { image: 0 })
    .populate("graduations")
    .populate("links")
    .populate("roles")
    .lean()) as IUser;

  if (!user) {
    throw { message: "L'apprenant n'existe pas.", statusCode: 404 };
  }

  let tmp = user.connectionInfos;

  const now = new Date().getTime();
  tmp = tmp.filter(
    (item: IConnectionInfos) =>
      new Date(item.lastConnection).getTime() >= now - 15 * 24 * 3600 * 1000,
  );

  let newInfos = Array<any>();

  for (let delay = 14; delay > 0; delay--) {
    const date = new Date(now - delay * 24 * 3600 * 1000);
    const info = tmp.find(
      (elem: any) => elem.lastConnection.getDate() === date.getDate(),
    );
    if (!info) {
      newInfos = [...newInfos, { lastConnection: date, duration: 0 }];
    }
  }

  tmp = sortArray([...tmp, ...newInfos], "lastConnection");

  user = {
    ...user,
    connectionInfos: tmp,
  } as IUser;

  let parcours: any = {};
  let parcoursCompletion = 0;

  if (user.group && user.group.length > 0) {
    let response = await prisma.group.findFirst({
      where: { idMdb: user.group[0]._id },
      select: {
        parcours: {
          select: {
            parcours: true,
          },
          orderBy: {
            parcoursId: "desc",
          },
          take: 1,
        },
      },
    });

    let lessonsIds: Array<any> = [];

    if (response && response.parcours.length > 0) {
      parcours = response.parcours.map((item: any) => item.parcours)[0];

      lessonsIds = await prisma.parcours.findMany({
        where: { id: parcours.id },
        select: {
          modules: {
            select: {
              module: {
                select: {
                  courses: {
                    select: {
                      lessons: {
                        select: { id: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    const student = await prisma.student.findFirst({
      where: { idMdb: userId },
    });

    const finishedLessons = await prisma.student.findMany({
      where: { id: student!.id },
      select: { lessonsRead: { select: { id: true } } },
    });

    parcoursCompletion = (finishedLessons.length / lessonsIds.length) * 100;

    if (parcours && parcours.image) {
      parcours = {
        ...parcours,
        image: parcours.image.toString("base64"),
      };
    }
  }

  return {
    user,
    parcours: parcours ?? null,
    parcoursCompletion: parcoursCompletion,
  };
}
