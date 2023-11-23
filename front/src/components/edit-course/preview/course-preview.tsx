/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import CoursePreviewInfos from "./course-preview-infos";
import Objective from "../../../utils/interfaces/objective";
import PreviewObjectives from "../../preview/preview-objectives";
import Skill from "../../../utils/interfaces/skill";
import PreviewSkills from "../../preview/preview-skills";
import Lesson from "../../../utils/interfaces/lesson";
import PreviewLessons from "../../preview/preview-lessons";
import CourseDates from "../../../utils/interfaces/course-dates";
import PreviewCalendar from "../../preview/preview-calendar";
import { Link, useNavigate, useParams } from "react-router-dom";
import useValidateCourse from "./hook/use-validate-course";
import useHttp from "../../../hooks/use-http";
import { useEffect } from "react";

interface CoursePreviewProps {
  onEdit: (id: number) => void;
}

const CoursePreview = (props: CoursePreviewProps) => {
  const { courseId } = useParams();
  const objectives = useSelector(
    (state: any) => state.courseObjectives.courseObjectives
  ) as Objective[];
  const skills = useSelector(
    (state: any) => state.courseSkills.courseSkills
  ) as Skill[];
  const lessons = useSelector(
    (state: any) => state.courseScenario.courseLessons
  ) as Lesson[];
  const dates = useSelector(
    (state: any) => state.courseDates.courseDates
  ) as CourseDates[];
  const { sendRequest, error } = useHttp();
  const nav = useNavigate();
  const { validateCourse } = useValidateCourse();

  /**
   * vérifie que toutes les sections du cours sont correctement remplies
   * avant de mettre à jour le cours avec le statut publié dans la bdd
   * @returns unknown[]
   */
  const handlePublishCourse = () => {
    const validationsErrors = validateCourse();
    if (validationsErrors && validationsErrors.length !== 0) {
      toast.error(Object.values(validationsErrors![0]).toString());
    } else {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            nav("/admin/course");
          }, 500);
        }
      };
      sendRequest(
        {
          path: `/course/publish/${courseId}`,
          method: "put",
        },
        applyData
      );
    }
  };

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Aperçu général</h1>
      </section>
      <section>
        <CoursePreviewInfos onEdit={props.onEdit} />
      </section>

      <section>
        <PreviewObjectives objectives={objectives} onEdit={props.onEdit} />
      </section>
      <section>
        <PreviewSkills skills={skills} onEdit={props.onEdit} />
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
