/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector } from "../../../../store/CourseContext";
import type { CourseState } from "../../../../store/CourseContext";
import Course from "../../../../../../../src.legacy/utils/interfaces/course";
import Lesson from "../../../../../../../src.legacy/utils/interfaces/lesson";
import CourseDates from "../../../../../../../src.legacy/utils/interfaces/course-dates";
import { testStep } from "../../../../../../../src.legacy/helpers/course-steps-validation";
import { useCallback } from "react";

const useValidateCourse = () => {
  const course = useCourseSelector(
    (state: CourseState) => state.course
  ) as Course;
  const lessons = useCourseSelector(
    (state: CourseState) => state.courseLessons
  ) as Lesson[];
  const dates = useCourseSelector(
    (state: CourseState) => state.currentDates
  ) as CourseDates;

  const validateCourse = useCallback(() => {
    return testStep({
      title: course?.title,
      description: course?.description,
      tags: course?.tags,
      contacts: course?.contacts,
      lessons: lessons,
      dates: dates,
    });
  }, [course, lessons, dates]);

  return { validateCourse };
};

export default useValidateCourse;
