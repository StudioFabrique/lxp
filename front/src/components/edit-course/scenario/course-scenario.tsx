import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import TypeScenario from "./type-scenario";
import {
  branchingScenario,
  linearScenario,
} from "../../../config/scenario-description";
import { useDispatch } from "react-redux";
import { courseScenarioActions } from "../../../store/redux-toolkit/course/course-scenario";
import LinearScenarioLessons from "./linear-scenario-lessons";
import { useEffect } from "react";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import courseScenarioFromHttp from "../../../helpers/course/course-scenario-from-http";
import Lesson from "../../../utils/interfaces/lesson";
import toast from "react-hot-toast";

const CourseScenario = () => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const scenario = useSelector(
    (state: any) => state.courseScenario.scenario
  ) as boolean;
  const lessons = useSelector(
    (state: any) => state.courseScenario.courseLessons
  ) as Lesson[];

  // switch entre les différents types de scénarios
  const handleChangeScenario = () => {
    dispatch(courseScenarioActions.setScenario(!scenario));
  };

  /**
   * récuppère le type de scénario et les leçons qui lui sont associées
   */
  useEffect(() => {
    const applyData = (data: any) => {
      dispatch(courseScenarioActions.initData(courseScenarioFromHttp(data)));
    };
    sendRequest(
      {
        path: `/course/scenario/${courseId}`,
      },
      applyData
    );
  }, [courseId, dispatch, sendRequest]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="w-full flex flex-col gap-y-8">
      <h1 className="text-3xl font-bold">Scénario</h1>
      <Wrapper>
        <section className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">Type de scénario</h2>
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TypeScenario
              scenario={scenario}
              label="Scénario Linéaire (par défaut)"
              description={linearScenario}
              onChangeScenario={handleChangeScenario}
            />
            <TypeScenario
              scenario={!scenario}
              label="Scénario à embranchements (bientôt)"
              description={branchingScenario}
              onChangeScenario={handleChangeScenario}
            />
          </article>
        </section>
      </Wrapper>
      <Wrapper>
        <h2 className="text-xl mb-8 font-bold">Créer des leçons</h2>
        <LinearScenarioLessons lessons={lessons} />
      </Wrapper>
    </main>
  );
};

export default CourseScenario;
