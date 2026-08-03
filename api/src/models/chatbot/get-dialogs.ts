import ChatDialogs from "../../utils/interfaces/db/chat-dialogs.ts";
import resolveSourceTarget from "./resolve-source-target.ts";

export default async function getDialogs(userId: string) {
  const dialogs = await ChatDialogs.find({ userId }).sort({ createdAt: 1 });

  const formattedDialogs: any[] = [];

  for await (const doc of dialogs) {
    formattedDialogs.push({
      origin: "user",
      message: doc.question.message,
      date: doc.question.date,
      textSelection: doc.textSelection || undefined,
    });

    const sources = doc.sources
      ? await Promise.all(
          doc.sources?.map(async (source) => {
            const target = await resolveSourceTarget(source);

            return {
              activity: source.activity,
              course: source.course,
              heading_path: source.heading_path,
              score: source.score,
              section: source.section,
              ...target,
            };
          }),
        )
      : [];

    formattedDialogs.push({
      origin: "bot",
      message: doc.answer.message,
      date: doc.answer.date,
      type: "normal",
      sources,
    });
  }

  return formattedDialogs;
}
