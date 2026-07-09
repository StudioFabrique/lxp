import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MoveUpRight } from "lucide-react";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import ParcoursTable from "./parcours-table";
import SubBoxWrapper from "../../../components/wrappers/SubBoxWrapper";

export default function LastParcours() {
  const { data: parcours } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
  });

  return (
    <SubBoxWrapper>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">
            Derniers parcours ajoutés
          </h3>
        </div>

        <div className="w-full">
          {parcours && parcours.length > 0 ? (
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
