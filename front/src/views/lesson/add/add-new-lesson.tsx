import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import Selecter from "../../../components/UI/selecter/selecter.component";
import bgImage from "../../../assets/images/chaton.jpg";
import useAddLesson from "./use-add-lesson";
import LessonForm from "../../../components/edit-course/scenario/lesson-form";
import { useEffect, useRef } from "react";

function AddNewLesson() {
  const {
    parcoursList,
    modulesList,
    courseList,
    courseId,
    setParcoursId,
    setModuleId,
    setCourseId,
    title,
    description,
    tag,
    tags,
    setTag,
    mode,
    setMode,
    handleSubmitLesson,
  } = useAddLesson();

  const formRef = useRef<HTMLInputElement>(null);

  // Image affichée sur la vue sous forme de background-image
  const classImage: React.CSSProperties = {
    backgroundImage: `url('${bgImage}')`,
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  const handleCancel = () => {
    setCourseId(null);
  };

  // quand le formulaire passe en mode édition la vue scroll jusqu'au premier champ du formulaire et lui donne le focus
  useEffect(() => {
    if (formRef && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      formRef.current.focus();
    }
  }, []);

  return (
    <FadeWrapper>
      <div className="w-full xl:w-5/6 py-8">
        <Header
          title="Créer une leçon"
          description="Créer une nouvelle leçon associée à un cours"
        />
      </div>
      <div className="xl:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 mx-auto my-16">
        <div className="flex flex-col gap-y-8">
          {!courseId ? (
            <Wrapper>
              <div className="h-full flex flex-col justify-around gap-y-4">
                <div className="font-bold">
                  Choisissez un parcours, un module et un cours
                </div>
                <div className="flex flex-col gap-y-8">
                  <Selecter
                    list={parcoursList}
                    title="Choisissez un parcours"
                    onSelectItem={setParcoursId}
                  />
                  <Selecter
                    list={modulesList}
                    title="Choisisez un module"
                    onSelectItem={setModuleId}
                  />
                  <Selecter
                    list={courseList}
                    title="Choisisez un cours"
                    onSelectItem={setCourseId}
                  />
                </div>
              </div>
            </Wrapper>
          ) : (
            <Wrapper>
              <LessonForm
                ref={formRef}
                title={title}
                description={description}
                tag={tag}
                tags={tags!}
                mode={mode}
                onSetTag={setTag}
                onSetMode={setMode}
                isLoading={false}
                onSubmitLesson={handleSubmitLesson}
              >
                <span className="flex gap-x-4 justify-end">
                  <button
                    className="btn btn-warning btn-outline"
                    type="button"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Enregistrer
                  </button>
                </span>
              </LessonForm>
            </Wrapper>
          )}
        </div>
        <div style={classImage} />
      </div>
    </FadeWrapper>
  );
}

export default AddNewLesson;
