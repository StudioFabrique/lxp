import { useParams } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import LessonForm from "../../../components/edit-course/scenario/lesson-form";
import useAddLesson from "../add/use-add-lesson";

function EditLesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { sendRequest, error, isLoading } = useHttp();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const getLesson = useCallback(() => {
    const applyData = (data: Lesson) => {
      console.log(data);
    };
    sendRequest({ path: `/lessons/${lessonId}` }, applyData);
  }, [lessonId, sendRequest]);

  useEffect(() => {
    getLesson;
  }, [getLesson]);

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
        <LessonForm
          {...lesson}
          tags={[]}
          onSetTag={() => {}}
          onSetMode={() => {}}
          isLoading={isLoading}
          onSubmitLesson={() => {}}
          children={<></>}
        />
      </section>
    </main>
  );
}

export default EditLesson;
