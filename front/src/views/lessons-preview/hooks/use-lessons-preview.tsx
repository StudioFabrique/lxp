import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";

const useLessonsPreview = () => {
  const { state: stateFromUrl } = useLocation();
  const { sendRequest, isLoading } = useHttp(true);
  const { moduleId } = useParams();

  const [moduleData, setModuleData] = useState<Module | null>(null);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  useEffect(() => {
    const applyData = (data: { data: Module }) => {
      setModuleData(data.data);

      if (stateFromUrl?.lessonId) {
        const lessonToSelect = data.data.courses
          .map((course) => {
            return course.lessons.find(
              (lesson) => lesson.id === stateFromUrl.lessonId,
            );
          })
          .filter((course) => course !== undefined)[0];

        setSelectedLesson(lessonToSelect);
      }
    };

    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData,
    );
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  return {
    moduleData,
    selectedLesson,
    setModuleData,
    setSelectedLesson,
    isLoading,
  };
};

export default useLessonsPreview;
