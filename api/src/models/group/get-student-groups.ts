import Group from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { prisma } from "../../utils/db.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { getGroupVisibilityFilter } from "../../utils/services/permissions/accessible-groups.ts";
import type { QueryFilter } from "mongoose";
import type { IGroup } from "../../utils/interfaces/db/group.ts";

type GroupsList = {
  _id: string;
  name: string;
  desc: string;
  formation: string;
  nbStudents: number;
  parcoursId: number | null;
};

export default async function getStudentGroups(
  auth: NonNullable<CustomRequest["auth"]>,
) {
  const studentRole = await Role.find({ role: "student" }, { _id: 1 });
  const visibilityFilter = await getGroupVisibilityFilter(auth);

  const groupFilter: QueryFilter<IGroup> = {
    roles: { $in: studentRole.map((role) => role._id) },
    ...visibilityFilter,
  };
  const groups = await Group.find(groupFilter, {
    _id: 1,
    name: 1,
    desc: 1,
    users: 1,
  });

  const prismaGroups = await prisma.orm.public.Group.where((row) =>
    row.idMdb.in(groups.map(({ _id }) => _id.toString())),
  )
    .select("idMdb")
    .include("parcours", (related83) =>
      related83
        .select("parcoursId")
        .include("parcours", (related84) => related84.select("title")),
    )
    .all();

  let returnedGroups: GroupsList[] = [];

  for (const prismaGroup of prismaGroups) {
    const group = groups.find(
      (item) => item._id.toString() === prismaGroup.idMdb,
    );

    if (group) {
      returnedGroups = [
        ...returnedGroups,
        {
          _id: group._id.toString(),
          desc: group.desc ?? "",
          name: group.name,
          nbStudents: group.users?.length ?? 0,
          parcoursId: prismaGroup.parcours[0]?.parcoursId ?? null,
          formation:
            prismaGroup.parcours.length > 0
              ? prismaGroup.parcours[0]!.parcours!.title
              : "",
        },
      ];
    }
  }

  return returnedGroups;
}
