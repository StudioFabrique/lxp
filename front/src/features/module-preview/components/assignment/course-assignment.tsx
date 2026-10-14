import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSkeleton from "../../../../components/loaders/LoadingSkeleton";
import { modulePreviewApi } from "../../api/module-preview.api";
import { type Props } from "./course-assignment.types";
import { AssignmentHeader } from "./assignment-header";
import { StaffAssignment } from "./staff-assignment";
import { StudentAssignment } from "./student-assignment";

export default function CourseAssignmentView({
  course,
  staff,
  initialSubmissionId,
  onChanged,
}: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["course-assignment", course.id],
    queryFn: () => modulePreviewApi.queries.getCourseAssignment(course.id),
    initialData: course.assignment ?? undefined,
  });

  if (isLoading || !data) {
    return <LoadingSkeleton variant="panel" label="Chargement du devoir" />;
  }
  const hydratedCourse = { ...course, assignment: data };
  const handleChanged = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["course-assignment", course.id],
      }),
      onChanged(),
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <AssignmentHeader course={hydratedCourse} />
      {staff ? (
        <StaffAssignment
          course={hydratedCourse}
          initialSubmissionId={initialSubmissionId}
          onChanged={handleChanged}
        />
      ) : (
        <StudentAssignment course={hydratedCourse} onChanged={handleChanged} />
      )}
    </div>
  );
}
