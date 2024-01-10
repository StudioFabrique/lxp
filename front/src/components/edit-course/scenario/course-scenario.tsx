/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import courseScenarioFromHttp from "../../../helpers/course/course-scenario-from-http";
import Lesson from "../../../utils/interfaces/lesson";
import toast from "react-hot-toast";
import ButtonAdd from "../../UI/button-add/button-add";
import LessonsInDrawer from "./lessons-in-drawer";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

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
  const submit = useSelector(
    (state: any) => state.courseScenario.submit
  ) as boolean;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // déclenche l'affichage d'un icone check-circle dans le composant qui affiche la liste des leçons pour signifier le succes d'une maj de la liste

  // switch entre les différents types de scénarios
  const handleChangeScenario = () => {
    dispatch(courseScenarioActions.setScenario(!scenario));
  };

  /**
   * associent plussieurs leçons à un cours dans la bdd
   * @param lessonsIds number[]
   */
  const handleSaveManyLessons = (lessonsIds: number[]) => {
    let newLessons = Array<number>();
    lessonsIds.forEach((id) => {
      if (!lessons.find((item) => item.id === id))
        newLessons = [...newLessons, id];
    });
    const applyData = (data: { success: boolean; message: string }) => {
      setLoading(false);
      if (data.success) {
        toast.success(data.message);
      }
    };
    setLoading(true);
    sendRequest(
      {
        path: `/course/lessons/${courseId}`,
        method: "put",
        body: newLessons,
      },
      applyData
    );
  };

  // envoie le nouvel arrangement des leçons au backend
  const reorderLessons = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (_data: any) => {
      setLoading(false);
      setSuccess(true);
    };
    sendRequest(
      {
        path: `/lesson/reorder/${courseId}`,
        method: "put",
        body: lessons.map((item) => item.id),
      },
      applyData
    );
    dispatch(courseScenarioActions.resetSubmit());
  }, [courseId, dispatch, lessons, sendRequest]);

  // déclenche l'envoi du nouvel arrangement de la liste des leçons au backend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        reorderLessons();
        setLoading(true);
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [submit, reorderLessons]);

  /**
   * récupère le type de scénario et les leçons qui lui sont associées
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

  /**
   * déclenche l'affichage de l'icône check-circle pour signifier la réussite de la maj de la liste des leçons
   * fait disparaître l'icône au bout de trois secondes
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
      setLoading(false);
    }
  }, [error]);

  return (
    <main className="w-full flex flex-col gap-y-8">
      <h1 className="text-xl font-bold">Scénario</h1>
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
        {scenario ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl mb-8 font-bold">Créer des leçons</h2>
              <ButtonAdd
                label="Ajouter des leçons"
                onClickEvent={() =>
                  document.getElementById("add-lessons")?.click()
                }
              />
            </div>
            <LinearScenarioLessons
              lessons={lessons}
              loading={loading}
              success={success}
            />
          </>
        ) : (
          <p>
            Branching Scénario indisponible à l'heure actuelle, revenez plus
            tard
          </p>
        )}
      </Wrapper>
      {scenario ? (
        <LessonsInDrawer onAddNewLessons={handleSaveManyLessons} />
      ) : null}
    </main>
  );
};

export default CourseScenario;
