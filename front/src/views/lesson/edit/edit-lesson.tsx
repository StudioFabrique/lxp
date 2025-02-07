import { useParams } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useRef, useState } from "react";
import LessonForm from "../../../components/edit-course/scenario/lesson-form";
import toast from "react-hot-toast";

function EditLesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { sendRequest, error, isLoading } = useHttp();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const formRef = useRef<HTMLInputElement>(null);

  const getLesson = useCallback(() => {
    const applyData = (data: Lesson) => {
      console.log(data);
      setLesson(data);
      toast.success("Leçon récupérée avec succès");
    };
    sendRequest({ path: `/lesson/${lessonId}` }, applyData);
  }, [lessonId, sendRequest]);

  useEffect(() => {
    console.log("hello les nazes");

    getLesson();
  }, [getLesson]);

  useEffect(() => {
    console.log("toto");

    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <main className="w-full">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        <article className="w-full flex justify-between items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl font-bold">Mise à jour de la leçon</h1>
          </div>
        </article>
      </section>
      <section>
        {lesson ? (
          <LessonForm
            ref={formRef}
            {...lesson}
            tags={[]}
            onSetTag={() => {}}
            onSetMode={() => {}}
            isLoading={isLoading}
            onSubmitLesson={() => {}}
            children={<></>}
            mode={lesson.modalite}
          />
        ) : (
          <></>
        )}
      </section>
    </main>
  );
}

export default EditLesson;
