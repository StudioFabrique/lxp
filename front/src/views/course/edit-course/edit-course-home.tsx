import { Link } from "react-router-dom";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Stepper from "../../../components/UI/stepper.-component/stepper.-component";
import CourseInfos from "../../../components/edit-course/informations/course-infos";
import CourseObjectives from "../../../components/edit-course/objectives/course-objectives";
import { stepsCourse } from "../../../config/steps/steps-course";
import useSteps from "../../../hooks/use-steps";
import CourseSkills from "../../../components/edit-course/skills/course-skills";

const EditCourseHome = () => {
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsCourse);

  /**
   * actualise le stepper et affiche le composant précédent
   * associé à l'étape précédente
   */
  const handleRetour = () => {
    updateStep(actualStep.id - 1);
  };

  /**
   * valide l'étape en cours et affiche le composant
   * correspondant à l'étape suivante de la création de
   * cours
   * @param id number
   */
  const handleUpdateStep = (id: number) => {
    validateStep(id, true);
  };

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
        {actualStep.id === 2 ? <CourseObjectives /> : null}
        {actualStep.id === 3 ? <CourseSkills /> : null}
      </div>
      <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
        {actualStep.id === 1 ? (
          <Link className="btn btn-primary btn-outline" to="/admin/course">
            Retour
          </Link>
        ) : (
          <button
            className="btn btn-primary btn-outline"
            onClick={handleRetour}
          >
            Retour
          </button>
        )}
        {actualStep.id !== stepsList.length ? (
          <button
            className="btn btn-primary"
            onClick={() => handleUpdateStep(actualStep.id)}
          >
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
