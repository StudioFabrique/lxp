import type { AssignmentFormValue } from "../../interfaces/assignment";

export type CourseFormValues = {
  title: string;
  description: string;
  visibility: boolean;
  assignment: AssignmentFormValue;
};

export type CreateCourseFormValues = CourseFormValues & {
  tagIds: number[];
  lessonTitles: string[];
  lessonIds: number[];
  resourceIds: number[];
};

export type UpdateCourseFormValues = CourseFormValues & {
  tagIds: number[];
};
