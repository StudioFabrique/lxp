import StudentFeedback from "../../../utils/interfaces/db/student-feedback";

export default async function getLastFeedbacks() {
  const result = await StudentFeedback.find({})
    .sort({ feedbackAt: "desc" })
    .limit(5)
    .populate("user", { _id: 1, firstname: 1, lastname: 1, avatar: 1 });

  console.log({ result });

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
