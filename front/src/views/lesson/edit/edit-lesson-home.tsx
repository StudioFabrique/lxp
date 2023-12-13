/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import MarkDownEditor from "../../../components/edit-course/markdown-editor/mark-down-editor";
import { useState } from "react";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";

export default function EditLessonHome() {
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();
  /*   const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  ); */
  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  );
  const [value, setValue] = useState<any>();

  const handleSubmit = () => {
    const applyData = (data: any) => {
      toast.success(data.message);
    };
    sendRequest(
      {
        path: `/activity/${lessonId}`,
        method: "post",
        body: {
          type: currentType,
          //order: activities.length > 0 ? activities.length - 1 : 0,
          value,
        },
      },
      applyData
    );
  };

  console.log("leçon", activities);

  if (!currentType) {
    return (
      <div className="my-8">
        <p className="text-primary">
          Sélectionnez un type d'activité pour commencer à éditer la leçon.
        </p>
      </div>
    );
  }

  return (
    <>
      <section>
        {currentType === "text" ? (
          <MarkDownEditor value={value} onChangeValue={setValue} />
        ) : null}
      </section>
      <div className="w-full flex justify-between mt-4">
        <button className="btn btn-outline btn-primary">Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Valider
        </button>
      </div>
    </>
  );
}
