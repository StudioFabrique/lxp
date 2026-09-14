import apiClient from "../../../lib/axios";

export type TeacherAssignmentSubmission = {
  id: number;
  submittedAt?: string | null;
  grade?: number | null;
  gradedAt?: string | null;
};

export type TeacherAssignmentStudent = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string | null;
  submission: TeacherAssignmentSubmission | null;
};

export type TeacherAssignmentListItem = {
  id: number;
  dueAt: string;
  maxScore: number;
  course: {
    id: number;
    title: string;
    module: {
      id: number;
      title: string;
      parcours: { id: number; title: string };
    };
  };
  students: TeacherAssignmentStudent[];
};

export async function getTeacherUpcomingAssignments() {
  const response = await apiClient.get<{
    assignments: TeacherAssignmentListItem[];
  }>("/assignment/teacher/upcoming");
  return response.data.assignments;
}
