import { useContext } from "react";
import {
  BookMarked,
  Eye,
  EyeOff,
  Pencil,
  SquareArrowRightEnter,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router";

import defaultModuleImage from "../../../../assets/images/module-default-thumb.png";
import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import { HierarchicalListItemActions } from "../../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import InvisibleIndicator from "../../../../components/UI/invisible-indicator";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import TablePagination from "../../../../components/table/TablePagination";
import useEagerLoadingList from "../../../../hooks/useEagerLoadingList";
import { AuthContext } from "../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../utils/helpers/user-role";
import { normalizeImageSource } from "../../../../utils/images/image-source";
import type { ModuleListItem } from "../../api/module.api";
import ModuleHeader from "./module-header";

type ModuleHomeListProps = {
  modulesList: ModuleListItem[];
  onDeleteModule: (module: ModuleListItem) => void;
  onDeleteCourse: (
    course: ModuleListItem["courses"][number] & { moduleTitle: string },
  ) => void;
  onPublishCourse: (courseId: number) => void;
  onToggleCourseVisibility: (courseId: number, visibility: boolean) => void;
};

const ModuleHomeList = ({
  modulesList,
  onDeleteModule,
  onDeleteCourse,
  onPublishCourse,
  onToggleCourseVisibility,
}: ModuleHomeListProps) => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const { list, limit, page, totalPages, setLimit, setPage } =
    useEagerLoadingList(modulesList, "title", 15, "id", "sidebar-modules");

  return (
    <main className="flex w-full flex-col gap-8">
      <ModuleHeader />

      {list && list.length > 0 ? (
        <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {(list as ModuleListItem[]).map((module) => (
            <HierarchicalListCard
              key={module.id}
              label="Module"
              title={module.title}
              truncateTitle
              headerBackgroundImage={
                normalizeImageSource(module.thumb) ?? defaultModuleImage
              }
              headerClassName="min-h-24"
              description={
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <span>{module.parcours}</span>
                </div>
              }
              action={
                <div className="flex items-center gap-1">
                  <PermissionGuard action="read" object="module">
                    <Link
                      className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-base-content shadow-sm tooltip tooltip-left hover:bg-base-100"
                      data-tip="Accéder au module"
                      to={`/admin/parcours/module/${module.id}`}
                      aria-label={`Accéder au module ${module.title}`}
                    >
                      <SquareArrowRightEnter className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="update" object="module">
                    <Link
                      className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-base-content shadow-sm tooltip tooltip-left hover:bg-base-100"
                      data-tip="Modifier le module"
                      to={`/admin/parcours/edit/${module.parcoursId}?step=4&moduleId=${module.id}`}
                      aria-label={`Modifier le module ${module.title}`}
                    >
                      <Pencil className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="delete" object="module">
                    <button
                      type="button"
                      className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-error shadow-sm tooltip tooltip-left hover:bg-base-100"
                      data-tip="Supprimer le module"
                      aria-label={`Supprimer le module ${module.title}`}
                      onClick={() => onDeleteModule(module)}
                    >
                      <Trash2 className="size-[1.2em]" />
                    </button>
                  </PermissionGuard>
                </div>
              }
              items={module.courses.map((course) => ({
                id: course.id,
                title: course.title,
                titleAccessory: !course.visibility ? (
                  <InvisibleIndicator />
                ) : null,
                description: `Cours ${course.order + 1}`,
                subDescription: course.isPublished ? (
                  <span className="text-success">Publié</span>
                ) : (
                  <span className="text-info">Non publié</span>
                ),
                icon: <BookMarked strokeWidth="1.5" />,
                to: `/admin/parcours/module/${module.id}`,
                state: course.firstLessonId
                  ? { lessonId: course.firstLessonId }
                  : undefined,
                action: (dismissOverflow, menuControl) => (
                  <HierarchicalListItemActions
                    title={course.title}
                    menuControl={menuControl}
                    actions={[
                      ...(!course.isPublished
                        ? [
                            {
                              label: "Publier le cours",
                              icon: <UploadCloud />,
                              onSelect: () => onPublishCourse(course.id),
                              permission: {
                                action: "update",
                                object: "course",
                              },
                            },
                          ]
                        : []),
                      {
                        label: course.visibility
                          ? "Rendre le cours invisible"
                          : "Rendre le cours visible",
                        icon: course.visibility ? <EyeOff /> : <Eye />,
                        onSelect: () =>
                          onToggleCourseVisibility(
                            course.id,
                            !course.visibility,
                          ),
                        permission: { action: "update", object: "course" },
                      },
                      {
                        label: "Accéder au cours",
                        icon: <SquareArrowRightEnter />,
                        to: `/admin/parcours/module/${module.id}`,
                        state: course.firstLessonId
                          ? { lessonId: course.firstLessonId }
                          : undefined,
                      },
                      {
                        label: "Modifier le cours",
                        icon: <Pencil />,
                        to: `/admin/parcours/module/${module.id}?editCourseId=${course.id}`,
                        permission: { action: "update", object: "course" },
                      },
                      {
                        label: "Supprimer le cours",
                        icon: <Trash2 />,
                        onSelect: () =>
                          onDeleteCourse({
                            ...course,
                            moduleTitle: module.title,
                          }),
                        destructive: true,
                        permission: { action: "delete", object: "course" },
                      },
                    ]}
                    dismissOverflow={dismissOverflow}
                  />
                ),
              }))}
              maxItemsShown={3}
              emptyMessage="Aucun cours associé"
              moreItemsLabel={(count) => `Afficher plus de cours (${count})`}
              overflowTitle={`Autres cours de ${module.title}`}
            />
          ))}
        </section>
      ) : (
        <EmptyStatePlaceholder
          title={isTeacher ? "Aucun module affecté" : "Aucun module trouvé"}
        />
      )}

      {list && list.length > 0 ? (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={limit}
          leftText={`Modules : ${modulesList.length}`}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(itemsPerPage) => {
            setLimit(itemsPerPage);
            setPage(1);
          }}
          onSetPreviousPage={() =>
            setPage((current) => Math.max(current - 1, 1))
          }
          onSetNextPage={() =>
            setPage((current) => Math.min(current + 1, totalPages))
          }
        />
      ) : null}
    </main>
  );
};

export default ModuleHomeList;
