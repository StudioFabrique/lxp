/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";

import LinearScenarioLessons from "./linear-scenario-lessons";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import { useParams } from "react-router";
import courseScenarioFromHttp from "../../../../../../src.legacy/helpers/course/course-scenario-from-http";
import Lesson from "../../../../../../src.legacy/utils/interfaces/lesson";
import toast from "react-hot-toast";
import ButtonAdd from "../../../../../../src.legacy/components/UI/button-add/button-add";
import LessonsInDrawer from "./lessons-in-drawer";
import { autoSubmitTimer } from "../../../../../../src.legacy/config/auto-submit-timer";

const CourseScenario = () => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
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

  const handleSaveManyLessons = (lessonsIds: number[]) => {
    let newLessons = Array<number>();
    lessonsIds.forEach((id) => {
      if (!lessons.find((item) => item.id === id))
        newLessons = [...newLessons, id];
    });
    const applyData = (data: {
      success: boolean;
      message: string;
      response: { id: number; title: string };
    }) => {
      setLoading(false);
      if (data.success) {
        toast.success(data.message);
        dispatch({ type: "ADD_MANY_LESSONS", payload: [data.response as Lesson] });
      }
    };
    setLoading(true);
    sendRequest(
      {
        path: `/lesson/duplicate/${courseId}`,
        method: "post",
        body: newLessons,
      },
      applyData
    );
  };

  const reorderLessons = useCallback(() => {
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
    dispatch({ type: "RESET_SUBMIT" });
  }, [courseId, dispatch, lessons, sendRequest]);

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
    const applyData = (data: any) => {
      dispatch({ type: "INIT_COURSE_DATA", payload: courseScenarioFromHttp(data) });
    };
    sendRequest(
      {
        path: `/course/scenario/${courseId}`,
      },
      applyData
    );
  }, [courseId, dispatch, sendRequest]);

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
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
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
