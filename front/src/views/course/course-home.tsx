/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import Loader from "../../components/UI/loader";
import CustomResponse from "../../utils/interfaces/custom-response";
import CourseList from "../../components/course-home/course-list";
import CustomCourse from "../../components/course-home/interfaces/custom-course";

const CourseHome = () => {
  const { sendRequest, isLoading } = useHttp();
  const [coursesList, setCoursesList] = useState<CustomCourse[] | null>(null);

  /**
   * récupère la liste des cours depuis la bdd
   */
  useEffect(() => {
    const applyData = (data: CustomResponse) => {
      if (data.success) {
        setCoursesList(data.response);
      }
    };
    sendRequest(
      {
        path: "/course",
      },
      applyData
    );
  }, [sendRequest]);

  return (
    <main className="w-full min-h-screen flex justify-center ">
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <>{coursesList ? <CourseList coursesList={coursesList} /> : null}</>
      )}
    </main>
  );
};

export default CourseHome;
