import { prisma } from "../../../utils/db";
import Group from "../../../utils/interfaces/db/group";
import StudentFeedback from "../../../utils/interfaces/db/student-feedback";

export default async function getLastFeedbacks(teacherId: string) {
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
  ).populate("users", { _id: 1 });

  const ids = studentsIds.map((item) =>
    item.users.map((elem: any) => elem._id)
  );

  const result = await StudentFeedback.find({
    user: { $in: ids[0] },
    hasBeenReviewed: false,
  })
    .sort({ feedbackAt: "desc" })
    .limit(5)
    .populate("user", { _id: 1, firstname: 1, lastname: 1, avatar: 1 });

  const feedbacks = result.map((item) => ({
    _id: item._id,
    feelingLevel: item.feelingLevel,
    feedbackAt: item.feedbackAt,
    comment: item.comment,
    avatar: item.user.avatar,
    name: `${item.user.firstname} ${item.user.lastname}`,
    hasBeenReviewed: item.hasBeenReviewed,
    studentId: item.user._id,
  }));

  return feedbacks;
}
