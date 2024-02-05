import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityPreview from "./activity";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  lessons: Lesson[];
  setSelectedLesson: Dispatch<SetStateAction<Lesson | undefined>>;
};

const PreviewLesson = ({
  selectedLesson,
  lessons,
  setSelectedLesson,
}: PreviewLessonProps) => {
  const { sendRequest, isLoading } = useHttp(true);
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
    const applyData = () => {
      switchToNextLesson();
    };

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

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col">
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
        Leçon Suivante
      </button>
    </div>
  );
};

export default PreviewLesson;
