import { useCallback, useEffect, useState } from "react";
import { regexGeneric, regexOptionalGeneric } from "../utils/constantes";
import Lesson from "../utils/interfaces/lesson";
import useInput from "./use-input";
import Tag from "../utils/interfaces/tag";

const useEditLesson = () => {
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

  return {
    title,
    description,
    mode,
    setMode,
    tag,
    setTag,
    tagsList,
    setLessonValues,
  };
};

export default useEditLesson;
