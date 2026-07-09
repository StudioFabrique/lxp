/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";

import LinearScenarioLessons from "./linear-scenario-lessons";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import courseScenarioFromHttp from "../../../../../utils/helpers/course-scenario-from-http";
import Lesson from "../../../../../../src/utils/interfaces/lesson";
import toast from "react-hot-toast";
import LessonsInDrawer from "./lessons-in-drawer";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import { courseApi } from "../../../api/course.api";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";

const CourseScenario = () => {
  const { courseId } = useParams();
  const dispatch = useCourseDispatch();
  const scenario = useCourseSelector(
    (state) => state.scenario
  ) as boolean;
  const lessons = useCourseSelector(
    (state) => state.courseLessons
  ) as Lesson[];
  const submit = useCourseSelector(
    (state) => state.submit
  ) as boolean;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: scenarioData, error } = useQuery({
    ...courseApi.queries.scenario(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (scenarioData) {
      dispatch({
        type: "INIT_COURSE_DATA",
        payload: courseScenarioFromHttp(scenarioData),
      });
    }
  }, [scenarioData, dispatch]);

  const handleSaveManyLessons = async (lessonsIds: number[]) => {
    let newLessons = Array<number>();
    lessonsIds.forEach((id) => {
      if (!lessons.find((item) => item.id === id))
        newLessons = [...newLessons, id];
    });
    setLoading(true);
    try {
      const data = await courseApi.mutations.duplicateLessons(courseId!, newLessons);
      if (data.success) {
        toast.success(data.message);
        dispatch({ type: "ADD_MANY_LESSONS", payload: [data.response as Lesson] });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur inconnue");
    }
    setLoading(false);
  };

  const reorderLessons = useCallback(async () => {
    try {
      await courseApi.mutations.reorderLessons(
        courseId!,
        lessons.map((item) => item.id).filter((id): id is number => id !== undefined),
      );
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur inconnue");
      setLoading(false);
    }
    dispatch({ type: "RESET_SUBMIT" });
  }, [courseId, dispatch, lessons]);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message ?? "Erreur inconnue");
      setLoading(false);
    }
  }, [error]);

  return (
    <main className="w-full flex flex-col gap-y-8">
      <Wrapper>
        {scenario ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl mb-8 font-bold">
                Créer du contenu de cours
              </h2>
              <ButtonAdd
                label="Ajouter du contenu"
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
