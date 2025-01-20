import Group from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import { prisma } from "../../utils/db";

type GroupsList = {
  _id: string;
  name: string;
  desc: string;
  formation: string;
  nbStudents: number;
};

export default async function getStudentGroups() {
  const studentRole = await Role.find({ role: "student" }, { _id: 1 });

  const groups = await Group.find(
    { roles: { $in: studentRole } },
    { _id: 1, name: 1, desc: 1, users: 1 }
  );

  const prismaGroups = await prisma.group.findMany({
    select: {
      idMdb: true,
      parcours: {
        select: {
          parcours: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  console.log("MONGO GROUPS : ", groups);

  console.log("PRISMA GROUPS : ", prismaGroups);

  let returnedGroups: GroupsList[] = [];

  for (const prismaGroup of prismaGroups) {
    const group = groups.find(
      (item) => item._id.toString() === prismaGroup.idMdb
    );
    console.log("STEP 1");

    if (group) {
      console.log("STEP 2");

      returnedGroups = [
        ...returnedGroups,
        {
          _id: group._id,
          desc: group.desc ?? "",
          name: group.name,
          nbStudents: group.users.length,
          formation:
            prismaGroup.parcours.length > 0
              ? prismaGroup.parcours[0].parcours.title
              : "",
        },
      ];
    }
  }

  return returnedGroups;
}
