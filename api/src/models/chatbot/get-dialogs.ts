import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";

export default async function getDialogs(userId: string) {
  const existingDialogs = await ChatDialogs.find({ userId }).sort({
    createdAt: 1,
  });

  let result: any[] = [];

  for (const d of existingDialogs) {
    result = [
      ...result,
      {
        origin: d.question.origin,
        message: d.question.message,
        date: d.question.date,
      },
      {
        origin: d.answer.origin,
        message: d.answer.message,
        date: d.answer.date,
      },
    ];
  }

  return result;
}
