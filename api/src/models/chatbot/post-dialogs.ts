import { DialogEntry } from "../../routes/v1/chatbot/chatbot-validators";
import ChatDialogs, {
  CourseSource,
} from "../../utils/interfaces/db/chat-dialogs";

export default async function postDialogs(
  userId: string,
  lastDialogs: DialogEntry[],
  sources?: CourseSource[],
  textSelection?: string | null,
) {
  const existingDialogs = await ChatDialogs.find({ userId }).sort({
    createdAt: 1,
  });

  if (existingDialogs.length === 20) {
    await ChatDialogs.findByIdAndDelete(existingDialogs[0]._id);
  }

  const questionDialog = lastDialogs.find(
    (dialog: DialogEntry) => dialog.origin === "user",
  );
  const answerDialog = lastDialogs.find(
    (dialog: DialogEntry) => dialog.origin === "bot",
  );

  if (!questionDialog || !answerDialog) {
    console.log("Missing question or answer dialog");
    return;
  }

  const newDialog = new ChatDialogs({
    userId,
    question: {
      origin: "user",
      message: questionDialog.message,
      date: questionDialog.date || new Date(),
    },
    answer: {
      origin: "bot",
      message: answerDialog.message,
      date: answerDialog.date || new Date(),
    },
    textSelection: textSelection || null,
    sources: sources || [],
  });

  await newDialog.save();

  return;
}
