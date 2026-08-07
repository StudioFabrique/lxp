import { Link } from "react-router";
import { MoveUpRight } from "lucide-react";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import LastParcoursItem from "./last-parcours-item";

type LastParcoursProps = {
  parcours: FormationParcoursSummary[];
  isLoading: boolean;
};

export default function LastParcours({
  parcours,
  isLoading,
}: LastParcoursProps) {
  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xl w-full font-bold text-primary">
          Derniers parcours ajoutés
        </h3>
        {parcours.length > 0 && (
          <div className="w-full flex justify-end mt-4">
            <Link
              className="text-sm font-semibold text-primary hover:text-primary-focus flex items-center gap-x-1 transition-colors"
              to="/admin/parcours"
            >
              Voir tous les parcours <MoveUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="w-full mt-4">
        {isLoading ? (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                className="h-72 skeleton rounded-box"
                key={item}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {parcours.slice(0, 6).map((formation) => (
              <LastParcoursItem key={formation.id} formation={formation} />
            ))}
            <LastParcoursItem />
          </div>
        )}
      </div>
    </div>
  );
}
