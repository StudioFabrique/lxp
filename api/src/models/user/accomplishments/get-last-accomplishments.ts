import { and } from "@prisma/orm-postgres/orm-client";

import Group from "../../../utils/interfaces/db/group.ts";
import { prisma } from "../../../utils/db.ts";
import { Types } from "mongoose";

export default async function getLastAccomplishments(studentMdbId: string) {
  const studentsIdsMdbInSameGroup = (
    await Group.find({ users: new Types.ObjectId(studentMdbId) })
  ).flatMap((group) => (group.users ?? []).map((user) => user._id.toString()));

  const lastFeedback = await prisma.orm.public.Accomplishment.where((row) =>
    and(
      row.student.some((student) =>
        and(
          student.idMdb.in(studentsIdsMdbInSameGroup),
          student.idMdb.neq(studentMdbId),
        ),
      ),
      row.hasBeenCongratulated.eq(false),
      row.showToOtherStudent.eq(true),
    ),
  )
    .select("id", "name", "description")
    .include("student", (related42) => related42.select("id", "idMdb"))
    .orderBy((row) => row.accomplishedAt.desc())
    .distinct("studentId")
    .limit(5)
    .all();

  return lastFeedback;
}
