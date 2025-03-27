/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import useHttp from "../../../hooks/use-http";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import formatCourseFromHttp from "../../../helpers/course/course-infos-from-http";
import Loader from "../../../components/UI/loader";
import ImageHeader from "../../../components/image-header";
import Course from "../../../utils/interfaces/course";
import defaultImage from "../../../assets/images/module-default.jpg";
import CourseIcon from "../../../components/UI/svg/course-icon";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import Tag from "../../../utils/interfaces/tag";

const LayoutCourseEdit = () => {
  const { sendRequest, error } = useHttp();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector(
    (state: any) => state.courseInfos.course,
  ) as Course;

  /**
   * retourne les informations de base d'un parcours et les
   * stock dans un state global
   */
  useEffect(() => {
    const applyData = (data: any) => {
      setLoading(false);
      const loadedCourse = formatCourseFromHttp(data);
      dispatch(courseInfosAction.setCourse(loadedCourse));
      dispatch(
        tagsAction.setCurrentTags(
          data.tags.map((tag: { tag: Tag }) => tag.tag),
        ),
      );
    };
    setLoading(true);
    sendRequest(
      {
        path: `/course/infos/${courseId}`,
      },
      applyData,
    );
    return () => {
      dispatch(courseInfosAction.resetCourse());
    };
  }, [courseId, dispatch, sendRequest]);

  /**
   * gestion des erreurs HTTP
   */
  useEffect(() => {
    if (error.length > 0) {
      setLoading(false);
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-2 py-2">
      {loading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col gap-y-8">
            <div className="w-full flex flex-col items-center gap-y-8">
              {course && course.title && course.module.title ? (
                <ImageHeader
                  title={course.title}
                  subTitle={course.module.title}
                  imageUrl={course.module.image ?? defaultImage}
                >
                  <div className="w-12 h-12 text-white">
                    <CourseIcon />
                  </div>
                  <></>
                </ImageHeader>
              ) : null}
              {/* Etapes du parcours */}
            </div>
            {course ? <Outlet /> : <Loader />}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
};

export default LayoutCourseEdit;
