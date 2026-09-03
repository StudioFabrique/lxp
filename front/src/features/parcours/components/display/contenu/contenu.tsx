import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import ContenuItem from "./contenu-item";
import Module from "../../../../../../src/utils/interfaces/module";
import ContenuDetail from "./contenu-detail/contenu-detail";
import ContenuDetailHeader from "./contenu-detail/contenu-detail-header";
import { useContext, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import userBelongsToContacts from "../../../../../utils/helpers/user-belongs-to-contacts";
import { AuthContext } from "../../../../../store/AuthProvider";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { AbilityContext } from "../../../../../rbac/AbilityProvider";
import { Edit, Plus } from "lucide-react";
import { cn } from "../../../../../utils/cn";
import { sortModulesByStartDate } from "../../../helpers/sort-modules-by-start-date";

type ContenuProps = {
  modules: Module[];
};

const INITIAL_MODULE_COUNT = 5;

const Contenu = ({ modules }: ContenuProps) => {
  const sortedModules = useMemo(
    () => sortModulesByStartDate(modules),
    [modules],
  );
  const [showAllModules, setShowAllModules] = useState(false);
  const displayedModules = showAllModules
    ? sortedModules
    : sortedModules.slice(0, INITIAL_MODULE_COUNT);
  const hiddenModuleCount = sortedModules.length - INITIAL_MODULE_COUNT;
  const { user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const { id: parcoursId } = useParams();
  const { data: parcours } = useParcoursQuery(
    parcoursId ? Number(parcoursId) : undefined,
  );

  const [selectedModule, setSelectedModule] = useState<Module | null>(
    sortedModules.find((module) => module.hasAccess !== false) ?? null,
  );

  const canEditParcoursContent =
    parcours?.canManage !== false &&
    (ability.can("update", "parcours") ||
      userBelongsToContacts(user, parcours?.contacts));
  const canEditModule =
    selectedModule?.hasAccess !== false &&
    (ability.can("update", "module") ||
      userBelongsToContacts(user, selectedModule?.contacts));

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-6">
        <span className="flex justify-between">
          <h2 className="text-2xl font-bold text-primary select-none">
            Contenu du parcours
          </h2>
          {canEditParcoursContent && (
            <div>
              <PermissionGuard action="update" object="parcours">
                <Link
                  to={`/admin/parcours/edit/${parcoursId}?step=4&moduleId=${selectedModule?.id}`}
                  className="btn btn-primary text-base-100"
                >
                  <Edit className="h-5 w-5" />
                  Modifier ce module
                </Link>
              </PermissionGuard>
            </div>
          )}
        </span>
        <div
          data-testid="contenu-section"
          className="grid lg:grid-cols-2 gap-x-10 gap-y-5"
        >
          <div className="flex flex-col gap-y-2">
            {displayedModules.map((module, i) => (
              <ContenuItem
                key={module.id}
                module={module}
                selectedModuleId={selectedModule?.id}
                iterationCount={i + 1}
                setSelectedModule={setSelectedModule}
              />
            ))}
            {hiddenModuleCount > 0 ? (
              <button
                type="button"
                className="btn btn-sm btn-ghost text-primary self-center"
                onClick={() => setShowAllModules((current) => !current)}
                aria-expanded={showAllModules}
              >
                {showAllModules
                  ? "Afficher moins"
                  : `Afficher plus (${hiddenModuleCount})`}
              </button>
            ) : null}
            {canEditParcoursContent && (
              <PermissionGuard action="update" object="parcours">
                <Link
                  to={`/admin/parcours/edit/${parcoursId}?step=4&create=true`}
                  className={cn("btn h-20", {
                    "btn-dash": sortedModules.length === 0,
                  })}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">Créer un nouveau module</span>
                </Link>
              </PermissionGuard>
            )}
          </div>
          {selectedModule?.id && (
            <div className="flex flex-col gap-y-4">
              <ContenuDetailHeader
                imageModuleHeader={selectedModule.thumb}
                title={selectedModule.title}
              />
              <ContenuDetail
                canEdit={canEditModule}
                parcoursId={Number(parcoursId)}
                moduleId={selectedModule.id}
              />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Contenu;
