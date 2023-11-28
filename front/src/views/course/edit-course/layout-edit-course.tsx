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
import BookIcon from "../../../components/UI/svg/book-icon";
import Course from "../../../utils/interfaces/course";

const LayoutCourseEdit = () => {
  const { sendRequest, error } = useHttp();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector(
    (state: any) => state.courseInfos.course
  ) as Course;

  /**
   * retourne les informations de base d'un parcours et les
   * stock dans un state global
   */
  useEffect(() => {
    const applyData = (data: Course) => {
      setLoading(false);
      console.log({ data });

      const loadedCourse = formatCourseFromHttp(data);
      dispatch(courseInfosAction.setCourse(loadedCourse));
    };
    setLoading(true);
    sendRequest(
      {
        path: `/course/infos/${courseId}`,
      },
      applyData
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

  console.log({ course });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {loading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col gap-y-8">
            <div className="w-full flex flex-col items-center gap-y-8">
              {course && course.title && course.module.title ? (
                <ImageHeader
                  title={course.module.title}
                  subTitle={course.title}
                  imageUrl={course.module.image!}
                >
                  <BookIcon />
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
