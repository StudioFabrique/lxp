import { useRef } from "react";
import LessonForm from "../../course/components/edit/scenario/lesson-form";
import useEditLesson from "../../../../src/hooks/useEditLesson";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import { Loader2 } from "lucide-react";

function EditLesson() {
  const formRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useEditLesson();

  return (
    <main className="w-full p-2">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        <article className="w-full flex justify-between items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl font-bold">Mise à jour de la leçon</h1>
          </div>
        </article>
      </section>

      <section className="w-full">
        {lesson ? (
          <Wrapper>
            <LessonForm
              ref={formRef}
              title={title}
              description={description}
              mode={mode}
              tag={tag}
              isLoading={isLoading}
              onSetTag={setTag}
              tags={tagsList}
              onSetMode={setMode}
              onSubmitLesson={() => {}}
            >
              <div className="flex justify-end items-center gap-x-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setLessonValues(lesson)}
                >
                  Réinitialiser
                </button>
                <button
                  className="btn btn-primary flex items-center gap-x-2"
                  onClick={handleUpdateLesson}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate spin" /> : null}
                  Mettre à jour la leçon
                </button>
              </div>
            </LessonForm>
          </Wrapper>
        ) : null}
      </section>
    </main>
  );
}

export default EditLesson;
