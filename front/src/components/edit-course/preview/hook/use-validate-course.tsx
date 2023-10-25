import { useSelector } from "react-redux";
import Course from "../../../../utils/interfaces/course";
import Objective from "../../../../utils/interfaces/objective";
import Skill from "../../../../utils/interfaces/skill";
import Lesson from "../../../../utils/interfaces/lesson";
import CourseDates from "../../../../utils/interfaces/course-dates";
import { testStep } from "../../../../helpers/course-steps-validation";
import { useCallback } from "react";

const useValidateCourse = () => {
  const course = useSelector(
    (state: any) => state.courseInfos.course
  ) as Course;
  const objectives = useSelector(
    (state: any) => state.courseObjectives.courseObjectives
  ) as Objective[];
  const skills = useSelector(
    (state: any) => state.courseSkills.courseSkills
  ) as Skill[];
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
      objectives: objectives,
      skills: skills,
      lessons: lessons,
      dates: dates,
    });
  }, [course, objectives, lessons, dates, skills]);

  return { validateCourse };
};

export default useValidateCourse;
