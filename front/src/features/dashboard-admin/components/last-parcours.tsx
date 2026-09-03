import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { MoveUpRight } from "lucide-react";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import LastParcoursItem from "./last-parcours-item";
import QuickActions from "./quick-actions";
import FormationModal from "../../formation/components/FormationModal";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";

type LastParcoursProps = {
  parcours: FormationParcoursSummary[];
  isLoading: boolean;
};

export default function LastParcours({
  parcours,
  isLoading,
}: LastParcoursProps) {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const displayedFormations = parcours.slice(0, 6);
  const displayedParcoursCount = displayedFormations.reduce(
    (count, formation) => count + formation.parcours.length,
    0,
  );
  const usesSingleParcoursLayout = isTeacher && displayedParcoursCount === 1;
  const gridClassName = usesSingleParcoursLayout
    ? "grid-cols-1"
    : "lg:grid-cols-2 xl:grid-cols-3";
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormationModalOpen, setIsFormationModalOpen] = useState(
    searchParams.get("createFormation") === "true",
  );

  const openFormationModal = () => {
    setIsFormationModalOpen(true);
    emitOnboardingEvent({ type: "formation_entry_clicked" });
  };

  const closeFormationModal = () => {
    setIsFormationModalOpen(false);
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
        <QuickActions onCreateFormation={openFormationModal} />
      </div>

      <div className="w-full mt-4">
        {isLoading ? (
          <div className={`grid gap-5 ${gridClassName}`}>
            {[0, 1, 2].map((item) => (
              <div
                className="h-72 skeleton rounded-box"
                key={item}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <div className={`grid items-start gap-5 ${gridClassName}`}>
            {displayedFormations.map((formation) => (
              <LastParcoursItem
                key={formation.id}
                formation={formation}
                fullWidth={usesSingleParcoursLayout}
              />
            ))}
            <PermissionGuard action="write" object="parcours">
              <LastParcoursItem onCreateFormation={openFormationModal} />
            </PermissionGuard>
          </div>
        )}
      </div>
      {parcours.length > 0 && (
        <div className="flex justify-end mt-2">
          <Link
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline select-none"
            to="/admin/parcours"
          >
            Voir tous les parcours <MoveUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      {isFormationModalOpen ? (
        <FormationModal onClose={closeFormationModal} />
      ) : null}
    </div>
  );
}
