import apiClient from "../../../lib/axios";

export type StudentAssignmentListItem = {
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
  submissions: Array<{
    id: number;
    submittedAt?: string | null;
    grade?: number | null;
    gradedAt?: string | null;
  }>;
};

export async function getStudentAssignments() {
  const response = await apiClient.get<{
    assignments: StudentAssignmentListItem[];
  }>("/assignment/student");
  return response.data.assignments;
}
