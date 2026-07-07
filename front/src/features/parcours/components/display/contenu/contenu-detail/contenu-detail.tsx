/* eslint-disable @typescript-eslint/no-explicit-any */
import BookIcon from "../../../../../../../src.legacy/components/UI/svg/book-icon";
import useHttp from "../../../../../../../src.legacy/hooks/use-http";
import { FC, useEffect, useState } from "react";
import Course from "../../../../../../../src.legacy/utils/interfaces/course";
import EditIcon from "../../../../../../../src.legacy/components/UI/svg/edit-icon";
import { Link, useLocation, useNavigate } from "react-router";
import { EyeOff, Import, Plus, UploadCloud } from "lucide-react";
import { cn } from "../../../../../../../src.legacy/utils";
import toast from "react-hot-toast";
import PermissionGuard from "../../../../../../components/guards/PermissionGuard";

const ContenuDetail: FC<{
  canEdit?: boolean;
  parcoursId: number;
  moduleId: number;
}> = ({ canEdit, parcoursId, moduleId }) => {
  const { sendRequest, isLoading } = useHttp(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [courses, setCourses] = useState<Course[]>([]);

  const handlePublish = (
    e: React.MouseEvent<HTMLButtonElement>,
    course: Course,
  ) => {
    e.stopPropagation();

    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        setCourses(
          courses.map((c) =>
            c.id === course.id
              ? { ...c, isPublished: true, visibility: true }
              : c,
          ),
        );
      }
    };

    sendRequest(
      { path: `/course/publish/${course.id}`, method: "put" },
      applyData,
    );
  };

  useEffect(() => {
    const applyData = (data: any) => {
      const courses = data.response;
      setCourses(courses);
    };
    sendRequest(
      {
        path: `/course/${moduleId}`,
      },
      applyData,
    );
  }, [sendRequest, moduleId]);

  const contentsList =
    !isLoading && courses.length > 0 ? (
      courses.map((course, i) => (
        <div
          onClick={() =>
            navigate(`/${currentRoute[0]}/parcours/module/${moduleId}`, {
              state: {
                lessonId:
                  course.lessons.length > 0 ? course.lessons[0].id : null,
              },
            })
          }
          key={course?.id}
          className="relative flex justify-between items-center bg-base-200 hover:bg-base-300 text-base-content p-4 rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          <span className="w-12 h-12 shrink-0 text-primary">
            <BookIcon />
          </span>
          <div className="flex flex-col truncate w-full px-4">
            <span className="truncate text-sm opacity-70">{`Cours ${i + 1}`}</span>
            <span className="text-base font-bold truncate">{course.title}</span>
          </div>

          <PermissionGuard action="update" object="course">
            <div className="flex gap-2">
              {!course.isPublished && (
                <button
                  onClick={(e) => handlePublish(e, course)}
                  className={cn("btn btn-ghost btn-sm tooltip ")}
                  data-tip={"Publier le cours"}
                >
                  <UploadCloud className="w-6 h-6" />
                </button>
              )}
              <Link
                className="btn btn-ghost btn-sm text-base-content/70 hover:text-primary"
                type="button"
                to={`/${currentRoute[0]}/course/edit/${course.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-6 h-6">
                  <EditIcon />
                </div>
              </Link>
            </div>
          </PermissionGuard>

          {!course.isPublished || !course.visibility ? (
            <div
              className={cn(
                "badge absolute -top-3 -left-2 tooltip tooltip-right z-11",
                { "badge-error": !course.isPublished || !course.visibility },
                { "badge-warning": !course.visibility && course.isPublished },
              )}
              data-tip={`Le cours est ${
                !course.isPublished
                  ? "non publié"
                  : course.visibility
                    ? "visible"
                    : "invisible"
              }`}
            >
              <EyeOff className="w-4 h-4" />
            </div>
          ) : null}
        </div>
      ))
    ) : (
      <p className="ml-4 opacity-70">Aucun cours publié</p>
    );

  return (
    <div className="flex flex-col gap-y-4 mt-5">
      <span className="flex justify-between gap-4">
        <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
        {canEdit && (
          <PermissionGuard action="write" object="course">
            <div className="flex flex-wrap justify-end gap-2">
              <Link
                to="/admin/course/add"
                state={{ parcoursId, moduleId }}
                className="btn btn-primary btn-sm text-base-100"
              >
                <Plus size={20} />
                Ajouter un cours
              </Link>
              <Link
                to="/admin/course/import"
                state={{ parcoursId, moduleId }}
                className="btn btn-primary btn-sm text-base-100"
              >
                <Import size={20} />
                Importer
              </Link>
            </div>
          </PermissionGuard>
        )}
      </span>
      <div className="flex flex-col gap-y-4">{contentsList}</div>
    </div>
  );
};

export default ContenuDetail;
