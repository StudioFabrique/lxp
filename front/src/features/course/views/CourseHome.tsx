/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CourseList from "../components/list/course-list";
import Loader from "../../../components/loaders/Loader";
import { courseApi } from "../api/course.api";

const CourseHome = () => {
  const queryClient = useQueryClient();
  const { data: coursesList, isLoading } = useQuery(courseApi.queries.list());

  const handleRefreshCourses = () => {
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

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
              onRefreshCourses={handleRefreshCourses}
            />
          ) : null}
        </div>
      )}
    </main>
  );
};

export default CourseHome;
