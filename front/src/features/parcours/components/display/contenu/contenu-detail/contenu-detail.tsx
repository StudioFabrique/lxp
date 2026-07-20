import BookIcon from "../../../../../../../src/components/UI/svg/book-icon";
import { FC, useEffect, useState } from "react";
import Course from "../../../../../../../src/utils/interfaces/course";
import EditIcon from "../../../../../../../src/components/UI/svg/edit-icon";
import { Link, useLocation, useNavigate } from "react-router";
import { EyeOff, Import, Plus, UploadCloud } from "lucide-react";
import { cn } from "../../../../../../utils/cn";
import toast from "react-hot-toast";
import PermissionGuard from "../../../../../../components/guards/PermissionGuard";
import { parcoursApi } from "../../../../api/parcours.api";

const ContenuDetail: FC<{
  canEdit?: boolean;
  parcoursId: number;
  moduleId: number;
}> = ({ canEdit, parcoursId, moduleId }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async (
    e: React.MouseEvent<HTMLButtonElement>,
    course: Course,
  ) => {
    e.stopPropagation();

    try {
      const data = await parcoursApi.mutations.publishCourse(course.id);
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
    } catch {
      toast.error("Erreur lors de la publication");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    parcoursApi.queries
      .getCoursesByModule(moduleId)
      .then((data) => {
        setCourses(data.response);
      })
      .catch(() => toast.error("Erreur lors du chargement des cours"))
      .finally(() => setIsLoading(false));
  }, [moduleId]);

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
