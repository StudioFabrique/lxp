import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";
import User from "../../utils/interfaces/db/user";

export default async function putDialogs(userId: string, lastDialogs: any) {
  const existingDialogs = await ChatDialogs.find({ userId }).sort({
    createdAt: 1,
  });

  if (existingDialogs.length === 20) {
    await ChatDialogs.findByIdAndDelete(existingDialogs[0]._id);
  }

  const questionDialog = lastDialogs.find(
    (dialog: any) => dialog.origin === "user",
  );
  const answerDialog = lastDialogs.find(
    (dialog: any) => dialog.origin === "bot",
  );

  console.log({ questionDialog, answerDialog });

  if (!questionDialog || !answerDialog) {
    console.log("Missing question or answer dialog");
    return;
  }

  const newDialog = new ChatDialogs({
    userId,
    question: {
      origin: "user",
      message: questionDialog.content || questionDialog.message,
      date: questionDialog.date || new Date(),
    },
    answer: {
      origin: "bot",
      message: answerDialog.content || answerDialog.message,
      date: answerDialog.date || new Date(),
    },
  });

  await newDialog.save();

  const promptCount = await User.findById(userId).select("promptCount");
  if (promptCount) {
    promptCount.promptCount += 1;
    await promptCount?.save();
  }
  return;
}
