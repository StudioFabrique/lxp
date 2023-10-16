import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import courseSkillsFromHttp from "../../../helpers/course/course-skills-from-http";
import { useSelector } from "react-redux";
import Skill from "../../../utils/interfaces/skill";
import { courseSkillsActiions } from "../../../store/redux-toolkit/course/course-skills";
import toast from "react-hot-toast";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SkillsWithDrawer from "./skills-with-drawer";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

const CourseSkills = () => {
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const isInitialRender = useRef(true);
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
    isInitialRender.current = false;
    dispatch(courseSkillsActiions.setCourseSkills(data));
  };

  /**
   * détecte les changements dans la liste des compétences associées
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
            path: `/course/bonus-skills/${courseId}`,
            method: "put",
            body: courseSkills.map((item) => item.id),
          },
          applyData
        );
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [courseSkills, courseId, sendRequest]);

  /**
   * retourne la liste des compétences associées au cours et celle des compétences
   * attachées au module
   */
  useEffect(() => {
    const applyData = (data: any) => {
      dispatch(courseSkillsActiions.initData(courseSkillsFromHttp(data)));
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

  console.log({ courseSkills, moduleSkills });

  return (
    <div className="w-full flex flex-col gap-y-8">
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
