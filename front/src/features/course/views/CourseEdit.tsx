import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

import FadeWrapper from "../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import Stepper from "../../../../src.legacy/components/UI/stepper.-component/stepper.-component";
import CourseInfos from "../components/edit/informations/course-infos";
import { stepsCourse } from "../../../../src.legacy/config/steps/steps-course";
import useSteps from "../../../../src.legacy/hooks/use-steps";
import CourseScenario from "../components/edit/scenario/course-scenario";
import CourseCalendar from "../components/edit/calendar/course-calendar";
import CoursePreview from "../components/edit/preview/course-preview";
import Step from "../../../../src.legacy/utils/interfaces/step";
import { useCourseDispatch } from "../store/CourseContext";

const EditCourseHome = () => {
  const dispatch = useCourseDispatch();
  const [searchParams] = useSearchParams();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsCourse as Step[]);
  const [step, setStep] = useState<string | null>(searchParams.get("step"));

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

  useEffect(() => {
    if (step && +step >= 1 && +step <= 4) {
      updateStep(+step);
      setStep("0");
    }
  }, [step, updateStep]);

  /**
   * reset les states globaux stockés en mémoire
   */
  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_COURSE" });
      dispatch({ type: "RESET_COURSE_SCENARIO" });
      dispatch({ type: "RESET_DATES" });
    };
  }, [dispatch]);

  return (
    <FadeWrapper>
      <div className="w-full p-4 rounded-xl bg-secondary/20">
        <Stepper
          actualStep={actualStep}
          finalStep={finalStep}
          stepsList={stepsList}
          updateStep={updateStep}
        />
      </div>

      {/* Composant principal affiché dans la vue */}
      <div className="w-full mt-16">
        {actualStep.id === 1 ? <CourseInfos /> : null}
        {actualStep.id === 2 ? <CourseScenario /> : null}
        {actualStep.id === 3 ? <CourseCalendar /> : null}
        {actualStep.id === 4 ? <CoursePreview onEdit={updateStep} /> : null}
      </div>

      <div className="w-full mt-8 flex justify-between">
        {actualStep.id !== stepsList.length ? (
          <>
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
            ) : null}
          </>
        ) : null}
      </div>
    </FadeWrapper>
  );
};

export default EditCourseHome;
