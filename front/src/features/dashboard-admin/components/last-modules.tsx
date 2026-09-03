import { useContext } from "react";
import { ExternalLink, MoveUpRight, Pencil } from "lucide-react";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";

import type { ModuleSummary } from "../api/dashboard-admin.api";
import { localeDate } from "../../../utils/helpers/locale-date";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultModuleImage from "../../../assets/images/module-default-thumb.png";
import { AuthContext } from "../../../store/AuthProvider";
import {
  getModulesLabel,
  isTeacherUser,
} from "../../../utils/helpers/user-role";

type Props = {
  modules: ModuleSummary[];
  isLoading?: boolean;
};

export default function LastModules({ modules, isLoading }: Props) {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);

  return isLoading ? (
    <span className="loading loading-spinner loading-sm my-5" />
  ) : modules?.length ? (
    <div className="p-2">
      <h3 className="text-xl font-bold text-primary select-none">
        {getModulesLabel(user, "Derniers modules créés")}
      </h3>
      <ul className="list border border-base-300 rounded-box overflow-hidden bg-base-200 mt-4">
        {modules.map((module) => (
          <li className="list-row" key={module.id}>
            <div className="self-center">
              <img
                src={normalizeImageSource(module.thumb) ?? defaultModuleImage}
                alt={`Illustration du module ${module.title}`}
                className="size-10 rounded-lg object-cover"
              />
            </div>

            <div className="list-col-grow min-w-0 self-center">
              <div className="font-semibold truncate">{module.title}</div>
              <div className="text-xs font-light opacity-50 truncate">
                {module.parcours ?? "Non rattaché"}
              </div>
              <div className="text-xs font-light opacity-50">
                {module.coursesCount} cours · Créé le{" "}
                {localeDate(module.createdAt)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 self-center">
              {module.parcoursId ? (
                <>
                  <PermissionGuard action="update" object="module">
                    <Link
                      className="btn btn-ghost btn-sm btn-square tooltip tooltip-left"
                      data-tip="Modifier dans le parcours"
                      to={`/admin/parcours/edit/${module.parcoursId}?step=4&moduleId=${module.id}`}
                      aria-label={`Modifier ${module.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard action="read" object="module">
                    <Link
                      className="btn btn-ghost btn-sm btn-square"
                      to={`/admin/parcours/module/${module.id}`}
                      aria-label={`Prévisualiser ${module.title}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </PermissionGuard>
                </>
              ) : (
                <span className="text-xs text-base-content/50">
                  Non rattaché
                </span>
              )}
            </div>
          </li>
        ))}
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
