import { whereFromObject } from "../../../utils/prisma-query.ts";
import { prisma } from "../../../utils/db.ts";
import Group from "../../../utils/interfaces/db/group.ts";
import StudentFeedback from "../../../utils/interfaces/db/student-feedback.ts";
import User from "../../../utils/interfaces/db/user.ts";
import { imageToDataUrl } from "../../../utils/images/image-source.ts";
import { Types } from "mongoose";
import type { IUser } from "../../../utils/interfaces/db/user.ts";

export default async function getLastFeedbacks(
  teacherId: string,
  notReviewed: boolean,
) {
  const groupsSql = await prisma.orm.public.Group.where((row) =>
    whereFromObject(row, {
      parcours: {
        some: {
          parcours: {
            contacts: {
              some: {
                contact: {
                  idMdb: teacherId,
                },
              },
            },
          },
        },
      },
    }),
  ).all();

  const groupsIds = groupsSql.map((item) => new Types.ObjectId(item.idMdb));

  const groups = await Group.find({ _id: { $in: groupsIds } });
  const ids = groups.flatMap((group) =>
    (group.users ?? []).map((user) => user._id),
  );

  // retourne la liste des feedbacks vu ou non vus dont les apprenants
  // ont cours avec l'utilisateur
  let result = notReviewed
    ? await StudentFeedback.find({
        $and: [{ user: { $in: ids } }, { hasBeenReviewed: true }],
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate<{ user: IUser }>("user", {
          firstname: 1,
          lastname: 1,
          avatar: 1,
        })
    : await StudentFeedback.find({
        $and: [{ user: { $in: ids } }, { hasBeenReviewed: false }],
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate<{ user: IUser }>("user", {
          firstname: 1,
          lastname: 1,
          avatar: 1,
        });

  // retourne la liste des identifiants des formateurs ayant vus les feedbacks
  const teachersIds = result
    .map((item) => item.teacher)
    .filter(
      (teacherId): teacherId is Types.ObjectId => teacherId !== undefined,
    );

  // retourne le nom des formateurs ayant vu les feedbacks
  const teachers = await User.find(
    {
      _id: { $in: teachersIds },
    },
    { _id: 1, firstname: 1, lastname: 1 },
  );

  const feedbacks = result.map((item) => ({
    _id: item._id,
    feelingLevel: item.feelingLevel,
    feedbackAt: item.feedbackAt,
    comment: item.comment,
    avatar: imageToDataUrl(item.user.avatar),
    name: `${item.user.firstname} ${item.user.lastname}`,
    hasBeenReviewed: item.hasBeenReviewed,
    studentId: item.user._id,
    // associe à chaque feedback le nom et le prénom du formateur ayant vu le feedback de l'apprenant
    teacher:
      teachers.map((elem) => {
        if (elem._id.toString() === item.teacher?.toString()) {
          return `${elem.firstname} ${elem.lastname}`;
        }
      })[0] ?? "",
  }));

  return feedbacks;
}
