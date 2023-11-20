/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import useHttp from "../../../hooks/use-http";
import courseSkillsFromHttp from "../../../helpers/course/course-skills-from-http";
import Skill from "../../../utils/interfaces/skill";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SkillsWithDrawer from "./skills-with-drawer";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { courseSkillsActions } from "../../../store/redux-toolkit/course/course-skills";

const CourseSkills = () => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const courseSkills = useSelector(
    (state: any) => state.courseSkills.courseSkills
  ) as Skill[];
  const moduleSkills = useSelector(
    (state: any) => state.courseSkills.moduleSkills
  ) as Skill[];

  /**
   * met la liste des compétences du cours à jour dans le state global
   * @param data Skill[]
   */
  const handleUpdateSkills = (data: Skill[]) => {
    setSubmit(true);
    dispatch(courseSkillsActions.setCourseSkills(data));
  };

  /**
   * détecte les changements dans la liste des compétences associées
   * au cours et les met à jour dans la bdd
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (submit) {
        //typescript-eslint/no-unused-vars
        const applyData = (_data: any) => {
          setLoading(false);
        };
        setLoading(true);
        sendRequest(
          {
            path: `/course/bonus-skills/${courseId}`,
            method: "put",
            body: courseSkills.map((item) => item.id),
          },
          applyData
        );
        setSubmit(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [courseSkills, courseId, submit, sendRequest]);

  /**
   * retourne la liste des compétences associées au cours et celle des compétences
   * attachées au module
   */
  useEffect(() => {
    const applyData = (data: any) => {
      dispatch(courseSkillsActions.initData(courseSkillsFromHttp(data)));
    };
    sendRequest(
      {
        path: `/course/bonus-skills/${courseId}`,
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
      <h2 className="text-3xl font-extrabold">Compétences</h2>
      <div className="w-full">
        {courseSkills && moduleSkills ? (
          <Wrapper>
            <SkillsWithDrawer
              loading={loading}
              initialList={moduleSkills}
              currentItems={courseSkills}
              property="description"
              onSubmit={handleUpdateSkills}
              isDisabled={false}
            />
          </Wrapper>
        ) : null}
      </div>
      <div className="w-full flex justify-start"></div>
    </div>
  );
};

export default CourseSkills;
