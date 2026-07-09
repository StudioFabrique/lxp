import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Header from "../../../../src/components/headers/Header";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import bgImage from "../../../../src/assets/images/lesson.png";

import useAddLesson from "../hooks/useAddLesson";

import LessonForm from "../../../features/course/components/edit/scenario/lesson-form";
import CourseSelecters from "../../../../src/components/add-lesson/course-selecters";
import NewLessonActions from "../../../../src/components/add-lesson/new-lesson-actions";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";

function AddNewLesson() {
  const {
    parcoursList,
    parcoursId,
    modulesList,
    moduleId,
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
    getItem,
    handleResetForm,
    handleStep,
    nextClicked,
    isLoading,
  } = useAddLesson();

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(bgImage),
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <FadeWrapper>
      <div className="w-full">
        <Header
          title="Créer une leçon"
          description="Créer une nouvelle leçon associée à un cours"
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto my-16">
        <CourseSelecters
          parcoursList={parcoursList}
          modulesList={modulesList}
          courseList={courseList}
          parcoursId={parcoursId}
          moduleId={moduleId}
          courseId={courseId}
          handleStep={handleStep}
          getItem={getItem}
          setParcoursId={setParcoursId}
          setModuleId={setModuleId}
          setCourseId={setCourseId}
        />

        {nextClicked ? (
          <Wrapper>
            <LessonForm
              title={title}
              description={description}
              tag={tag}
              tags={tags!}
              mode={mode}
              onSetTag={setTag}
              onSetMode={setMode}
              isLoading={isLoading}
              onSubmitLesson={handleSubmitLesson}
            >
              <NewLessonActions
                isLoading={false}
                handleResetForm={handleResetForm}
                handleStep={handleStep}
              />
            </LessonForm>
          </Wrapper>
        ) : (
          <div style={classImage} />
        )}
      </div>
    </FadeWrapper>
  );
}

export default AddNewLesson;
