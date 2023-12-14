import { useEffect, useState } from "react";

import Lesson from "../../utils/interfaces/lesson";
import useHttp from "../../hooks/use-http";
import LessonHome from "../../components/lesson-home/lesson-home";

export default function LessonHomePage() {
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const { sendRequest } = useHttp();

  useEffect(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      lessons: Lesson[];
    }) => {
      if (data.success) {
        setLessonsList(data.lessons);
      }
    };
    sendRequest(
      {
        path: "/lesson",
      },
      applyData
    );
  }, [sendRequest]);

  console.log({ lessonsList });

  if (!lessonsList || lessonsList.length === 0) {
    return <p>Aucune leçon n'a été trouvée.</p>;
  }

  return (
    <main className="w-full flex flex-col gap-y-4">
      <LessonHome lessonsList={lessonsList} />
    </main>
  );
}
