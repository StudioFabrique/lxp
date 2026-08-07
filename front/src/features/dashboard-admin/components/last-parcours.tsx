import { Link } from "react-router";
import { MoveUpRight } from "lucide-react";
import ParcoursTable from "./parcours-table";
import SubBoxWrapper from "../../../components/wrappers/SubBoxWrapper";
import type ParcoursSummary from "../interfaces/parcours-summary";

type LastParcoursProps = {
  parcours: ParcoursSummary[];
  isLoading: boolean;
};

export default function LastParcours({
  parcours,
  isLoading,
}: LastParcoursProps) {
  return (
    <SubBoxWrapper>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">
            Derniers parcours ajoutés
          </h3>
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-sm text-primary" />
            </div>
          ) : parcours.length > 0 ? (
            <ParcoursTable parcoursList={parcours} />
          ) : (
            <p className="text-base-content/70 italic py-4">
              Aucun parcours trouvé.
            </p>
          )}
        </div>

        <div className="w-full flex justify-end mt-2">
          <Link
            className="text-sm font-semibold text-primary hover:text-primary-focus flex items-center gap-x-1 transition-colors"
            to="/admin/parcours"
          >
            Voir tous les parcours <MoveUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SubBoxWrapper>
  );
}
