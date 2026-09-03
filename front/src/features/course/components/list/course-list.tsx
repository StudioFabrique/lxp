import { useMemo, useState } from "react";
import { BookOpen, Pencil, SquareArrowRightEnter, Trash2 } from "lucide-react";
import { Link } from "react-router";

import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../../components/UI/hierarchical-list-card";
import Modal from "../../../../components/UI/modal/modal";
import Pagination from "../../../../components/UI/pagination/pagination";
import SearchAndRefresh from "../../../../components/UI/search-and-refresh";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { courseSearchOptions } from "../../../../config/search-options";
import useEagerLoadingList from "../../../../hooks/useEagerLoadingList";
import useDeleteCourse from "../../hooks/useDeleteCourse";
import CourseHeader from "./course-header";
import type CustomCourse from "./interfaces/custom-course";

type CourseListProps = {
  coursesList: CustomCourse[];
  onRefreshCourses: () => void;
};

export default function CourseList({
  coursesList,
  onRefreshCourses,
}: CourseListProps) {
  const [filter, setFilter] = useState<{
    field: keyof Pick<CustomCourse, "title" | "module" | "parcours" | "author">;
    value: string;
  } | null>(null);
  const filteredCourses = useMemo(() => {
    if (!filter) return coursesList;

    return coursesList.filter((course) =>
      course[filter.field].toLocaleLowerCase("fr").includes(filter.value),
    );
  }, [coursesList, filter]);
  const { list, page, totalPages, setPage } = useEagerLoadingList(
    filteredCourses,
    "title",
    12,
  );
  const { showModal, handleShowModal, handleCloseModal, handleDeleteCourse } =
    useDeleteCourse<CustomCourse>(onRefreshCourses);
  const handleSearch = (field: string, value: string) => {
    if (!["title", "module", "parcours", "author"].includes(field)) return;
    setPage(1);
    setFilter({
      field: field as "title" | "module" | "parcours" | "author",
      value: value.toLocaleLowerCase("fr"),
    });
  };
  const resetSearch = () => {
    setPage(1);
    setFilter(null);
  };

  return (
    <main className="flex w-full flex-col gap-8">
      <CourseHeader />

      <SearchAndRefresh
        searchOptions={courseSearchOptions}
        onSearch={handleSearch}
        onResetInput={resetSearch}
      />

      {list && list.length > 0 ? (
        <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {(list as CustomCourse[]).map((course) => (
            <HierarchicalListCard
              key={course.id}
              label="Cours"
              title={course.title}
              description={
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <span>{course.module}</span>
                </div>
              }
              action={
                <div className="flex items-center gap-1">
                  <PermissionGuard action="read" object="course">
                    <Link
                      className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                      data-tip="Prévisualiser le cours"
                      to={`/admin/parcours/module/${course.moduleId}`}
                      state={{ lessonId: course.lessons[0]?.id }}
                      aria-label={`Prévisualiser le cours ${course.title}`}
                    >
                      <SquareArrowRightEnter className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="update" object="course">
                    <Link
                      className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                      data-tip="Modifier le cours"
                      to={`/admin/parcours/module/${course.moduleId}?editCourseId=${course.id}`}
                      aria-label={`Modifier le cours ${course.title}`}
                    >
                      <Pencil className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="delete" object="course">
                    <button
                      type="button"
                      className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
                      data-tip="Supprimer le cours"
                      aria-label={`Supprimer le cours ${course.title}`}
                      onClick={() => handleShowModal(course)}
                    >
                      <Trash2 className="size-[1.2em]" />
                    </button>
                  </PermissionGuard>
                </div>
              }
              items={course.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                description: `Leçon ${lesson.order + 1}`,
                icon: <BookOpen />,
                to: `/admin/parcours/module/${course.moduleId}`,
                state: { lessonId: lesson.id },
              }))}
              maxItemsShown={3}
              emptyMessage="Aucune leçon associée"
              moreItemsLabel={(count) => `Afficher plus de leçons (${count})`}
              overflowTitle={`Autres leçons de ${course.title}`}
            />
          ))}
        </section>
      ) : (
        <EmptyStatePlaceholder title="Aucun cours trouvé" />
      )}

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      ) : null}

      {showModal ? (
        <Modal
          title={`Supprimer le cours « ${showModal.title} »`}
          onLeftClick={handleCloseModal}
          onRightClick={handleDeleteCourse}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          <p className="py-4">
            Le cours et les ressources qui lui sont associées seront
            définitivement supprimés.
          </p>
        </Modal>
      ) : null}
    </main>
  );
}
