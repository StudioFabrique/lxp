import { useCallback, useEffect, useState } from "react";
import { regexGeneric, regexOptionalGeneric } from "../config/constantes";
import type Lesson from "../utils/interfaces/lesson";
import useInput from "./useInput";
import type Tag from "../utils/interfaces/tag";
import useHttp from "./useHttp";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router";

const useEditLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { sendRequest, error, isLoading } = useHttp();
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { value: title, newProps: newTitle } = useInput((value: any) =>
    regexGeneric.test(value),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { value: description, newProps: newDescription } = useInput((value: any) =>
    regexOptionalGeneric.test(value),
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const setLessonValues = useCallback(
    (lessonData: Lesson) => {
      newTitle(lessonData.title);
      newDescription(lessonData.description);
      setTag(lessonData.tag);
      setMode(lessonData.modalite);
      setTagsList(lessonData.course.tags);
    },
    [newTitle, newDescription],
  );

  const handleUpdateLesson = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyData = (data: any) => {
      if (location.state?.moduleId) {
        navigate(`/admin/parcours/module/${location.state.moduleId}`, {
          state: { lessonId: Number(lessonId) },
        });
      } else {
        navigate("/admin/lesson");
      }
      toast.success("Leçon mise à jour");
    };

    sendRequest(
      {
        path: "/lesson/update",
        method: "put",
        body: {
          id: lesson!.id,
          title: title.value,
          description: description.value,
          tagId: tag!.id,
          modalite: mode,
        },
      },
      applyData,
    );
  };

  const getLesson = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyData = (data: any) => {
      setLesson(data.lesson);
      setLessonValues(data.lesson);
    };
    sendRequest(
      { path: `/lesson/edit/${lessonId}` },
      applyData,
    );
  }, [lessonId, sendRequest, setLessonValues]);

  useEffect(() => {
    getLesson();
  }, [getLesson]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return {
    lesson,
    isLoading,
    title,
    description,
    mode,
    setMode,
    tag,
    setTag,
    tagsList,
    setLessonValues,
    handleUpdateLesson,
  };
};

export default useEditLesson;
