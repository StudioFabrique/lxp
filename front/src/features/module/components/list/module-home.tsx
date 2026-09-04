import { useContext } from "react";
import {
  BookMarked,
  Pencil,
  SquareArrowRightEnter,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import { HierarchicalListItemActions } from "../../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import InvisibleIndicator from "../../../../components/UI/invisible-indicator";
import Pagination from "../../../../components/UI/pagination/pagination";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import useEagerLoadingList from "../../../../hooks/useEagerLoadingList";
import { AuthContext } from "../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../utils/helpers/user-role";
import type { ModuleListItem } from "../../api/module.api";
import ModuleHeader from "./module-header";

type ModuleHomeListProps = {
  modulesList: ModuleListItem[];
  onDeleteModule: (module: ModuleListItem) => void;
};

const ModuleHomeList = ({
  modulesList,
  onDeleteModule,
}: ModuleHomeListProps) => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const { list, page, totalPages, setPage } = useEagerLoadingList(
    modulesList,
    "title",
    12,
  );

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
              description={
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <span>{module.parcours}</span>
                </div>
              }
              action={
                <div className="flex items-center gap-1">
                  <PermissionGuard action="read" object="module">
                    <Link
                      className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                      data-tip="Accéder au module"
                      to={`/admin/parcours/module/${module.id}`}
                      aria-label={`Accéder au module ${module.title}`}
                    >
                      <SquareArrowRightEnter className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="update" object="module">
                    <Link
                      className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
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
                      className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
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
                  <InvisibleIndicator label="Cours invisible" />
                ) : null,
                description: `Cours ${course.order + 1}`,
                subDescription: course.isPublished ? (
                  <span className="text-success">Publié</span>
                ) : (
                  <span className="text-warning">Non publié</span>
                ),
                icon: <BookMarked strokeWidth="1.5" />,
                to: `/admin/parcours/module/${module.id}`,
                state: course.firstLessonId
                  ? { lessonId: course.firstLessonId }
                  : undefined,
                action: (dismissOverflow) => (
                  <HierarchicalListItemActions
                    title={course.title}
                    to={`/admin/parcours/module/${module.id}`}
                    state={
                      course.firstLessonId
                        ? { lessonId: course.firstLessonId }
                        : undefined
                    }
                    navigationLabel="Accéder au cours"
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

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      ) : null}
    </main>
  );
};

export default ModuleHomeList;
