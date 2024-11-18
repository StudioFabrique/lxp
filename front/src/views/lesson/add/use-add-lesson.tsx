import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import Tag from "../../../utils/interfaces/tag";
import Lesson from "../../../utils/interfaces/lesson";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
};

type CourseItem = Item & {
  tags: Tag[];
};

const useAddLesson = () => {
  const { sendRequest } = useHttp();
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  const [modulesList, setModulesList] = useState<Item[]>([]);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [courseList, setCourseList] = useState<CourseItem[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const navigate = useNavigate();

  const handleSubmitLesson = () => {
    const applyData = (data: Lesson) => {
      toast.success(`La leçon ${data.title} a été créée avec succès`);
      setIsLoading(false);
      navigate("..");
    };
    setIsLoading(true);
    sendRequest(
      {
        path: `/course/new-lesson/${courseId}`,
        method: "put",
        body: {
          tagId: tag?.id,
          title: title.value,
          description: description.value,
          modalite: mode,
        },
      },
      applyData
    );
  };

  useEffect(() => {
    sendRequest({ path: "/parcours/select" }, (data: Item[]) => {
      setParcoursList(data);
    });
  }, [sendRequest]);

  useEffect(() => {
    if (parcoursId) {
      sendRequest({ path: `/modules/${parcoursId}` }, (data: Item[]) => {
        setModulesList(data);
      });
    }
  }, [parcoursId, sendRequest]);

  useEffect(() => {
    if (moduleId) {
      sendRequest(
        { path: `/course/select/${moduleId}` },
        (data: CourseItem[]) => {
          setCourseList(data);
        }
      );
    }
  }, [moduleId, sendRequest]);

  useEffect(() => {
    if (courseId) {
      const course = courseList.find((item) => item.id === courseId);
      if (course) setTags(course.tags);
    }
  }, [courseId, courseList]);

  return {
    parcoursList,
    description,
    title,
    tag,
    tags,
    setTag,
    mode,
    setMode,
    parcoursId,
    modulesList,
    moduleId,
    courseList,
    courseId,
    isLoading,
    setParcoursId,
    setModuleId,
    setCourseId,
    handleSubmitLesson,
  };
};

export default useAddLesson;
