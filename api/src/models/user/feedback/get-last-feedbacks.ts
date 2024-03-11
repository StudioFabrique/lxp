import { prisma } from "../../../utils/db";
import Group from "../../../utils/interfaces/db/group";
import StudentFeedback from "../../../utils/interfaces/db/student-feedback";
import User from "../../../utils/interfaces/db/user";

export default async function getLastFeedbacks(
  teacherId: string,
  notReviewed: boolean
) {
  const groupsSql = await prisma.group.findMany({
    where: {
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
    },
  });

  const groupsIds = groupsSql.map((item) => new Object(item.idMdb));

  const studentsIds = await Group.find(
    { _id: { $in: groupsIds } },
    { _id: 1 }
  ).populate("users");

  // retourne des tableaux d'ids d'utilisateurs, un tableau par groupes
  let usersArrays = studentsIds.map((item) =>
    item.users.map((elem: any) => elem._id)
  );

  // regroupe toutes les ids d'utilisateurs dans un seul tableau
  let ids = Array<any>();
  for (const user of usersArrays) {
    ids = [...ids, ...user.map((item: any) => item._id)];
  }

  // retourne la liste des feedbacks vu ou non vus dont les apprenants
  // ont cours avec l'utilisateur
  let result = notReviewed
    ? await StudentFeedback.find({
        $and: [{ user: { $in: ids } }, { hasBeenReviewed: true }],
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate("user", { firstname: 1, lastname: 1, avatar: 1 })
    : await StudentFeedback.find({
        $and: [{ user: { $in: ids } }, { hasBeenReviewed: false }],
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate("user", {
          firstname: 1,
          lastname: 1,
          avatar: 1,
        });

  // retourne la liste des identifiants des formateurs ayant vus les feedbacks
  const teachersIds = result.map((item) => {
    if (item.teacher) {
      return item.teacher._id;
    }
  });

  // retourne le nom des formateurs ayant vu les feedbacks
  const teachers = await User.find(
    {
      _id: { $in: teachersIds },
    },
    { _id: 1, firstname: 1, lastname: 1 }
  );

  const feedbacks = result.map((item) => ({
    _id: item._id,
    feelingLevel: item.feelingLevel,
    feedbackAt: item.feedbackAt,
    comment: item.comment,
    avatar: item.user.avatar ? item.user.avatar.toString("base64") : null,
    name: `${item.user.firstname} ${item.user.lastname}`,
    hasBeenReviewed: item.hasBeenReviewed,
    studentId: item.user._id,
    // associe à chaque feedback le nom et le prénom du formateur ayant vu le feedback de l'apprenant
    teacher:
      teachers.map((elem) => {
        if (elem._id.toString() === item.teacher.toString()) {
          return `${elem.firstname} ${elem.lastname}`;
        }
      })[0] ?? "",
  }));

  return feedbacks;
}
