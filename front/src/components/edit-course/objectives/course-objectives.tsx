/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import courseObjectivesFromHttp from "../../../helpers/course/course-objectives-from-http";
import ObjectivesWithDrawer from "./objectives-with-drawer";
import Objective from "../../../utils/interfaces/objective";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { courseObjectivesActions } from "../../../store/redux-toolkit/course/course-objectives";

const CourseObjectives = () => {
  const { courseId } = useParams();
  const [submit, setSubmit] = useState<boolean>(false);
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingNewObjective, setLoadingNewObjective] = useState(false);
  const courseObjectives = useSelector(
    (state: any) => state.courseObjectives.courseObjectives
  ) as Objective[];
  const parcoursObjectives = useSelector(
    (state: any) => state.courseObjectives.parcoursObjectives
  ) as Objective[];

  /**
   * met la liste des objectifs du cours à jour dans le state global
   * @param data Objective[]
   */
  const handleUpdateObjectives = (data: Objective[]) => {
    setSubmit(true);
    dispatch(courseObjectivesActions.setCourseObjectives(data));
  };

  /**
   * enregistre le nouvel objectif dans la bdd en l'assocuiant au parcours
   * et au cours
   * @param value string
   */
  const handleSubmitNewObjective = (value: string) => {
    setLoadingNewObjective(true);
    const applyData = (data: any) => {
      dispatch(courseObjectivesActions.updateCoursesObjectives(data.data));
      setLoadingNewObjective(false);
      document.getElementById("add-objectives")?.click();
    };
    sendRequest(
      {
        path: `/course/new-objective/${courseId}`,
        method: "put",
        body: { description: value },
      },
      applyData
    );
  };

  /**
   * détecte les changements dans la liste des objectifs associés
   * au cours et les met à jour dans la bdd
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const applyData = (_data: any) => {
        setLoading(false);
      };
      if (submit) {
        setLoading(true);
        sendRequest(
          {
            path: `/course/objectives/${courseId}`,
            method: "put",
            body: courseObjectives.map((item) => item.id),
          },
          applyData
        );
        setSubmit(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [courseObjectives, courseId, submit, sendRequest]);

  /**
   * retourne la liste des objectifs du parcours et du cours
   * mis au propre grâce à la fonction courseObjecitvsFromHttp
   */
  useEffect(() => {
    const applyData = (data: any) => {
      dispatch(
        courseObjectivesActions.initData(courseObjectivesFromHttp(data))
      );
    };
    sendRequest(
      {
        path: `/course/objectives/${courseId}`,
      },
      applyData
    );
  }, [courseId, dispatch, sendRequest]);

  // gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
      setLoadingNewObjective(false);
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Objectifs d’apprentissage</h2>
      <div className="w-full">
        {courseObjectives && parcoursObjectives ? (
          <Wrapper>
            <ObjectivesWithDrawer
              loading={loading}
              initialList={parcoursObjectives}
              currentItems={courseObjectives}
              isDisabled={false}
              property="description"
              onSubmit={handleUpdateObjectives}
              onSubmitNewObjective={handleSubmitNewObjective}
              loadingNewObjective={loadingNewObjective}
            />
          </Wrapper>
        ) : null}
      </div>
    </div>
  );
};

export default CourseObjectives;
