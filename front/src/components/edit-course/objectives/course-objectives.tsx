import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import courseObjectivesFromHttp from "../../../helpers/course/course-objectives-from-http";
import ObjectivesWithDrawer from "./objectives-with-drawer";
import Objective from "../../../utils/interfaces/objective";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import ButtonAdd from "../../UI/button-add/button-add";
import ObjectivesForm from "./objectives-form";
import { courseObjectivesActions } from "../../../store/redux-toolkit/course/course-objectives";

const CourseObjectives = () => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const isInitialRender = useRef(true);
  const [loading, setLoading] = useState(false);
  const courseObjectives = useSelector(
    (state: any) => state.courseObjectives.courseObjectives
  ) as Objective[];
  const parcoursObjectives = useSelector(
    (state: any) => state.courseObjectives.parcoursObjectives
  ) as Objective[];
  const [toggleForm, setToggleForm] = useState(false);
  const formRef = useRef<HTMLInputElement>(null);
  const { value: newObjective } = useInput((value) => regexGeneric.test(value));

  /**
   * met la liste des objectifs du cours à jour dans le state global
   * @param data Objective[]
   */
  const handleUpdateObjectives = (data: Objective[]) => {
    isInitialRender.current = false;
    dispatch(courseObjectivesActions.setCourseObjectives(data));
  };

  /**
   * enregistre le nouvel objectif dans la bdd en l'assocuiant au parcours
   * et au cours
   * @param value string
   */
  const handleSubmitNewObjective = (value: string) => {
    const applyData = (data: any) => {
      dispatch(courseObjectivesActions.updateCoursesObjectives(data.data));
      newObjective.reset();
      setToggleForm(false);
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
   * reset le formulaire et annule son affichage
   */
  const handleCancelForm = () => {
    newObjective.reset();
    setToggleForm(false);
  };

  /**
   * détecte les changements dans la liste des objectifs associés
   * au cours et les met à jour dans la bdd
   */
  useEffect(() => {
    setLoading(true);
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        const applyData = (_data: any) => {
          setLoading(false);
        };
        sendRequest(
          {
            path: `/course/objectives/${courseId}`,
            method: "put",
            body: courseObjectives.map((item) => item.id),
          },
          applyData
        );
      }, autoSubmitTimer);
    } else {
    }
    return () => clearTimeout(timer);
  }, [courseObjectives, courseId, sendRequest]);

  /**
   * retourne la liste des objectives du parcours et du cours
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
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Objectifs</h2>
      <div className="w-full">
        {courseObjectives && parcoursObjectives ? (
          <Wrapper>
            <ObjectivesWithDrawer
              loading={loading}
              initialList={parcoursObjectives}
              currentItems={courseObjectives}
              isDisabled={toggleForm}
              property="description"
              onSubmit={handleUpdateObjectives}
            />
            <div className="w-full flex justify-start">
              {!toggleForm ? (
                <ButtonAdd
                  label="Créer un nouvel objectif"
                  onClickEvent={() => setToggleForm((prevState) => !prevState)}
                  outline={true}
                />
              ) : (
                <button
                  className="btn btn-primary btn-outline"
                  onClick={handleCancelForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </Wrapper>
        ) : null}
      </div>
      {toggleForm ? (
        <Wrapper>
          <ObjectivesForm
            newObjective={newObjective}
            ref={formRef}
            onSubmit={handleSubmitNewObjective}
          />
        </Wrapper>
      ) : null}
    </div>
  );
};

export default CourseObjectives;
