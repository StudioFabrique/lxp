import { prisma } from "../../../utils/db";
import Group from "../../../utils/interfaces/db/group";
import StudentFeedback from "../../../utils/interfaces/db/student-feedback";
import User from "../../../utils/interfaces/db/user";

export default async function getLastFeedbacks(
  teacherId: string,
  notReviewed: boolean
) {
  console.log("Model : ", teacherId);

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

  console.log({ groupsIds });

  const studentsIds = await Group.find(
    { _id: { $in: groupsIds } },
    { _id: 1 }
  ).populate("users");

  console.log({ studentsIds });

  const ids = studentsIds.map((item) =>
    item.users.map((elem: any) => elem._id)
  );

  console.log({ ids });

  // retourne la liste des feedbacks vu ou non vus
  let result = notReviewed
    ? await StudentFeedback.find({
        user: { $in: ids[0] },
        hasBeenReviewed: false,
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate("user", { firstname: 1, lastname: 1, avatar: 1 })
    : await StudentFeedback.find({
        user: { $in: ids[0] },
      })
        .sort({ feedbackAt: "desc" })
        .limit(5)
        .populate("user", {
          firstname: 1,
          lastname: 1,
          avatar: 1,
        });

  console.log({ result });

  // retourne la liste des identifiants des formateurs ayant vus les feedbacks
  const teachersIds = result.map((item) => item.teacher._id);

  console.log({ teachersIds });

  // retourne le nom des formateurs ayant vu les feedbacks
  const teachers = await User.find(
    {
      _id: { $in: teachersIds },
    },
    { _id: 1, firstname: 1, lastname: 1 }
  );

  console.log({ teachers });

  const feedbacks = result.map((item) => ({
    _id: item._id,
    feelingLevel: item.feelingLevel,
    feedbackAt: item.feedbackAt,
    comment: item.comment,
    avatar: item.user.avatar,
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

  console.log({ feedbacks });

  for (const fb of feedbacks) {
    console.log(`FEEDBACK ID : ${fb._id} , STUDENT ID : ${fb.studentId}`);
  }

  console.log("FEEDBACKS : ", feedbacks);

  return feedbacks;
}
