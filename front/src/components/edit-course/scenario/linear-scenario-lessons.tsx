import { useEffect, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import Lesson from "../../../utils/interfaces/lesson";
import LessonForm from "./lesson-form";
import Tag from "../../../utils/interfaces/tag";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface LinearScenarioLessonsProps {
  lessons: Lesson[];
}

const LinearScenarioLessons = (props: LinearScenarioLessonsProps) => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const tagsList = useSelector(
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];
  const [isLoading, setIsLoading] = useState(false);

  /**
   * envoie une requête HTTP pour enregistrer une nouvelle
   * leçon associée au cours
   */
  const handleSubmitLesson = () => {
    const applyData = (data: Lesson) => {
      console.log({ data });
      title.reset();
      description.reset();
      setTag(null);
      setMode("hybride");
      setIsLoading(false);
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

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setIsLoading(false);
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <LessonForm
        title={title}
        description={description}
        mode={mode}
        tag={tag}
        isLoading={isLoading}
        onSetTag={setTag}
        tags={tagsList}
        onSetMode={setMode}
        onSubmitLesson={handleSubmitLesson}
      />
      <p>LIST</p>
    </div>
  );
};

export default LinearScenarioLessons;
