import { useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import Lesson from "../../../utils/interfaces/lesson";
import LessonForm from "./lesson-form";

interface LinearScenarioLessonsProps {
  lessons: Lesson[];
}

const LinearScenarioLessons = (props: LinearScenarioLessonsProps) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const [mode, setMode] = useState<string>("hybride");

  const handleSubmitLesson = () => {
    console.log("title", title.value);
    console.log("description", description.value);
    console.log("modalité", mode);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <LessonForm
        title={title}
        description={description}
        mode={mode}
        onSetMode={setMode}
        isLoading={false}
        onSubmitLesson={handleSubmitLesson}
      />
      <p>LIST</p>
    </div>
  );
};

export default LinearScenarioLessons;
