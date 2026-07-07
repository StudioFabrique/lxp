/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../src.legacy/hooks/use-http";

import Loader from "../../../../src.legacy/components/UI/loader";
import CustomResponse from "../../../../src.legacy/utils/interfaces/custom-response";
import CourseList from "../components/list/course-list";
import CustomCourse from "../components/list/interfaces/custom-course";

const CourseHome = () => {
  const { sendRequest, isLoading } = useHttp();
  const [coursesList, setCoursesList] = useState<CustomCourse[] | null>(null);

  const getCourses = useCallback(async () => {
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

  /**
   * récupère la liste des cours depuis la bdd
   */
  useEffect(() => {
    getCourses();
  }, [getCourses]);

  return (
    <main className="w-full min-h-screen flex justify-center">
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          {coursesList ? (
            <CourseList
              coursesList={coursesList}
              onRefreshCourses={getCourses}
            />
          ) : null}
        </div>
      )}
    </main>
  );
};

export default CourseHome;
