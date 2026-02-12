import randomInRange from "../../helpers/randomInRange";
import { DialogEntry } from "../../routes/v1/chatbot/chatbot-validators";
import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";
import PromptStats from "../../utils/interfaces/db/prompt-stats";
import User from "../../utils/interfaces/db/user";

export default async function postDialogs(
  userId: string,
  lastDialogs: DialogEntry[],
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
  });

  await newDialog.save();

  const user = await User.findById(userId).select("group");

  const promptStats = await PromptStats.findOne({
    userId,
    date: new Date().toISOString().slice(0, 10),
  });

  const rng = randomInRange(1, 10);

  if (promptStats) {
    // PromptStats existe déjà pour aujourd'hui, on met juste à jour les tokens
    promptStats.tokensUsed += rng;
    await promptStats.save();
  } else {
    // Nouveau PromptStats pour aujourd'hui
    const newPromptStats = new PromptStats({
      userId,
      date: new Date().toISOString().slice(0, 10),
      tokensUsed: rng,
      groupId: user?.group._id.toString() || null,
    });
    const savedPromptStats = await newPromptStats.save();

    // Ajouter la référence uniquement pour les nouveaux PromptStats
    if (savedPromptStats) {
      await User.findByIdAndUpdate(userId, {
        $push: { promptStats: savedPromptStats._id },
      });
    }
  }

  const promptCount = await User.findById(userId).select("promptCount");
  if (promptCount) {
    promptCount.promptCount += 1;
    await promptCount?.save();
  }
  return;
}
