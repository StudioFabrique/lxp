/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import formatCourseFromHttp from "../helpers/course-infos-from-http";
import Loader from "../../../../src/components/loaders/Loader";
import ImageHeader from "../../../../src/components/image-header/image-header";
import Course from "../../../../src/utils/interfaces/course";
import defaultImage from "../../../../src/assets/images/module-default.jpg";
import { BookMarked } from "lucide-react";
import { useCourseSelector, useCourseDispatch } from "../store/CourseContext";
import { courseApi } from "../api/course.api";

const LayoutCourseEdit = () => {
  const { courseId } = useParams();
  const dispatch = useCourseDispatch();
  const course = useCourseSelector(
    (state) => state.course
  ) as Course;

  const { data, isLoading, isError, error } = useQuery({
    ...courseApi.queries.infos(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (data) {
      const loadedCourse = formatCourseFromHttp(data);
      dispatch({ type: "SET_COURSE", payload: loadedCourse });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError && error) {
      toast.error((error as any)?.response?.data?.message ?? "Erreur inconnue");
    }
  }, [isError, error]);

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_COURSE" });
    };
  }, [dispatch]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      {isLoading ? (
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
