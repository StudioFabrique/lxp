import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";

const useLessonsPreview = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { state: stateFromUrl } = useLocation();
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  const lessons = moduleData?.courses.flatMap((course) => course.lessons) || [];

  const switchToNextLesson = () => {
    if (selectedLesson) {
      setSelectedLesson(lessons[lessons.indexOf(selectedLesson) + 1]);
    }
  };

  const handleFinishReadLesson = () => {
    const updateModuleData = (data: { data: LessonRead }) => {
      setModuleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          courses: prev.courses.map((course) => ({
            ...course,
            lessons: course.lessons.map((lesson) => {
              if (
                lesson.id === selectedLesson?.id &&
                lesson.lessonsRead?.length === 0
              ) {
                return { ...lesson, lessonsRead: [data.data] };
              }
              return lesson;
            }),
          })),
        };
      });
      switchToNextLesson();
    };

    sendRequest(
      { path: `/lesson/read/${selectedLesson?.id}`, method: "put" },
      updateModuleData,
    );
  };

  useEffect(() => {
    if (!selectedLesson?.id) return;
    sendRequest({ path: `/lesson/${selectedLesson.id}` }, (data: Lesson) =>
      setSelectedLesson(data),
    );
  }, [selectedLesson?.id, sendRequest]);

  useEffect(() => {
    if (selectedLesson?.lessonsRead?.length === 0) {
      sendRequest({
        path: `/lesson/read/${selectedLesson.id}`,
        method: "post",
      });
    }
  }, [selectedLesson?.id, selectedLesson?.lessonsRead, sendRequest]);

  useEffect(() => {
    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      ({ data }: { data: Module }) => {
        setModuleData(data);
        if (stateFromUrl?.lessonId) {
          const lessonToSelect = data.courses
            .flatMap((course) => course.lessons)
            .find((lesson) => lesson.id === stateFromUrl.lessonId);
          setSelectedLesson(lessonToSelect);
        }
      },
    );
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  return {
    moduleData,
    selectedLesson,
    isLoading,
    setModuleData,
    setSelectedLesson,
    onFinishReadLesson: handleFinishReadLesson,
  };
};

export default useLessonsPreview;
