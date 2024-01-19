import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityPreview from "./activity";

type PreviewLessonProps = {
  selectedLessonId: number | undefined;
};

const PreviewLesson = ({ selectedLessonId }: PreviewLessonProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [lessonDetail, setLessonDetail] = useState<Lesson>();

  useEffect(() => {
    const applyData = (data: Lesson) => {
      setLessonDetail(data);
    };

    sendRequest({ path: `/lesson/${selectedLessonId}` }, applyData);
  }, [selectedLessonId, sendRequest]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {lessonDetail?.activities && lessonDetail?.activities.length > 0 ? (
        lessonDetail?.activities?.map((activity) => (
          <ActivityPreview activity={activity} />
        ))
      ) : (
        <p>Aucune activités</p>
      )}
    </div>
  );
};

export default PreviewLesson;
