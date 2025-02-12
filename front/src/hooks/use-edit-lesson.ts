import { useCallback, useEffect, useState } from "react";
import { regexGeneric, regexOptionalGeneric } from "../utils/constantes";
import Lesson from "../utils/interfaces/lesson";
import useInput from "./use-input";
import Tag from "../utils/interfaces/tag";
import useHttp from "./use-http";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const useEditLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { sendRequest, error, isLoading } = useHttp();
  const navigate = useNavigate();
  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value)
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const setLessonValues = useCallback(
    (lesson: Lesson) => {
      newTitle(lesson.title);
      newDescription(lesson.description);
      setTag(lesson.tag);
      setMode(lesson.modalite);
      setTagsList(lesson.course.tags);
    },
    [newTitle, newDescription]
  );

  const handleUpdateLesson = () => {
    const applyData = (data: Lesson) => {
      console.log({ data });
      navigate(`/admin/lesson`);
      toast.success("Leçon mise à jour");
    };
    sendRequest(
      {
        path: `/lesson/update`,
        method: "put",
        body: {
          id: lesson!.id,
          title: title.value,
          description: description.value,
          tagId: tag!.id,
          modalite: mode,
        },
      },
      applyData
    );
  };

  const getLesson = useCallback(() => {
    const applyData = (data: { success: boolean; lesson: Lesson }) => {
      setLesson(data.lesson);
      setLessonValues(data.lesson);
    };
    sendRequest({ path: `/lesson/edit/${lessonId}` }, applyData);
  }, [lessonId, sendRequest, setLessonValues]);

  useEffect(() => {
    getLesson();
  }, [getLesson]);

  useEffect(() => {
    console.log("toto");

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
