export type AssignmentFile = {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
};

export type AssignmentCriterion = {
  id: number;
  label: string;
  weight: number;
  order: number;
};

export type AssignmentCriterionScore = {
  criterionId: number;
  score: number;
};

export type AssignmentSubmission = {
  id: number;
  text?: string | null;
  submittedAt?: string | null;
  grade?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
  student?: {
    id: number;
    idMdb: string;
    firstname?: string;
    lastname?: string;
  };
  files: AssignmentFile[];
  criterionScores: AssignmentCriterionScore[];
};

export type CourseAssignment = {
  id: number;
  courseId: number;
  dueAt: string;
  maxScore: number;
  rubricVisible: boolean;
  instructions: string;
  criteria: AssignmentCriterion[];
  files: AssignmentFile[];
  submissions: AssignmentSubmission[];
};

export type AssignmentCriterionFormValue = {
  key: string;
  label: string;
  weight: number;
};

export type AssignmentFormValue = {
  required: boolean;
  dueAt: string;
  maxScore: number;
  rubricVisible: boolean;
  instructions: string;
  criteria: AssignmentCriterionFormValue[];
  files: File[];
  removeFileIds: number[];
};
