import { Accomplishment } from "../../features/dashboard-student/interfaces/accomplishment";
import Contact from "./contact";
import CourseDates from "../../features/course/interfaces/course-dates";
import Lesson from "./lesson";
import Module from "./module";
import Objective from "./objective";
import Skill from "./skill";
import Tag from "./tag";

export default interface Course {
  id: number;
  title: string;
  description?: string;
  courseSlug?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  module: Module;
  tags: Tag[];
  virtualClass?: string;
  visibility?: boolean;
  image?: string;
  contacts: Contact[];
  scenario?: boolean;
  lessons: Lesson[];
  dates: CourseDates[];
  isPublished: boolean;
  objectives?: Objective[];
  bonusSkills: Skill[];
  accomplishments?: Accomplishment[];
  order?: number;
}

export interface CourseTimeline {
  id: number;
  moduleId: number;
  firstLessonId: number;
  title: string;
  moduleTitle: string;
  minDate: string;
  maxDate: string;
  parcoursTitle?: string;
  formationTitle?: string;
}
