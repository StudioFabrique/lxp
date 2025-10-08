/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Course from "../../../../utils/interfaces/course";
import Lesson from "../../../../utils/interfaces/lesson";
import CourseDates from "../../../../utils/interfaces/course-dates";
import { testStep } from "../../../../helpers/course-steps-validation";
import { useCallback } from "react";

const useValidateCourse = () => {
  const course = useSelector(
    (state: any) => state.courseInfos.course
  ) as Course;
  const lessons = useSelector(
    (state: any) => state.courseScenario.courseLessons
  ) as Lesson[];
  const dates = useSelector(
    (state: any) => state.courseDates.courseDates
  ) as CourseDates;

  const validateCourse = useCallback(() => {
    return testStep({
      title: course.title,
      description: course.description,
      tags: course.tags,
      contacts: course.contacts,
      lessons: lessons,
      dates: dates,
    });
  }, [course, lessons, dates]);

  return { validateCourse };
};

export default useValidateCourse;
