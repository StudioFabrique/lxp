import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Stepper from "../../../components/UI/stepper.-component/stepper.-component";
import CourseInfos from "../../../components/edit-course/informations/course-infos";
import { stepsCourse } from "../../../config/steps/steps-course";
import useSteps from "../../../hooks/use-steps";

const EditCourseHome = () => {
  const { actualStep, finalStep, stepsList, updateStep /* validateStep */ } =
    useSteps(stepsCourse);
  return (
    <FadeWrapper>
      <div className="p-4 rounded-xl w-5/6 bg-secondary/20">
        <Stepper
          actualStep={actualStep}
          finalStep={finalStep}
          stepsList={stepsList}
          updateStep={updateStep}
        />
      </div>

      <div className="w-full 2xl:w-4/6 mt-16">
        {actualStep.id === 1 ? <CourseInfos /> : null}
      </div>
      <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
        {actualStep.id === 1 ? (
          <button className="btn btn-primary btn-outline" onClick={() => {}}>
            Retour
          </button>
        ) : (
          <button className="btn btn-primary btn-outline" onClick={() => {}}>
            Retour
          </button>
        )}
        {actualStep.id !== stepsList.length ? (
          <button className="btn btn-primary" onClick={() => {}}>
            Etape suivante
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => {}}>
            Publier
          </button>
        )}
      </div>
    </FadeWrapper>
  );
};

export default EditCourseHome;
