import { useQuery } from "@tanstack/react-query";
import { Eye, MoveUpRight, Pencil } from "lucide-react";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import SubBoxWrapper from "../../../components/wrappers/SubBoxWrapper";
import { localeDate } from "../../../utils/helpers/locale-date";
import { dashboardAdminApi } from "../api/dashboard-admin.api";

export default function LastModules() {
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["dashboard", "last-modules"],
    queryFn: dashboardAdminApi.queries.getLastModules,
  });

  return (
    <SubBoxWrapper>
      <div className="p-2">
        <h3 className="text-xl font-bold text-primary">Derniers modules créés</h3>
        {isLoading ? (
          <span className="loading loading-spinner loading-sm my-5" />
        ) : modules.length ? (
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2 text-sm">
              <thead><tr><th>Module</th><th>Parcours</th><th>Cours</th><th>Créé le</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="bg-base-100 shadow-sm">
                    <td className="rounded-l-lg font-semibold">{module.title}</td>
                    <td>{module.parcours ?? "Non rattaché"}</td>
                    <td>{module.coursesCount}</td>
                    <td>{localeDate(module.createdAt)}</td>
                    <td className="rounded-r-lg">
                      <div className="flex justify-end gap-1">
                        {module.metadataId && module.parcoursId ? (
                          <>
                            <PermissionGuard action="read" object="module">
                              <Link className="btn btn-ghost btn-sm btn-circle tooltip tooltip-left" data-tip="Prévisualiser" to={`/admin/parcours/module/${module.metadataId}`} aria-label={`Prévisualiser ${module.title}`}><Eye className="w-4 h-4" /></Link>
                            </PermissionGuard>
                            <PermissionGuard action="update" object="module">
                              <Link className="btn btn-ghost btn-sm btn-circle tooltip tooltip-left" data-tip="Modifier dans le parcours" to={`/admin/parcours/edit/${module.parcoursId}?step=4&moduleId=${module.metadataId}`} aria-label={`Modifier ${module.title}`}><Pencil className="w-4 h-4" /></Link>
                            </PermissionGuard>
                          </>
                        ) : <span className="text-xs text-base-content/50">Non rattaché</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-base-content/70 italic py-4">Aucun module trouvé.</p>}
        <div className="flex justify-end mt-2"><Link className="text-sm font-semibold text-primary flex items-center gap-1" to="/admin/module">Voir tous les modules <MoveUpRight className="w-4 h-4" /></Link></div>
      </div>
    </SubBoxWrapper>
  );
}
