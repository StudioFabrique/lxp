import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityPreview from "./activity";
import Module from "../../../utils/interfaces/module";
import LessonRead from "../../../utils/interfaces/lesson-read";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  lessons: Lesson[];
  setSelectedLesson: Dispatch<SetStateAction<Lesson | undefined>>;
  setModuleData: Dispatch<SetStateAction<Module | null>>;
};

const PreviewLesson = ({
  selectedLesson,
  lessons,
  setSelectedLesson,
  setModuleData,
}: PreviewLessonProps) => {
  const { sendRequest, isLoading } = useHttp();
  const [lessonDetail, setLessonDetail] = useState<Lesson>();

  const switchToNextLesson = () => {
    selectedLesson &&
      setSelectedLesson(
        lessons[
          lessons.indexOf(selectedLesson) + 1 ?? lessons.indexOf(selectedLesson)
        ]
      );
  };

  const handleFinishReadLesson = () => {
    const applyData = (data: { data: LessonRead }) => {
      setModuleData((previousModule) => {
        if (!previousModule) return previousModule;
        previousModule.courses.map((course) =>
          course.lessons.map((lesson) => {
            if (
              lesson.id === lessonDetail?.id &&
              lesson.lessonsRead &&
              !(lesson.lessonsRead.length > 0)
            )
              lesson.lessonsRead?.push(data.data);

            return lesson;
          })
        );

        return previousModule;
      });

      switchToNextLesson();
    };

    console.log(selectedLesson.id);

    sendRequest(
      { path: `/lesson/read/${selectedLesson.id}`, method: "put" },
      applyData
    );
  };

  useEffect(() => {
    const applyData = (data: Lesson) => {
      setLessonDetail(data);
    };

    sendRequest({ path: `/lesson/${selectedLesson.id}` }, applyData);
  }, [selectedLesson.id, sendRequest]);

  useEffect(() => {
    const applyData = () => {};

    if (selectedLesson.lessonsRead && !(selectedLesson.lessonsRead?.length > 0))
      sendRequest(
        { path: `/lesson/read/${selectedLesson.id}`, method: "post" },
        applyData
      );
  }, [selectedLesson.id, selectedLesson.lessonsRead, sendRequest]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-4">
      {lessonDetail?.activities && lessonDetail?.activities.length > 0 ? (
        lessonDetail?.activities?.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))
      ) : (
        <p>Aucune activités</p>
      )}
      <button
        className="btn btn-primary text-white self-end"
        onClick={handleFinishReadLesson}
      >
        {selectedLesson.lessonsRead &&
        selectedLesson.lessonsRead?.filter(
          (lessonRead) => !!lessonRead.finishedAt
        ).length > 0
          ? "Leçon Suivante"
          : "Marquer comme terminé"}
      </button>
    </div>
  );
};

export default PreviewLesson;
