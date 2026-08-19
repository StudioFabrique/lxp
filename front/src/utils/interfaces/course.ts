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
  aiIndexed?: boolean;
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
  /**
   * Progression en pourcentage, calculée par l'API
   * (`api/src/helpers/calculate-module-progress.ts`). Ne jamais la recalculer
   * ici : c'est ce qui avait produit quatre formules divergentes.
   */
  stats?: { progress?: number };
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
