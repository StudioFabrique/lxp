import { Link, useSearchParams, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import CourseInfos from "../components/edit/informations/course-infos";
import { stepsCourse } from "../../../config/steps/steps-course";
import useSteps from "../../../../src/hooks/useSteps";
import CourseScenario from "../components/edit/scenario/course-scenario";
import CourseCalendar from "../components/edit/calendar/course-calendar";
import CoursePreview from "../components/edit/preview/course-preview";
import Step from "../../../../src/utils/interfaces/step";
import { useCourseDispatch } from "../store/CourseContext";
import formatCourseFromHttp from "../helpers/course-infos-from-http";
import { courseApi } from "../api/course.api";
import Stepper from "../../../components/UI/stepper-component/stepper-component";
import FloatingBottomNavigation from "../../../components/buttons/FloatingBottomNavigation";

const EditCourseHome = () => {
  const dispatch = useCourseDispatch();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsCourse as Step[]);
  const [step, setStep] = useState<string | null>(searchParams.get("step"));

  const { data: courseData } = useQuery({
    ...courseApi.queries.infos(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseData) {
      dispatch({
        type: "SET_COURSE",
        payload: formatCourseFromHttp(courseData),
      });
    }
  }, [courseData, dispatch]);

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

      {actualStep.id !== stepsList.length ? (
        <FloatingBottomNavigation
          startActions={
            actualStep.id === 1 ? (
              <Link
                className="btn btn-ghost hover:underline"
                to="/admin/course"
              >
                Retour
              </Link>
            ) : (
              <button
                className="btn btn-ghost hover:underline"
                onClick={handleRetour}
              >
                Retour
              </button>
            )
          }
          endActions={
            <button
              className="btn btn-primary px-6"
              onClick={() => handleUpdateStep(actualStep.id)}
            >
              Étape suivante
            </button>
          }
        />
      ) : null}
    </FadeWrapper>
  );
};

export default EditCourseHome;
