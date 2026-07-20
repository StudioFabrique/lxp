/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import CoursePreviewInfos from "./course-preview-infos";
import Lesson from "../../../../../../src/utils/interfaces/lesson";
import PreviewLessons from "../../../../../../src/components/preview/preview-lessons";
import CourseDates from "../../../interfaces/course-dates";
import PreviewCalendar from "../../../../../../src/components/preview/preview-calendar";
import { Link, useNavigate, useParams } from "react-router";
import useValidateCourse from "./hook/use-validate-course";
import { courseApi } from "../../../api/course.api";

interface CoursePreviewProps {
  onEdit: (id: number) => void;
}

const CoursePreview = (props: CoursePreviewProps) => {
  const { courseId } = useParams();
  const moduleId = useCourseSelector((state) => state.course?.module?.id);

  const lessons = useCourseSelector(
    (state) => state.courseLessons
  ) as Lesson[];
  const dates = useCourseSelector(
    (state) => state.courseDates
  ) as CourseDates[];
  const nav = useNavigate();
  const { validateCourse } = useValidateCourse();

  const handlePublishCourse = async () => {
    const validationsErrors = validateCourse();
    if (validationsErrors && validationsErrors.length !== 0) {
      toast.error(Object.values(validationsErrors![0]).toString());
    } else {
      try {
        const data = await courseApi.mutations.publish(courseId!);
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            nav(`/admin/parcours/module/${moduleId}`, {
              state: { lessonId: lessons[0].id },
            });
          }, 500);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Erreur inconnue");
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Aperçu général</h1>
      </section>
      <section>
        <CoursePreviewInfos onEdit={props.onEdit} />
      </section>
      <section>
        <PreviewLessons lessons={lessons} onEdit={props.onEdit} />
      </section>
      <section>
        <PreviewCalendar dates={dates} onEdit={props.onEdit} />
      </section>
      <section className="w-full flex justify-between">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => props.onEdit(5)}
        >
          Retour
        </button>
        <div className="flex gap-x-4 items-center">
          <Link className="btn btn-secondary" to="..">
            Sauvegarder le brouillon
          </Link>
          <button className="btn btn-primary" onClick={handlePublishCourse}>
            Publier
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoursePreview;
