/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import toast from "react-hot-toast";

import useHttp from "../../../../src.legacy/hooks/use-http";
import FadeWrapper from "../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import formatCourseFromHttp from "../../../../src.legacy/helpers/course/course-infos-from-http";
import Loader from "../../../../src.legacy/components/UI/loader";
import ImageHeader from "../../../../src.legacy/components/image-header";
import Course from "../../../../src.legacy/utils/interfaces/course";
import defaultImage from "../../../../src.legacy/assets/images/module-default.jpg";
import { BookMarked } from "lucide-react";
import { useCourseSelector, useCourseDispatch } from "../store/CourseContext";

const LayoutCourseEdit = () => {
  const { sendRequest, error } = useHttp();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useCourseDispatch();
  const course = useCourseSelector(
    (state) => state.course
  ) as Course;

  /**
   * retourne les informations de base d'un parcours et les
   * stock dans un state global
   */
  useEffect(() => {
    const applyData = (data: any) => {
      setLoading(false);
      const loadedCourse = formatCourseFromHttp(data);
      dispatch({ type: "SET_COURSE", payload: loadedCourse });
    };
    setLoading(true);
    sendRequest(
      {
        path: `/course/infos/${courseId}`,
      },
      applyData
    );
    return () => {
      dispatch({ type: "RESET_COURSE" });
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
    <div className="w-full h-full flex flex-col justify-start items-center">
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
                  <BookMarked className="text-white" />
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
