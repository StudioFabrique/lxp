import { useContext } from "react";
import { ChevronRight, MoveUpRight, Pencil } from "lucide-react";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { cn } from "../../../utils/cn";

import type { ModuleSummary } from "../api/dashboard-admin.api";
import { localeDate } from "../../../utils/helpers/locale-date";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultModuleImage from "../../../assets/images/module-default-thumb.png";
import { AuthContext } from "../../../store/AuthProvider";
import {
  getModulesLabel,
  isTeacherUser,
} from "../../../utils/helpers/user-role";
import { formatTitle } from "../../../utils/helpers/text-helpers";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";

type Props = {
  modules: ModuleSummary[];
  isLoading?: boolean;
};

export default function LastModules({ modules, isLoading }: Props) {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);

  return isLoading ? (
    <LoadingSkeleton variant="rows" label="Chargement des modules" />
  ) : modules?.length ? (
    <div className="p-2">
      <h3 className="text-xl font-bold text-primary select-none">
        {getModulesLabel(user, "Derniers modules créés")}
      </h3>
      <ul className="list border border-base-300 rounded-box overflow-hidden bg-base-200 mt-4">
        {modules.map((module) => {
          const title = <div className="font-semibold truncate">{formatTitle(module.title)}</div>;
          const previewPath = `/admin/parcours/module/${module.id}`;

          return (
          <li
            // Toute la ligne mène à l'aperçu du module (lien étiré sur le titre) ; les actions restent au-dessus.
            className={cn(
              "list-row group relative transition-colors",
              module.parcoursId && "hover:bg-base-300/40 focus-within:bg-base-300/40",
            )}
            key={module.id}
          >
            <div className="self-center">
              <img
                src={normalizeImageSource(module.thumb) ?? defaultModuleImage}
                alt={`Illustration du module ${module.title}`}
                className="size-10 rounded-lg object-cover"
              />
            </div>

            <div className="list-col-grow min-w-0 self-center">
              {module.parcoursId ? (
                <PermissionGuard action="read" object="module" fallback={title}>
                  <Link
                    to={previewPath}
                    aria-label={`Prévisualiser ${module.title}`}
                    className="block rounded after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                  >
                    {title}
                  </Link>
                </PermissionGuard>
              ) : (
                title
              )}
              <div className="truncate text-xs text-base-content/80">
                {module.parcours ?? "Non rattaché"}
              </div>
              <div className="text-xs text-base-content/80">
                {module.coursesCount} cours, créé le{" "}
                {localeDate(module.createdAt)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 self-center">
              {module.parcoursId ? (
                <>
                  <PermissionGuard action="update" object="module">
                    <Link
                      className="btn btn-ghost btn-sm btn-square tooltip tooltip-left relative z-10"
                      data-tip="Modifier dans le parcours"
                      to={`/admin/parcours/edit/${module.parcoursId}?step=4&moduleId=${module.id}`}
                      aria-label={`Modifier ${module.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="read" object="module">
                    <ChevronRight
                      className="size-5 -translate-x-2 text-primary opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </PermissionGuard>
                </>
              ) : (
                <span className="text-xs text-base-content/80">
                  Non rattaché
                </span>
              )}
            </div>
          </li>
          );
        })}
      </ul>
      <div className="flex justify-end mt-2">
        <Link
          className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline select-none"
          to="/admin/module"
        >
          {isTeacher ? "Voir mes modules" : "Voir tous les modules"}{" "}
          <MoveUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  ) : null;
}
