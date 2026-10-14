import type { AssignmentFormValue } from "../../interfaces/assignment";

export type CourseFormValues = {
  title: string;
  description: string;
  visibility: boolean;
  assignment: AssignmentFormValue;
};

export type CreateCourseFormValues = CourseFormValues & {
  tagIds: number[];
};

/** Contenus existants importés dans un cours déjà créé. */
export type CourseContentValues = {
  lessonIds: number[];
  resourceIds: number[];
};

export type UpdateCourseFormValues = CourseFormValues & {
  tagIds: number[];
};
