import { useContext, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { MoveUpRight } from "lucide-react";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import LastParcoursItem from "./last-parcours-item";
import QuickActions from "./quick-actions";
import FormationModal from "../../formation/components/FormationModal";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import ParcoursCreationModal from "../../parcours/components/create/ParcoursCreationModal";
import { cn } from "../../../utils/cn";

type LastParcoursProps = {
  parcours: FormationParcoursSummary[];
  isLoading: boolean;
  showQuickActions?: boolean;
  sideContent?: ReactNode;
};

export default function LastParcours({
  parcours,
  isLoading,
  showQuickActions = true,
  sideContent,
}: LastParcoursProps) {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const displayedFormations = parcours.slice(0, 6);
  const usesFullWidthLayout = isTeacher && displayedFormations.length === 1;
  const gridClassName = cn(usesFullWidthLayout
    ? "grid-cols-1"
    : isTeacher && displayedFormations.length === 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-2 xl:grid-cols-3");
  const [searchParams, setSearchParams] = useSearchParams();
  const [formationModal, setFormationModal] = useState<{
    isOpen: boolean;
    formationId: number | null;
  }>({
    isOpen: searchParams.get("createFormation") === "true",
    formationId: null,
  });
  const [parcoursFormationId, setParcoursFormationId] = useState<number | null>(null);
  const isParcoursModalOpen =
    parcoursFormationId !== null || searchParams.get("createParcours") === "true";
  const requestedFormationId = Number(searchParams.get("formationId"));
  const initialFormationId = parcoursFormationId && parcoursFormationId > 0
    ? parcoursFormationId
    : Number.isInteger(requestedFormationId) && requestedFormationId > 0
      ? requestedFormationId
      : undefined;

  const closeParcoursModal = () => {
    setParcoursFormationId(null);
    if (searchParams.has("createParcours")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createParcours");
      nextSearchParams.delete("formationId");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const openFormationModal = () => {
    setFormationModal({ isOpen: true, formationId: null });
  };

  const closeFormationModal = () => {
    setFormationModal({ isOpen: false, formationId: null });
    if (searchParams.has("createFormation")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createFormation");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  return (
    <div className="p-2">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {parcours.length > 0 && (
          <h3 className="text-xl font-bold text-primary select-none">
            Derniers parcours ajoutés
          </h3>
        )}
        {showQuickActions && (
          <QuickActions
            onCreateFormation={openFormationModal}
            onCreateParcours={() => setParcoursFormationId(-1)}
          />
        )}
      </div>

      <div className={cn("mt-4 grid items-start gap-x-6 gap-y-2", sideContent && "2xl:grid-cols-[minmax(0,1fr)_20rem]")}>
        <div className="min-w-0">
          {isLoading ? (
            <div className={cn("grid gap-5", gridClassName)}>
              {[0, 1, 2].map((item) => (
                <div
                  className="h-72 skeleton rounded-box"
                  key={item}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : (
            <div className={cn("grid items-start gap-5", gridClassName)}>
              {displayedFormations.map((formation) => (
                <LastParcoursItem
                  key={formation.id}
                  formation={formation}
                  fullWidth={usesFullWidthLayout}
                  disableHoverScale
                  isManagementView
                  onCreateParcours={setParcoursFormationId}
                />
              ))}
              <PermissionGuard action="write" object="parcours">
                <LastParcoursItem
                  onCreateFormation={openFormationModal}
                  isFirstFormation={displayedFormations.length === 0}
                />
              </PermissionGuard>
            </div>
          )}
          {parcours.length > 0 && (
            <div className="mt-2 flex justify-end">
              <Link
                className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline select-none"
                to="/admin/parcours"
              >
                Voir tous les parcours <MoveUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
        {sideContent && <div className="mt-4 flex min-w-0 2xl:col-start-2 2xl:row-start-1 2xl:mt-0">{sideContent}</div>}
      </div>
      {formationModal.isOpen || searchParams.get("createFormation") === "true" ? (
        <FormationModal formationId={formationModal.formationId} onClose={closeFormationModal} />
      ) : null}
      {isParcoursModalOpen ? (
        <ParcoursCreationModal
          initialFormationId={initialFormationId}
          onClose={closeParcoursModal}
        />
      ) : null}
    </div>
  );
}
