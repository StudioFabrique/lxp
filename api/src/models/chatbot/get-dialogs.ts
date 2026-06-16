import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";

export default async function getDialogs(userId: string) {
  const dialogs = await ChatDialogs.find({ userId }).sort({ createdAt: 1 });

  const formattedDialogs: any[] = [];

  dialogs.forEach((doc) => {
    formattedDialogs.push({
      origin: "user",
      message: doc.question.message,
      date: doc.question.date,
      textSelection: doc.textSelection || undefined,
    });

    formattedDialogs.push({
      origin: "bot",
      message: doc.answer.message,
      date: doc.answer.date,
      type: "normal",
      sources: doc.sources || [],
    });
  });

  return formattedDialogs;
}
