import type Course from "../../../../utils/interfaces/course";

export type Props = {
  course: Course;
  staff: boolean;
  initialSubmissionId?: number;
  onChanged: () => void | Promise<void>;
};
